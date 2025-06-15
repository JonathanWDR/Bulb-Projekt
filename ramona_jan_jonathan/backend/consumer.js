const amqp = require('amqplib');
const axios = require('axios');
const TPLink = require('tplink-bulbs');
require('dotenv').config();

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
    const deviceInfo = await device.getDeviceInfo();
    console.log('🔍 Device info:', deviceInfo);

    lampState.poweredOn = deviceInfo.device_on;
    lampState.brightness = deviceInfo.brightness;
    lampState.color = deviceInfo.color_mode;
    console.log('Initial Lamp State:', lampState);

    console.log('⚙️ Starting queue consumer...');
    await consume(device);
}

const QUEUE = 'led_control';

async function consume(device) {
    const conn = await amqp.connect('amqp://localhost');
    const ch = await conn.createChannel();
    await ch.assertQueue(QUEUE);

    ch.consume(QUEUE, async (msg) => {
        if (msg !== null) {
            const state = msg.content.toString();
            console.log('📩 Received from queue (consumer):', state);

            const newState = JSON.parse(state);

            // Track if any change was made
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
                console.log(`Setting color to ${lampState.color}`);
            }

            ch.ack(msg);
        }
    });
}



initConsumer();
