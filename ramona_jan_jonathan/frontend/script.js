
const img = document.getElementById("bulb-img");
const colorCircles = document.querySelectorAll('.color-circle');
const brightnessSlider = document.getElementById("brightness");

let isLampOn = true; // global lamp state
let brightness = brightnessSlider.value; // default from slider
let colorHex = "#aaffff"; // default color


function toggleLampState(on) {
    if (on === undefined) {
        isLampOn = !isLampOn;
    } else if (on !== isLampOn) {
        isLampOn = on;
    } else {
        return; // no change
    }

    updateUI();
    sendState(isLampOn, brightness, colorHex);
}

img.addEventListener("click", () => {

    toggleLampState(!isLampOn);
    console.log("Lamp state toggled:", isLampOn ? "ON" : "OFF");
    
});

/*Farbregler*/

function rgbToHex(rgb) {
    const [r, g, b] = rgb.split(',').map(n => parseInt(n.trim()));
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

colorCircles.forEach(circle => {
    circle.addEventListener('click', () => {
        const style = window.getComputedStyle(circle);
        const color = style.backgroundColor;
        const rgbMatch = color.match(/\d+/g);
        if (rgbMatch) {
            const rgb = rgbMatch.slice(0, 3).join(', ');
            img.style.setProperty('--glow-rgb', rgb);
            colorHex = rgbToHex(rgb);

            if (isLampOn) {
                sendState(isLampOn, brightness, colorHex);
            }
        }
    });
});


/*Helligkeit*/
brightnessSlider.addEventListener('input', () => {
    brightness = brightnessSlider.value;
    const alpha = (brightness / 100).toFixed(2);
    img.style.setProperty('--glow-alpha', alpha);

    // Only send state if lamp is on

    sendState(isLampOn, brightness, colorHex);
    updateUI();
});



/*Morsecode*/
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
        .split('')
        .filter(char => morseCodeMap[char])
        .map(char => morseCodeMap[char])
        .join(' ');
}

async function blinkMorse(morseString) {
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    for (const symbol of morseString) {
        if (symbol === '.') {
            toggleLampState(true);
            await delay(200);
            toggleLampState(false);
            await delay(200);
        } else if (symbol === '-') {
            toggleLampState(true);
            await delay(600);
            toggleLampState(false);
            await delay(200);
        } else if (symbol === ' ') {
            await delay(400); // Abstand zwischen Buchstaben
        }
    }

    // Nach Ende: Lampe wieder anschalten
    toggleGlow(true);
}

function sendState(poweredOn, brightness, color) {
    const state = {
        poweredOn,
        brightness: parseInt(brightness),
        color
    };

    fetch('/led', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
    })
    .then(res => res.json())
    .then(data => console.log("State sent:", data))
    .catch(err => console.error("Error sending state:", err));
}


const inputField = document.querySelector(".color-text-input");

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
