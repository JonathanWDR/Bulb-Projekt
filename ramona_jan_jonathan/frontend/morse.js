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

    
    toggleLampState(true);
    await delay(5*ditDuration); // wait before starting to blink

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

    // Turn lamp back on at the end
    await delay(5*ditDuration); // wait before turning on
    toggleLampState(true);
}



const inputField = document.querySelector(".morse-input");

inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const text = inputField.value.trim();
        if (!text) return;

        if (!img.classList.contains("glow-on")) {
            alert("Lampe ist aus – bitte zuerst einschalten.");
            return;
        }

        const morse = textToMorse(text);
        console.log("Morse:", morse);
        blinkMorse(morse);

        inputField.value = ""; // nach Senden leeren
    }
});