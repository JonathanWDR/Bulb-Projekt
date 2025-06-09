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

  // 🆕 Morsecode-Funktion – wandelt Text in Morsecode und blinkt die Lampe entsprechend
  async playMorse(text: string) {
    const morseMap: { [char: string]: string } = {
      a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.",
      h: "....", i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.",
      o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-",
      u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
      "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
      "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
      " ": "/"
    };

    const morse = text.toLowerCase().split("").map(c => morseMap[c] || "").join(" ");
    console.log(`Morse für "${text}": ${morse}`);

    for (const char of morse) {
      if (char === ".") {
        await this.flash(1000);     // kurzer Blink
      } else if (char === "-") {
        await this.flash(1500);     // langer Blink
      } else if (char === "/") {
        await this.pause(4000);     // Wortpause
      } else {
        await this.pause(2000);     // Buchstabenpause
      }
    }
  }

  // Lampe kurz an- und ausschalten
  private async flash(duration: number) {
    this.state.poweredOn = true;
    console.log("Lampe AN");
    await this.pause(duration);
    this.state.poweredOn = false;
    console.log("Lampe AUS");
    await this.pause(500); // kleine Pause zwischen Zeichen
  }

  // Hilfsfunktion für Pausen
  private pause(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
