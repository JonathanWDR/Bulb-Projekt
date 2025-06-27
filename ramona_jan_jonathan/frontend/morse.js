const morseCodeMap = {
    a: '.-',    b: '-...',  c: '-.-.',  d: '-..',
    e: '.',     f: '..-.',  g: '--.',   h: '....',
    i: '..',    j: '.---',  k: '-.-',   l: '.-..',
    m: '--',    n: '-.',    o: '---',   p: '.--.',
    q: '--.-',  r: '.-.',   s: '...',   t: '-',
    u: '..-',   v: '...-',  w: '.--',   x: '-..-',
    y: '-.--',  z: '--..'
};

function textToMorse(text) {
    return text
        .toLowerCase()
        .split(' ')
        .map(word =>
            word
                .split('')
                .map(char => morseCodeMap[char])
                .filter(Boolean)
                .join(' ') // letter spacing = 1 space
        )
        .join('   '); // word spacing = 3 spaces
}


async function blinkMorse(morseString) {
    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    const ditDuration = 200;

    previousLampState = isLampOn;
    toggleLampState(true);
    brightness = 1;
    update();
    await delay(7*ditDuration);

    for (let i = 0; i < morseString.length; i++) {
        const symbol = morseString[i];

        if (symbol === '.') {
            brightness = 100;
            update();
            await delay(ditDuration);
            brightness = 1;
            update();
            await delay(ditDuration);
        } else if (symbol === '-') {
            brightness = 100;
            update();
            await delay(ditDuration * 3);
            brightness = 1;
            update();
            await delay(ditDuration);
        } else if (symbol === ' ') {
            const isWordGap = morseString[i + 1] === ' ';
            await delay(ditDuration * (isWordGap ? 7 : 3));
            if (isWordGap) i++;
        }
    }


    await delay(7*ditDuration);
    toggleLampState(previousLampState);
}

const inputField = document.querySelector(".morse-input");

inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const text = inputField.value.trim();
        if (!text) return;


        const morse = textToMorse(text);
        console.log("Morse:", morse);
        blinkMorse(morse);

        inputField.value = "";
    }
});