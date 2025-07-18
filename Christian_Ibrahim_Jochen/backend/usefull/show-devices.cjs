const { login } = require('tplink-cloud-api');

const EMAIL = process.env.TPLINK_EMAIL;
const PASSWORD = process.env.TPLINK_PASSWORD;

(async () => {
  try {
    const tplink = await login(EMAIL, PASSWORD, 'de');

    const devices = await tplink.getDeviceList();

    console.log('Gefundene Geräte:');
    devices.forEach((device, index) => {
      console.log(`\n#${index + 1}`);
      console.log(`Alias: ${device.alias}`);
      console.log(`Device ID: ${device.deviceId}`);
      console.log(`Model: ${device.deviceModel}`);
    });

  } catch (err) {
    console.error('Fehler beim Abrufen der Geräte:', err.message);
  }
})();
