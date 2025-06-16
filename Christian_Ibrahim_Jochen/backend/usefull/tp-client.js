// const login = require('tplink-bulbs');

// let device; // global speichern

// async function connectToDevice() {
//   if (device) return device;

//   try {
//     const cloud = await login('ibrtkc@yahoo.com', 'dypzeG-myxpez-1wukqe'); // ✅ Zugangsdaten hier
//     const deviceId = '8023C48528797B47756D91E839E4C966237FB3C7'; // 🟡 HIER echte ID einsetzen

//     const dev = await cloud.getDeviceById(deviceId);
//     await dev.getSysInfo(); // Verbindung testen
//     console.log("✅ Verbindung zur Lampe hergestellt");

//     device = dev;
//     return device;
//   } catch (err) {
//     console.error("❌ Verbindung zur Lampe fehlgeschlagen:", err);
//     throw err;
//   }
// }

// async function turnOn() {
//   const dev = await connectToDevice();
//   await dev.turnOn();
//   console.log("💡 Lampe eingeschaltet");
// }

// async function turnOff() {
//   const dev = await connectToDevice();
//   await dev.turnOff();
//   console.log("🔌 Lampe ausgeschaltet");
// }

// async function setColor(hex, saturation = 100, brightness = 100) {
//   const dev = await connectToDevice();
//   await dev.setColor(hex, saturation, brightness);
//   console.log(`🎨 Farbe gesetzt: ${hex}, Sättigung: ${saturation}%, Helligkeit: ${brightness}%`);
// }

// module.exports = {
//   connectToDevice,
//   turnOn,
//   turnOff,
//   setColor
// };
