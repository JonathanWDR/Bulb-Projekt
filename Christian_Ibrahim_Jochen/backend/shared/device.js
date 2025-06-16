// shared/device.js
import * as dotenv from 'dotenv';
import * as TPLink from 'tplink-bulbs';

dotenv.config();

const email = process.env.TAPO_EMAIL;
const password = process.env.TAPO_PASSWORD;
//const deviceId = process.env.TAPO_DEVICE_ID;
const ip = process.env.TAPO_IP;

if (!email || !password || !ip) {
  throw new Error("Bitte TAPO_EMAIL, TAPO_PASSWORD und TAPO_IP in .env setzen!");
}



//MockDevice für Dev-Zwecke
class MockDevice {
  async turnOn() {
    console.log("💡 [MOCK] an");
  }
  async turnOff() {
    console.log("🔌 [MOCK] aus");
  }
  async setColour(col) {
    console.log(`🎨 [MOCK] Farbe ${col}`);
  }
  async setBrightness(b) {
    console.log(`🔆 [MOCK] Helligkeit ${b}%`);
  }
}

export async function createDevice() {
  if (process.env.DEV_MODE === "true") {
    console.warn("⚠️ DEV_MODE ist aktiviert! Verwendet jetzt MockDevice.");
    return new MockDevice();
  }

  //Wenn mit Device_ID gearbeitet werden soll, dann hier aktivieren:
  //const cloudApi = await TPLink.API.cloudLogin(email, password);
  //const devices = await cloudApi.listDevicesByType('SMART.TAPOBULB');
  //const targetDevice = devices.find(d => d.deviceId === deviceId);

  //if (!targetDevice) throw new Error("❌ Gerät nicht gefunden!");

  const device = await TPLink.API.loginDeviceByIp(email, password, ip);

  console.log("✅ Gerät erfolgreich verbunden");

  return device;
}
