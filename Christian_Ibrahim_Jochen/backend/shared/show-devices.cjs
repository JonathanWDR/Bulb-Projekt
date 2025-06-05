const { login } = require('tplink-cloud-api');

(async () => {
  try {
    const tplink = await login('ibrtkc@yahoo.com', 'dypzeG-myxpez-1wukqe', 'de');

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
