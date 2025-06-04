import { ILampDevice, ILampState } from "../types/ILamp";

export class MockLampDevice implements ILampDevice {
  private state: ILampState = {
    poweredOn: false,
    brightness: 100,
    color: "white",
  };
  async turnOn() {
    console.log("MockDevice: ON");
    this.state.poweredOn = true;
  }
  async turnOff() {
    console.log("MockDevice: OFF");
    this.state.poweredOn = false;
  }
  async setBrightness(value: number) {
    console.log(`MockDevice: Brightness ${value}`);
    this.state.brightness = value;
  }
  async setColour(color: string) {
    console.log(`MockDevice: Color ${color}`);
    this.state.color = color;
  }
  async getCurrentState() {
    return Promise.resolve(this.state);
  }
}
