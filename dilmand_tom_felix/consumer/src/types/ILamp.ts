import * as TPLink from 'tplink-bulbs';
export interface ILampState {
    poweredOn: boolean;
    brightness: number;
    color: string;
};
export interface ILampDevice {
    turnOn: () => Promise<void>;
    turnOff: () => Promise<void>;
    setBrightness: (brightnessLevel?: number) => Promise<void>;
    setSaturation: (saturation: number) => Promise<void>;
    setHue: (hue: number) => Promise<void>;
    setColour: (colour?: string) => Promise<void>;
    setHSL: (hue: number, sat: number, lum: number) => Promise<void>;
    getDeviceInfo: () => Promise<TPLink.API.TapoDeviceInfo>;
    getEnergyUsage: () => Promise<TPLink.API.TapoDeviceInfo>;
    getCurrentState: () => Promise<ILampState>;
}
