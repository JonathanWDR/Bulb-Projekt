
export type LampCommandType = 'on' | 'off' | 'brightness' | 'color';

export interface LampCommandBase {
    command: LampCommandType;
}

export interface TurnOnCommand extends LampCommandBase {
    command: 'on';
}

export interface TurnOffCommand extends LampCommandBase {
    command: 'off';
}

export interface SetBrightnessCommand extends LampCommandBase {
    command: 'brightness';
    value: number;
}

export interface SetColorCommand extends LampCommandBase {
    command: 'color';
    value: string;
}

export type LampCommand = TurnOnCommand | TurnOffCommand | SetBrightnessCommand | SetColorCommand;
