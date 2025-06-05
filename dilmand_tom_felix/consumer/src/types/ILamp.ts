export interface ILampState {
    poweredOn: boolean;
    brightness: number; // 0-100
    color: string; // z.B. HEX-Wert oder Farbname
}
export interface ILampDevice {
    turnOn(): Promise<void>;
    turnOff(): Promise<void>;
    setBrightness(value: number): Promise<void>;
    setColour(color: string): Promise<void>; // Beachte britische Schreibweise in deinem Original
    getCurrentState(): Promise<ILampState>; // Nützlich für Synchronisation
}

export interface ILampDevice {
    turnOn(): Promise<void>;
    turnOff(): Promise<void>;
    setBrightness(value: number): Promise<void>;
    setColour(color: string): Promise<void>;
    getCurrentState(): Promise<ILampState>;

    // 🆕 Ergänzung für Morse-Funktion
    playMorse(message: string): Promise<void>;
}
