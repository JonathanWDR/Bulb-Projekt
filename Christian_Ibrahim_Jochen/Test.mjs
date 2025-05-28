import * as dotenv from 'dotenv';
dotenv.config();

import * as TPLink from 'tplink-bulbs';

// Zugangsdaten aus der .env
const email = process.env.TAPO_EMAIL;
const password = process.env.TAPO_PASSWORD;
const ip = '192.168.216.238'; // Lokale IP der Lampe

if (!email || !password || !ip) {
  console.error("Fehlende Zugangsdaten! Bitte .env prüfen.");
  process.exit(1);
}

async function run() {
  // Direkter Login per IP (umgeht ARP-Problem)
  const device = await TPLink.API.loginDeviceByIp(email, password, ip);

  // Gerätedaten holen
  const info = await device.getDeviceInfo();
  console.log('Geräte-Info:', info);

  // Lampe einschalten und Farbe wechseln
  await device.turnOn();
  await device.setColour('violet');
  await TPLink.API.delay(500);

  await device.setColour('red');
  await TPLink.API.delay(500);

  await device.setColour('orange');
  await TPLink.API.delay(500);

  await device.turnOff();
}

run().catch(console.error);
