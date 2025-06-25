import * as TPLink from 'tplink-bulbs';
import { config } from 'dotenv';
import { ILampDevice, ILampState } from '../types/ILamp';

config();

const email = process.env.TPLINK_EMAIL;
const password = process.env.TPLINK_PASSWORD;
const deviceIP = process.env.TPLINK_DEVICE_IP;


export async function createTplinkDeviceConnection(): Promise<ILampDevice> {
  if (!email || !password || !deviceIP) {
    throw new Error('TPLINK_EMAIL, TPLINK_PASSWORD, and TPLINK_DEVICE_IP must be set in .env');
  }

  // Timeout-Version der Verbindungsfunktion
  const devicePromise = TPLink.API.loginDeviceByIp(email, password, deviceIP);
  
  // Wir geben der Verbindung max. 5 Sekunden Zeit
  const timeoutPromise = new Promise<null>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Connection timeout after 5 seconds'));
    }, 5000);
  });

  // Race: Wer zuerst fertig ist (Verbindung oder Timeout) gewinnt
  const device = await Promise.race([devicePromise, timeoutPromise]);
  
  if (!device) {
    throw new Error('Failed to connect to TP-Link device');
  }

  // Initialize state object
  const state: ILampState = {
    poweredOn: false,
    brightness: 100,
    color: 'white'
  };

  const enhancedDevice: ILampDevice = {
    // Original methods
    getDeviceInfo: device.getDeviceInfo,
    getEnergyUsage: device.getEnergyUsage,
    setSaturation: device.setSaturation,
    setHue: device.setHue,

    // Override methods to update local state
    turnOn: async () => {
      await device.turnOn();
      state.poweredOn = true;
    },

    turnOff: async () => {
      await device.turnOff();
      state.poweredOn = false;
    },

    setBrightness: async (brightnessLevel?: number) => {
      await device.setBrightness(brightnessLevel);
      if (brightnessLevel !== undefined) {
        state.brightness = brightnessLevel;
      }
    },

    setColour: async (colour?: string) => {
      const hsl = hexToHSL(colour || '#FFFFFF'); // Default to white if no colour provided
      await device.setHSL(hsl.hue, hsl.sat, hsl.lum);
      if (colour) {
        state.color = colour;
      }
    },

    getCurrentState: async (): Promise<ILampState> => {
      return { ...state };
    },

    setHSL: function (hue: number, sat: number, lum: number): Promise<void> {
      throw new Error('Function not implemented.');
    }
  };

  return enhancedDevice;
}



function hexToHSL(hex: string): { hue: number; sat: number; lum: number } {
  // Remove optional leading #
  hex = hex.replace(/^#/, "");

  // Validate hex length
  if (![3, 6].includes(hex.length)) {
    throw new Error("Invalid HEX color.");
  }

  // Convert shorthand HEX (#abc) to full form (#aabbcc)
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Parse R, G, B values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h *= 60;
  }
  const hsl = {
    hue: Math.round(h),
    sat: Math.round(s * 100),
    lum: Math.round(l * 100),
  };
  return hsl;
}


