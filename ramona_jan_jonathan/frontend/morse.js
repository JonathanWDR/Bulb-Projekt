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
    const ditDuration = 150;

    previousLampState = isLampOn; // Save current state
    toggleLampState(false);
    await delay(7*ditDuration); // wait before starting to blink

    for (let i = 0; i < morseString.length; i++) {
        const symbol = morseString[i];

        if (symbol === '.') {
            toggleLampState(true);
            await delay(ditDuration); // 1 unit on
            toggleLampState(false);
            await delay(ditDuration); // 1 unit gap
        } else if (symbol === '-') {
            toggleLampState(true);
            await delay(ditDuration * 3); // 3 units on
            toggleLampState(false);
            await delay(ditDuration); // 1 unit gap
        } else if (symbol === ' ') {
            // Check if it's a word gap (multiple spaces)
            const isWordGap = morseString[i + 1] === ' ';
            await delay(ditDuration * (isWordGap ? 7 : 3)); // 7 units for word, 3 for letter
            if (isWordGap) i++; // Skip next space if already handled
        }
    }


    await delay(7*ditDuration); // wait before turning on
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

        inputField.value = ""; // nach Senden leeren
    }
});//- . ... -