// import tplink from 'tplink-cloud-api';

const EMAIL = process.env.TPLINK_EMAIL;
const PASSWORD = process.env.TPLINK_PASSWORD;
const DEVICE_ID = process.env.TPLINK_DEVICE_ID;

async function run() {
  try {
    const cloud = await tplink.login(EMAIL, PASSWORD, 'ChrisJochenApp');

    const devices = await cloud.getDeviceList();
    const device = devices.find(d => d.deviceId === DEVICE_ID);

    if (!device) {
      console.error('❌ Gerät nicht gefunden. Bitte DEVICE_ID prüfen.');
      return;
    }

    console.log(`Gerät gefunden: ${device.alias || 'Kein Alias'}`);

    const result = await cloud.sendCommand({
      deviceId: DEVICE_ID,
      requestData: JSON.stringify({
        'smartlife.iot.smartbulb.lightingservice': {
          'transition_light_state': {
            'on_off': 1
          }
        }
      })
    });

    console.log('Lampe erfolgreich eingeschaltet:', result);
  } catch (err) {
    if (
      err.response?.data?.error_code === -20571 ||
      err.message?.includes('Device is offline')
    ) {
      console.error('Die Lampe ist offline oder nicht cloudverbunden.');
      console.error('Öffne die Kasa-App und aktiviere Cloud-Zugriff.');
    } else {
      console.error('Unerwarteter Fehler:', err.message || err);
    }
  }
}

run();
