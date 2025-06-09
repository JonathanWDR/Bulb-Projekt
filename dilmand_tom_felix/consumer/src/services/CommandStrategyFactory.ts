import { ILampDevice } from "../types/ILamp";
import {
  LampCommand,
  LampCommandType,
  SetBrightnessCommand,
  SetColorCommand,
} from "../types/LampCommandsType";

// Strategy interface
export interface CommandStrategy {
  execute(device: ILampDevice, payload?: LampCommand): Promise<void>;
}

class OnCommandStrategy implements CommandStrategy {
  async execute(device: ILampDevice): Promise<void> {
    await device.turnOn();
  }
}

class OffCommandStrategy implements CommandStrategy {
  async execute(device: ILampDevice): Promise<void> {
    await device.turnOff();
  }
}

class BrightnessCommandStrategy implements CommandStrategy {
  async execute(
    device: ILampDevice,
    payload: SetBrightnessCommand
  ): Promise<void> {
    if (
      typeof payload.value === "number" &&
      payload.value >= 0 &&
      payload.value <= 100
    ) {
      await device.setBrightness(payload.value);
    } else {
      console.warn("Brightness must be a number between 0 and 100.");
      throw new Error("Invalid brightness value");
    }
  }
}

class ColorCommandStrategy implements CommandStrategy {
  async execute(device: ILampDevice, payload: SetColorCommand): Promise<void> {
    const hsl = hexToHSL(payload.value);
    await device.setHSL(hsl.hue, hsl.sat, hsl.lum);
  }
}

export class CommandStrategyFactory {
  private strategies: Map<LampCommandType, CommandStrategy> = new Map();

  constructor() {
    this.strategies.set("on", new OnCommandStrategy());
    this.strategies.set("off", new OffCommandStrategy());
    this.strategies.set("brightness", new BrightnessCommandStrategy());
    this.strategies.set("color", new ColorCommandStrategy());
  }

  getStrategy(commandType: LampCommandType): CommandStrategy {
    const strategy = this.strategies.get(commandType);
    if (!strategy) {
      throw new Error(`Unknown command type: ${commandType}`);
    }
    return strategy;
  }
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
