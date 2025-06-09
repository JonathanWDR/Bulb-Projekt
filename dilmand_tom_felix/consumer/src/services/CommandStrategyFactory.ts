import { ILampDevice } from "../types/ILamp";
import {
    LampCommand,
    LampCommandType,
    SetBrightnessCommand,
    SetColorCommand,
    SendMorseCommand
} from "../types/LampCommandsType";
import { publishLampStatus } from "../config/rabbitmq";
import amqp from 'amqplib';

// Strategy interface
export interface CommandStrategy {
    execute(device: ILampDevice, payload?: LampCommand, channel?: amqp.Channel): Promise<void>;
}

class GetStatusCommandStrategy implements CommandStrategy {
    async execute(device: ILampDevice, payload?: any, channel?: amqp.Channel): Promise<void> {
        const currentState = await device.getCurrentState();
        console.log("Aktueller Status:", currentState);
        if (channel) {
            await publishLampStatus(currentState, channel);
        }
    }
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
        await device.setColour(payload.value);
    }

}

class MorseCommandStrategy implements CommandStrategy {
    async execute(device: ILampDevice, payload: SendMorseCommand, channel: amqp.Channel): Promise<void> {
        const code = payload.value;
        const morseMap: { [char: string]: string } = {
            a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.",
            h: "....", i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.",
            o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-",
            u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
            "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
            "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
            " ": "/"
        };

        const morse = code.toLowerCase().split("").map(c => morseMap[c] || "").join(" ");
        console.log(`Morse für "${code}": ${morse}`);

        for (const char of morse) {
            if (char === ".") {
                await this.flash(device, 1000, channel);     // kurzer Blink
            } else if (char === "-") {
                await this.flash(device, 1500, channel);     // langer Blink
            } else if (char === "/") {
                await this.pause(4000);     // Wortpause
            } else {
                await this.pause(2000);     // Buchstabenpause
            }
        }
    }

    private async flash(device: ILampDevice, duration: number, channel: amqp.Channel): Promise<void> {
        await device.turnOn();
        let currentState = await device.getCurrentState();
        await publishLampStatus(currentState, channel!);
        await this.pause(duration);
        await device.turnOff();
        currentState = await device.getCurrentState();
        await publishLampStatus(currentState, channel!);
        await this.pause(500); 
    }

    private pause(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}


export class CommandStrategyFactory {
    private strategies: Map<LampCommandType, CommandStrategy> = new Map();

    constructor() {
        this.strategies.set('get_status', new GetStatusCommandStrategy());
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
