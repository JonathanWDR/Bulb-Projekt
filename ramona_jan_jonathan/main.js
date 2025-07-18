import * as TPLink from 'tplink-bulbs';

const email = 'your-email@example.com';
const password = 'your-password';
const deviceId = 'your-device-id';

async function run() {
    const cloudApi = await TPLink.API.cloudLogin(email, password);

    const devices = await cloudApi.listDevicesByType('SMART.TAPOBULB');
    console.log(devices);
    const targetDevice = devices.find(device => device.deviceId === deviceId);

    if (!targetDevice) {
        console.error(`Device with ID "${deviceId}" not found.`);
        return;
    }

    const device = await TPLink.API.loginDevice(email, password, targetDevice);

    const info = await device.getDeviceInfo();
    console.log('Device Info:', info);

    await device.turnOn();
    await device.setColour('violet');
    await TPLink.API.delay(500);

    await device.setColour('red');
    await TPLink.API.delay(500);

    await device.setColour('orange');
    await TPLink.API.delay(500);

    //...
}

run().catch(console.error);