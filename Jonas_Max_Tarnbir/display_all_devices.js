import * as TPLink from 'tplink-bulbs';
import dotenv from 'dotenv';

dotenv.config();

const email = process.env.TPLINK_USERNAME;
const password = process.env.TPLINK_PASSWORD;

if (!email || !password) {
  console.error('Fehlende Umgebungsvariablen');
  process.exit(1);
}

try {
  const cloudApi = await TPLink.API.cloudLogin(email, password);
  const devices = await cloudApi.listDevicesByType('SMART.TAPOBULB');

  if (devices.length === 0) {
    console.log('Keine Birnen gefunden.');
  } else {
    console.log('Gefundene Birnen:');
    devices.forEach((device, index) => {
      console.log(`\n[#${index + 1}]`);
      console.log(`Name:      ${device.deviceName}`);
      console.log(`Model:     ${device.deviceModel}`);
      console.log(`Device ID: ${device.deviceId}`);
      console.log(`Alias:     ${device.alias}`);
    });
  }
} catch (error) {
  console.error('Fehler bei der Verbindung zu TP-Link Cloud:', error.message || error);
}
