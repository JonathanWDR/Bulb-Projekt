import * as TPLink from 'tplink-bulbs';
import { config } from 'dotenv';
import { ILampDevice } from '../types/ILamp';

config();

const email = process.env.TPLINK_EMAIL;
const password = process.env.TPLINK_PASSWORD;
const deviceIP = process.env.TPLINK_DEVICE_IP;


export async function createTplinkDeviceConnection(): Promise<ILampDevice> {
  if (!email || !password || !deviceIP) {
    throw new Error('TPLINK_EMAIL, TPLINK_PASSWORD, and TPLINK_DEVICE_IP must be set in .env');
  }
  const device = await TPLink.API.loginDeviceByIp(email, password, deviceIP);
  if (!device) {
    throw new Error('Failed to connect to TP-Link device');
  }
  return device;
}