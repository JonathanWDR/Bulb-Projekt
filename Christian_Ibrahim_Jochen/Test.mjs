//ALte IP Methode neuer Push test
// import * as dotenv from 'dotenv';
// dotenv.config();

// import * as TPLink from 'tplink-bulbs';

// // Zugangsdaten aus der .env
// const email = process.env.TAPO_EMAIL;
// const password = process.env.TAPO_PASSWORD;
// const ip = '192.168.0.77'; // Lokale IP der Lampe

// if (!email || !password || !ip) {
//   console.error("Fehlende Zugangsdaten! Bitte .env prüfen.");
//   process.exit(1);
// }

// async function run() {
//   // Direkter Login per IP (umgeht ARP-Problem)
//   const device = await TPLink.API.loginDeviceByIp(email, password, ip);

//   // Gerätedaten holen
//   const info = await device.getDeviceInfo();
//   console.log('Geräte-Info:', info);

//   // Lampe einschalten und Farbe wechseln
//   await device.turnOn();
//   await device.setColour('violet');
//   await TPLink.API.delay(500);

//   await device.setColour('red');
//   await TPLink.API.delay(500);

//   await device.setColour('orange');
//   await TPLink.API.delay(500);

//   //await device.turnOff();
// }

// run().catch(console.error);


//Neue Methode mit Device ID und ARP gelöst einfach mit anpingen damit Mac die IP in den Cache bekommt
import * as dotenv from 'dotenv';
dotenv.config();

import * as TPLink from 'tplink-bulbs';

const email = process.env.TAPO_EMAIL;
const password = process.env.TAPO_PASSWORD;
const deviceId = process.env.TAPO_DEVICE_ID;

async function run() {
  // Cloud-Login
  const cloudApi = await TPLink.API.cloudLogin(email, password);

  // Alle Tapo-Birnen holen
  const devices = await cloudApi.listDevicesByType('SMART.TAPOBULB');
  console.log('Gefundene Geräte:', devices.length);

  // Richtige Lampe raussuchen
  const targetDevice = devices.find(device => device.deviceId === deviceId);
  if (!targetDevice) {
    console.error(`Gerät mit ID ${deviceId} nicht gefunden.`);
    return;
  }

  // Jetzt funktioniert's: Lokale Verbindung per ARP (kein IP nötig)
  const device = await TPLink.API.loginDevice(email, password, targetDevice);

  const info = await device.getDeviceInfo();
  console.log('Geräte-Info:', info);


   await device.turnOn();
  // await TPLink.API.delay(500);
  // await device.turnOff();

  // await device.setColour('red');
  // await TPLink.API.delay(500);

  // await device.setColour('orange');
  // await TPLink.API.delay(500);

  //await device.turnOff();
}

run().catch(console.error);
