import { ILampDevice } from '../types/ILamp';
import { LampCommand, LampCommandType, SendMorseCommand, SetBrightnessCommand, SetColorCommand } from '../types/LampCommandsType';

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
    async execute(device: ILampDevice, payload: SetBrightnessCommand): Promise<void> {
        if (typeof payload.value === 'number' && payload.value >= 0 && payload.value <= 100) {
            await device.setBrightness(payload.value);
        } else {
            console.warn('Brightness must be a number between 0 and 100.');
            throw new Error('Invalid brightness value');
        }
    }
}

class ColorCommandStrategy implements CommandStrategy {
    async execute(device: ILampDevice, payload: SetColorCommand): Promise<void> {
        await device.setColour(payload.value);
    }
}

class MorseCommandStrategy implements CommandStrategy {
    async execute(device: ILampDevice, payload: SendMorseCommand): Promise<void> {
        await device.playMorse(payload.value)
    }
    
}


export class CommandStrategyFactory {
    private strategies: Map<LampCommandType, CommandStrategy> = new Map();

    constructor() {
        this.strategies.set('on', new OnCommandStrategy());
        this.strategies.set('off', new OffCommandStrategy());
        this.strategies.set('brightness', new BrightnessCommandStrategy());
        this.strategies.set('color', new ColorCommandStrategy());
        this.strategies.set("morse", new MorseCommandStrategy())
    }

    getStrategy(commandType: LampCommandType): CommandStrategy {
        const strategy = this.strategies.get(commandType);
        if (!strategy) {
            throw new Error(`Unknown command type: ${commandType}`);
        }
        return strategy;
    }
}
