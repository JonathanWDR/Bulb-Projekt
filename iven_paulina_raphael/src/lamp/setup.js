import * as TPLink from 'tplink-bulbs';

export async function setupLamp(email, password, deviceId) {
  try {
    const cloudApi = await TPLink.API.cloudLogin(email, password);
    const devices = await cloudApi.listDevicesByType('SMART.TAPOBULB');
    const targetDevice = devices.find(d => d.deviceId === deviceId);
    if (!targetDevice) throw new Error('Gerät nicht gefunden.');

    const device = await TPLink.API.loginDevice(email, password, targetDevice);
    console.log('Lampe erfolgreich eingerichtet.');

    return { device, cloudApi };
  } catch (err) {
    console.error('Fehler beim Setup der Lampe:', err.message);
    throw err;
  }
}
