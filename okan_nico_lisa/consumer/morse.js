const morseCodes = {
    'a': '.-',
    'b': '-...',
    'c': '-.-.',
    'd': '-..',
    'e': '.',
    'f': '..-.',
    'g': '--.',
    'h': '....',
    'i': '..',
    'j': '.---',
    'k': '-.-',
    'l': '.-..',
    'm': '--',
    'n': '-.',
    'o': '---',
    'p': '.--.',
    'q': '--.-',
    'r': '.-.',
    's': '...',
    't': '-',
    'u': '..-',
    'v': '...-',
    'w': '.--',
    'x': '-..-',
    'y': '-.--',
    'z': '--..',
    '0': '-----',
    '1': '.----',
    '2': '..---',
    '3': '...--',
    '4': '....-',
    '5': '.....',
    '6': '-....',
    '7': '--...',
    '8': '---..',
    '9': '----.',
    '.': '.-.-.-',
    ',': '--..--',
    '?': '..--..',
    '!': '-.-.--',
    '-': '-....-',
    '/': '-..-.',
    '@': '.--.-.',
    '(': '-.--.',
    ')': '-.--.-',
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function flashMorse(device, text) {
    // turn off bulb in case it was on before
    await device.turnOff()

    const flashTimeUnit = 250; // 1 time unit = 250ms

    for (let i = 0; i < text.length; i++) {
        const char = text[i].toLowerCase();

        // whitespace in input => sleep for 7 units
        if (char === ' ') {
            await sleep(flashTimeUnit * 7);
            continue;
        }

        const code = morseCodes[char];
        if (!code) {
            // skip unknown symbols
            continue;
        }

        // Visualize every morse symbol
        for (let j = 0; j < code.length; j++) {
            const symbol = code[j];

            if (symbol === '.') {
                // short flash time (1 unit)
                await device.turnOn();
                await sleep(flashTimeUnit);
                await device.turnOff();
            } else {
                // long flash time (3 units)
                await device.turnOn();
                await sleep(flashTimeUnit * 3);
                await device.turnOff();
            }
            // pause between symbols
            await sleep(flashTimeUnit);
        }

        // additional pause between letters (we did a pause of 1 unit above already)
        await sleep(flashTimeUnit * 2);
    }
}