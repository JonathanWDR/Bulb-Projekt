// shared/device.js
import * as dotenv from "dotenv";
dotenv.config();

import * as TPLink from "tplink-bulbs";

const email = process.env.TAPO_EMAIL;
const password = process.env.TAPO_PASSWORD;
const deviceId = process.env.TAPO_DEVICE_ID;

// Optional: MockDevice für Dev-Zwecke
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
    return new MockDevice();
  }

  // console.log("🔧 Verbinde mit Tapo-Gerät…");

  // const cloudApi = await TPLink.API.cloudLogin(email, password);
  // if (!cloudApi) throw new Error("❌ Verbindung zur Tapo-Cloud fehlgeschlagen!");

  // const devices = await cloudApi.listDevicesByType("SMART.TAPOBULB");
  // const targetDevice = devices.find((d) => d.deviceId === deviceId);

  // if (!targetDevice) throw new Error("❌ Gerät nicht gefunden!");

  // const device = await TPLink.API.loginDevice(email, password, targetDevice);
  // console.log("✅ Gerät erfolgreich verbunden");

  // Direkter Login per IP (umgeht ARP-Problem)
  console.log("🔧 Verbinde mit Tapo-Gerät…");

  const device = await TPLink.API.loginDeviceByIp(email, password, "192.168.216.238");

  // Gerätedaten holen
  const info = await device.getDeviceInfo();
  console.log("Geräte-Info:", info);

  console.log("✅ Gerät erfolgreich verbunden");

  return device;
}
