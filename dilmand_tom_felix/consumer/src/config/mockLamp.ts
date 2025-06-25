import { ILampDevice, ILampState } from "../types/ILamp";

export class MockLampDevice implements ILampDevice {
    private state: ILampState = {
        poweredOn: false,
        brightness: 100,
        color: "#ffffff"
    };

    async turnOn() { 
        console.log("MockDevice: ON");
        this.state.poweredOn = true; 
    }
    
    async turnOff() { 
        console.log("MockDevice: OFF");
        this.state.poweredOn = false; 
    }
    
    async setBrightness(brightness?: number) {
        console.log(`MockDevice: Brightness ${brightness}`);
        if (brightness !== undefined) this.state.brightness = brightness;
    }
    
    async setColour(colour?: string) {
        console.log(`MockDevice: Color ${colour}`);
        if (colour) this.state.color = colour;
    }
    
    async setSaturation() { /* leer */ }
    async setHue() { /* leer */ }
    async setHSL() { /* leer */ }
    async getDeviceInfo() { 
        return {
            device_id: "mock-device-id",
            name: "Mock Lamp",
            model: "Mock-Model",
            type: "SMART.TAPOBULB",
            fw_version: "1.0.0",
            hw_id: "mock-hw-id",
            hw_ver: "1.0",
            mac: "00:00:00:00:00:00",
            oem_id: "mock-oem-id",
            specs: "mock-specs",
            device_on: this.state.poweredOn,
            brightness: this.state.brightness
        } as any; // Using 'as any' as a temporary solution; replace with proper TapoDeviceInfo type
    }
    async getEnergyUsage() { 
        return {
            current_power: 0,
            today_energy: 0,
            month_energy: 0,
            total_energy: 0
        } as any; // Using 'as any' as a temporary solution; replace with proper TapoDeviceInfo type
    }
    
    async getCurrentState() { 
        return { ...this.state }; 
    }
}