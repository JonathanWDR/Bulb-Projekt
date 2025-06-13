const amqp = require('amqplib');
const axios = require('axios');
const TPLink = require('tplink-bulbs');
require('dotenv').config();

console.log('🔄 In consumer.js');

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
    console.log('💡 Devices found:', devices);

    const targetDevice = devices.find(device => device.deviceId === deviceIdToFind);

    if (!targetDevice) {
        console.log(`⚠️ Device with ID "${deviceIdToFind}" not found.`);
        return;
    }

    const device = await TPLink.API.loginDevice(email, password, targetDevice);
    const deviceInfo = await device.getDeviceInfo();
    console.log('🔍 Device info:', deviceInfo);

    lampState.poweredOn = deviceInfo.device_on;
    lampState.brightness = deviceInfo.brightness;
    lampState.color = 'unknown';

    console.log('⚙️ Starting queue consumer...');
    await consume(device);
}

const QUEUE = 'led_control';

async function consume() {
    const conn = await amqp.connect('amqp://localhost');
    const ch = await conn.createChannel();
    await ch.assertQueue(QUEUE);

    ch.consume(QUEUE, async (msg) => {
        if (msg !== null) {
            const state = msg.content.toString();
            console.log('📩 Received from queue:', state);

            console.log('🔄 API Call would happen here');

            ch.ack(msg);
        }
    });
}

// ✅ This avoids top-level await and async module errors
//initConsumer();
consume();
