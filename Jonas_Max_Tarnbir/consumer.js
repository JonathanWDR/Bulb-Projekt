import amqp from 'amqplib';
import * as TPLink from 'tplink-bulbs';
import 'dotenv/config';
import { WebSocketServer } from 'ws';

const email = process.env.TPLINK_USERNAME;
const password = process.env.TPLINK_PASSWORD;
const deviceIP = '192.168.0.25';

const lampState = {
  poweredOn: false,
  brightness: 100,
  color: 'unknown',
  connected: false
};

const morseTable = {
  "A": ".-",
  "B": "-...",
  "C": "-.-.",
  "D": "-..",
  "E": ".",
  "F": "..-.",
  "G": "--.",
  "H": "....",
  "I": "..",
  "J": ".---",
  "K": "-.-",
  "L": ".-..",
  "M": "--",
  "N": "-.",
  "O": "---",
  "P": ".--.",
  "Q": "--.-",
  "R": ".-.",
  "S": "...",
  "T": "-",
  "U": "..-",
  "V": "...-",
  "W": ".--",
  "X": "-..-",
  "Y": "-.--",
  "Z": "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  " ": " ",
  "_": "..--.-",        
  "@": ".--.-.",       
  "$": "...-..-",       
  "&": ".-...",         
  "(": "-.--.",         
  ")": "-.--.-" 
}

let device = null;
let wss = null;
let clients = null;

try {
  device = await TPLink.API.loginDeviceByIp(email, password, deviceIP);

  const deviceInfo = await device.getDeviceInfo();
  //console.log('Device info:', deviceInfo);

  lampState.poweredOn = deviceInfo.device_on;
  lampState.brightness = deviceInfo.brightness;
  lampState.color = 'unknown'; 
  lampState.connected = true;
  
  console.log('Lamp ready');
  
} catch (error) {
  console.error('Error connecting to the device:', error);
}

consumeLampCommands();
openWebSocket();
broadcast();

wss.on('connection', (ws) => {

  console.log('Client connected');
  clients.add(ws);
  ws.send(JSON.stringify(lampState));

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

});

async function consumeLampCommands() {
  const queueName = 'lamp-command'; 

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
          case 'on':
            lampState.poweredOn = true;
            if (device) await device.turnOn();
            break;
          case 'off':
            lampState.poweredOn = false;
            if (device) await device.turnOff();
            break;
          case 'brightness':
            if (
              typeof cmd.value === 'number' &&
              cmd.value >= 0 &&
              cmd.value <= 100
            ) {
              lampState.brightness = cmd.value;
              if (device) await device.setBrightness(cmd.value);
              console.log(`Lamp brightness set to ${cmd.value}`);
            } else {
              console.log('Brightness must be a number between 0 und 100.');
            }
            break;
          case 'color':
            lampState.color = cmd.value;
            if (device) await device.setColour(cmd.value);
            console.log(`Lamp color set to ${cmd.value}`);
            break;
          case 'morse':
            console.log(`Morscodeblinking starting`);
            if (device) await blinkMorsecode(cmd.value);
            console.log(`Morscodeblinking finished`);
            break;
          default:
            console.log(`Unknown command: ${cmd.command}`);
            break;
        }
        channel.ack(msg);
        console.log("Current state:", lampState);
        broadcast();
      }
    });
  } catch (error) {
    console.error('Error in consumer:', error);
  }
}

function textToMorsecode(text){
  return text.toUpperCase().split('').map( character => morseTable[character] ).join(' ');
}

function wait(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

async function blinkMorsecode(text){
  const DOT =300, DASH=DOT*3,   MORSE_CHARACTER_PAUSE=DOT, LETTER_PAUSE=DOT*3, WORD_PAUSE=DOT*7;
  const morse = textToMorsecode(text);
  console.log('Morsecode: '+morse);

  let morseCharacter;
  for(let i = 0; i<morse.length; i++){
    morseCharacter = morse[i];
    switch(morseCharacter){
      case '.':
        await device.turnOn();
        await wait(DOT);
        await device.turnOff();
        await wait(MORSE_CHARACTER_PAUSE);
        break;
      case '-':
        await device.turnOn();
        await wait(DASH);
        await device.turnOff();
        await wait(MORSE_CHARACTER_PAUSE);
        break;
      case ' ':
        if(i>0 && morse[i-1] === ' '){
          await wait(WORD_PAUSE-LETTER_PAUSE);
        }else{
          await wait(LETTER_PAUSE);
        }
        break;
    }
  }
  if (lampState.poweredOn) {
    await device.turnOn();
  }

}

function broadcast() {
  clients.forEach(c => c.send(JSON.stringify(lampState)));
}

function openWebSocket() {
  wss = new WebSocketServer({ port: 8080 });
  clients = new Set();
  console.log('WebSocket ready on port 8080');
}