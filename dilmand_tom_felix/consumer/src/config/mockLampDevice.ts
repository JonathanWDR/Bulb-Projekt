import { ILampDevice, ILampState } from "../types/ILamp";

// Diese Klasse simuliert eine smarte Lampe
// und speichert den aktuellen Zustand lokal.
export class MockLampDevice implements ILampDevice {
  private state: ILampState = {
    poweredOn: false,
    brightness: 100,
    color: "white",
  };

  // Schaltet die Lampe ein
  async turnOn() {
    console.log("MockDevice: ON");
    this.state.poweredOn = true;
  }

  // Schaltet die Lampe aus
  async turnOff() {
    console.log("MockDevice: OFF");
    this.state.poweredOn = false;
  }

  // Setzt die Helligkeit (0–100)
  async setBrightness(value: number) {
    console.log(`MockDevice: Brightness ${value}`);
    this.state.brightness = value;
  }

  // Setzt die Farbe (z. B. "red", "#ff0000")
  async setColour(color: string) {
    console.log(`MockDevice: Color ${color}`);
    this.state.color = color;
  }

  // Gibt den aktuellen Zustand der Lampe zurück
  async getCurrentState() {
    return Promise.resolve(this.state);
  }
}
