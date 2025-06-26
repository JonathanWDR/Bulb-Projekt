const amqp = require('amqplib');
const axios = require('axios');
const TPLink = require('tplink-bulbs');
require('dotenv').config();
require('./websocket');


const email = process.env.TP_EMAIL;
const password = process.env.TP_PASSWORD;
const deviceIdToFind = process.env.TP_DEVICE_ID;

if (!email || !password) {
    throw new Error('Missing EMAIL, PASSWORD or DEVICE_ID in environment');
}

const lampState = {
    poweredOn: false,
    brightness: 100,
    color: 'unknown',
};

async function initConsumer() {
    const cloudApi = await TPLink.API.cloudLogin(email, password);
    const devices = await cloudApi.listDevicesByType('SMART.TAPOBULB');
    


    if (!devices) {
        console.log(`No registered devices found.`);
        return;
    }
    console.log('💡 Found ', devices.length, 'Devices connected with account:', devices, ':');
    for (d of devices) {
      console.log(`${d.name} (${d.deviceId})`);
    }
    
    targetDevice = devices[0]
    console.log("Target device ID: ", targetDevice.deviceId)

    console.log("\n Checking if device is online...")
    const device = await TPLink.API.loginDevice(email, password, targetDevice);
    const initDeviceInfo = await device.getDeviceInfo();
    console.log('🔍 Device info:', initDeviceInfo);

    lampState.poweredOn = initDeviceInfo.device_on;
    lampState.brightness = initDeviceInfo.brightness;
    lampState.color = hsvToHex(initDeviceInfo.hue, initDeviceInfo.saturation, 100);
    console.log('Initial Lamp State:', lampState);

    broadcastState();

    console.log('*** Starting consumer queue...');
    await consume(device);
}

async function broadcastState() {
    if (global.wsClients) {
        global.wsClients.forEach(ws => {
            if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify(lampState));
                console.log('📡 Broadcasted state to WebSocket clients:', lampState);
            }
        });
    }
}

const QUEUE = 'led_control';

async function consume(device) {
    const conn = await amqp.connect('amqp://localhost');
    const ch = await conn.createChannel();
    await ch.assertQueue(QUEUE);

    ch.consume(QUEUE, async (msg) => {
        if (msg !== null) {
            const newMsg = msg.content.toString();
            console.log('📩 Received from queue (consumer):', newMsg);

            parsedMsg = JSON.parse(newMsg);
            const deviceInfo = await device.getDeviceInfo();

            lampState.poweredOn = deviceInfo.device_on;
            lampState.brightness = deviceInfo.brightness;
            lampState.color = hsvToHex(deviceInfo.hue, deviceInfo.saturation, 100);

            if (parsedMsg.action === 'getState') {
                console.log('Action found:', parsedMsg.action);
                broadcastState();
            }else{
                const newState = parsedMsg;

                if (newState.poweredOn !== lampState.poweredOn) {
                    lampState.poweredOn = newState.poweredOn;
                    if (lampState.poweredOn) {
                        await device.turnOn();
                        console.log("Device turning on...");
                    } else {
                        await device.turnOff();
                        console.log("Device turning off...");
                    }
                }

                if (newState.brightness !== lampState.brightness) {
                    lampState.brightness = newState.brightness;
                    await device.setBrightness(lampState.brightness);
                    
                    console.log(`Setting brightness to ${lampState.brightness}%`);
                }

                if (newState.color !== lampState.color) {
                    lampState.color = newState.color;
                    await device.setColour(lampState.color);

                    await device.setBrightness(lampState.brightness);
                    
                    console.log(`Setting color to ${lampState.color}`);
                }
            }
            ch.ack(msg);

        }
    });
}

function hsvToHex(h, s, v) {
    // Convert HSV to RGB
    const c = (v / 100) * (s / 100);
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = (v / 100) - c;
    
    let r, g, b;
    
    if (h >= 0 && h < 60) {
        [r, g, b] = [c, x, 0];
    } else if (h >= 60 && h < 120) {
        [r, g, b] = [x, c, 0];
    } else if (h >= 120 && h < 180) {
        [r, g, b] = [0, c, x];
    } else if (h >= 180 && h < 240) {
        [r, g, b] = [0, x, c];
    } else if (h >= 240 && h < 300) {
        [r, g, b] = [x, 0, c];
    } else {
        [r, g, b] = [c, 0, x];
    }
    
    // Convert to 0-255 range
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    // Convert to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

initConsumer();
