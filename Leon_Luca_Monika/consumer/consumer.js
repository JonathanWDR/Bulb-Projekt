import amqp from 'amqplib';
import * as TPLink from 'tplink-bulbs';
import { WebSocketServer } from 'ws';

import 'dotenv/config';


// Morsecode-Tabelle
const morseTable = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
  'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
  'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
  'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
  'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
  'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', ' ': ' '
};

// Morsecode-Timings
const dot = 300; // ms
const dash = dot * 3;
const gap = dot;
const letterGap = dot * 3;
const wordGap = dot * 7;


const email = process.env.TP_EMAIL;
const password = process.env.TP_PASSWORD;
const deviceIdToFind = process.env.TP_DEVICE_ID;

const cloudApi = await TPLink.API.cloudLogin(email, password);
const devices = await cloudApi.listDevicesByType('SMART.TAPOBULB');

console.log("Devices found:", devices);

const targetDevice = devices.find(device => device.deviceId === deviceIdToFind);

const lampState = {
  poweredOn: false,
  brightness: 100,
  color: 'unknown',
};

let device = null;
let deviceAvailable = true;

if (!targetDevice) {
  console.log(`Device with id "${deviceIdToFind}" not found!`);
  deviceAvailable = false;
} else {
  try {
    device = await TPLink.API.loginDevice(email, password, targetDevice);
    const deviceInfo = await device.getDeviceInfo();
    console.log('Device info:', deviceInfo);
    lampState.poweredOn = deviceInfo.device_on;
    lampState.brightness = deviceInfo.brightness;
    lampState.color = 'unknown';
  } catch (err) {
    console.log('WARNUNG: Lampen-Device konnte nicht verbunden werden! Nur UI-Anzeige aktiv.');
    deviceAvailable = false;
  }
}

// Dummy-Device, falls keine Lampe verbunden ist
if (!deviceAvailable) {
  device = {
    async turnOn() { console.log('[Demo] turnOn()'); },
    async turnOff() { console.log('[Demo] turnOff()'); },
    async setBrightness(val) { console.log('[Demo] setBrightness', val); },
    async setColour(val) { console.log('[Demo] setColour', val); },
    async getDeviceInfo() { return {}; }
  };
  // Optional: Setze Lampenstatus auf Standardwerte
  lampState.poweredOn = false;
  lampState.brightness = 100;
  lampState.color = '#ffffff';
}

consumeLampCommands();

// WebSocket-Server für Status-Updates
const wss = new WebSocketServer({ port: 3002 });
function broadcastLampState() {
  const data = JSON.stringify(lampState);
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(data);
    }
  });
}
wss.on('connection', ws => {
  ws.send(JSON.stringify(lampState));
});

async function consumeLampCommands() {
  const queueName = 'lamp-commands';

  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: false });
    console.log('[*] Waiting for messages in:', queueName);

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const rawValue = msg.content.toString();
        let cmd;
        try {
          cmd = JSON.parse(rawValue);
          console.log("JSON", cmd);
        } catch (err) {
          console.error('Invalid JSON message:', rawValue);
          channel.ack(msg);
          return;
        }

        switch (cmd.command) {
          case 'setState':
            if (cmd.value === 'on') {
              await device.turnOn();
              lampState.poweredOn = true;
              broadcastLampState();
              console.log('Lamp state set to ON');
            } else if (cmd.value === 'off') {
              await device.turnOff();
              lampState.poweredOn = false;
              broadcastLampState();
              console.log('Lamp state set to OFF');
            } else {
              console.log('Invalid state value. Use "on" or "off".');
            }
            break;
          case 'setBrightness':
            if (
              typeof cmd.value === 'number' &&
              cmd.value >= 0 &&
              cmd.value <= 100
            ) {
              await device.setBrightness(cmd.value);
              lampState.brightness = cmd.value;
              broadcastLampState();
              console.log(`Lamp brightness set to ${cmd.value}`);
            } else {
              console.log('Brightness must be a number between 0 and 100.');
            }
            break;
          case 'setColor':
            try {
              if (typeof cmd.value === 'string' && /^#[0-9A-Fa-f]{6}$/.test(cmd.value)) {
                await device.setColour(cmd.value.toLowerCase());
                lampState.color = cmd.value.toLowerCase();
                broadcastLampState();
                console.log(`Lamp color set to ${cmd.value}`);
              } else {
                console.log('Invalid color format. Use a hex color code like "#FF0000".');
              }
            } catch (err) {
              console.error('Error in setColor:', err);
            }
            break;
          case 'showMorseCode':
            if (typeof cmd.value === 'string' && cmd.value.trim()) {
              const plainText = cmd.value.trim();
              const morseCode = plainText.toUpperCase().split('').map(c => morseTable[c] || '').join(' ');
              console.log(`Showing Morse code: ${morseCode}`);

              async function blinkMorse(code) {
                let i = 0;
                while (i < code.length) {
                  const symbol = code[i];
                  if (symbol === '.') {
                    await device.turnOn();
                    lampState.poweredOn = true;
                    broadcastLampState();
                    await new Promise(res => setTimeout(res, dot));
                    await device.turnOff();
                    lampState.poweredOn = false;
                    broadcastLampState();
                    // gap zwischen Symbolen (außer nach letztem Symbol im Buchstaben)
                    if (code[i + 1] === '.' || code[i + 1] === '-') {
                      await new Promise(res => setTimeout(res, gap));
                    }
                    i++;
                  } else if (symbol === '-') {
                    await device.turnOn();
                    lampState.poweredOn = true;
                    broadcastLampState();
                    await new Promise(res => setTimeout(res, dash));
                    await device.turnOff();
                    lampState.poweredOn = false;
                    broadcastLampState();
                    // gap zwischen Symbolen (außer nach letztem Symbol im Buchstaben)
                    if (code[i + 1] === '.' || code[i + 1] === '-') {
                      await new Promise(res => setTimeout(res, gap));
                    }
                    i++;
                  } else if (symbol === ' ') {
                    // Prüfe, ob nächstes Zeichen auch ein Leerzeichen ist (Wortabstand)
                    if (code[i + 1] === ' ') {
                      await new Promise(res => setTimeout(res, wordGap));
                      i += 2; // Zwei Leerzeichen überspringen
                    } else {
                      await new Promise(res => setTimeout(res, letterGap));
                      i++;
                    }
                  } else {
                    i++;
                  }
                }
              }

              await blinkMorse(morseCode);
            } else {
              console.log('Invalid Morse code input. Please provide a non-empty string.');
            }
            break;
          default:
            console.log(`Unknown command: ${cmd.command}`);
            break;
        }
        channel.ack(msg);
        console.log("Current state:", lampState);
      }
    });
  } catch (error) {
    console.error('Error in consumer:', error);
  }
}