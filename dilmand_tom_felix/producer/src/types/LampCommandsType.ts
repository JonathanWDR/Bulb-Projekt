export type LampCommandType = 'on' | 'off' | 'brightness' | 'color' | 'morse';

export interface LampCommandBase {
    command: LampCommandType;
}

// Bestehende Kommandos
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

// Neues Morsecode-Kommando
export interface SendMorseCommand extends LampCommandBase {
    command: 'morse';
    value: string; // Der zu morsende Text
}

// Typunion aller erlaubten Kommandos
export type LampCommand =
    | TurnOnCommand
    | TurnOffCommand
    | SetBrightnessCommand
    | SetColorCommand
    | SendMorseCommand; // hinzugefügt
