// import tplink from 'tplink-cloud-api';

// const EMAIL = 'ibrtkc@yahoo.com';
// const PASSWORD = 'dypzeG-myxpez-1wukqe';
// const DEVICE_ID = '8023C48528797B47756D91E839E4C966237FB3C7';

// async function run() {
//   try {
//     const cloud = await tplink.login(EMAIL, PASSWORD, 'ChrisJochenApp');

//     // Geräteliste abrufen
//     const devices = await cloud.getDeviceList();
//     const device = devices.find(d => d.deviceId === DEVICE_ID);

//     if (!device) {
//       console.error('❌ Gerät nicht gefunden. Bitte DEVICE_ID prüfen.');
//       return;
//     }

//     console.log(`✅ Gerät gefunden: ${device.alias || 'Kein Alias'}`);

//     // Befehl senden: Lampe anschalten
//     const result = await cloud.sendCommand({
//       deviceId: DEVICE_ID,
//       requestData: JSON.stringify({
//         'smartlife.iot.smartbulb.lightingservice': {
//           'transition_light_state': {
//             'on_off': 1
//           }
//         }
//       })
//     });

//     console.log('💡 Lampe erfolgreich eingeschaltet:', result);
//   } catch (err) {
//     if (
//       err.response?.data?.error_code === -20571 ||
//       err.message?.includes('Device is offline')
//     ) {
//       console.error('⚠️ Die Lampe ist offline oder nicht cloudverbunden.');
//       console.error('📱 Öffne die Kasa-App und aktiviere Cloud-Zugriff.');
//     } else {
//       console.error('❌ Unerwarteter Fehler:', err.message || err);
//     }
//   }
// }

// run();
