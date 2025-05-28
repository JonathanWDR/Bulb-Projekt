class MockDevice {
  async turnOn() {
    console.log("💡 [MOCK] Gerät an");
  }
  async turnOff() {
    console.log("🔌 [MOCK] Gerät aus");
  }
  async toggle() {
    console.log("🔄 [MOCK] Gerät getoggelt");
  }
  async setBrightness(level) {
    console.log(`🔆 [MOCK] Helligkeit auf ${level}%`);
  }
  async setColour(col) {
    console.log(`🎨 [MOCK] Farbe auf ${col}`);
  }
  async setColorTemperature(kelvin) {
    console.log(`🌡️ [MOCK] Farbtemperatur auf ${kelvin}K`);
  }
}
export function createDevice() {
  //später dann echtes Device
  console.log("🔧 [MOCK] createDevice() aufgerufen, liefere MockDevice");
  return new MockDevice();
}
