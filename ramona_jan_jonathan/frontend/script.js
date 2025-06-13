
const img = document.getElementById("bulb-img");
const colorCircles = document.querySelectorAll('.color-circle');
const brightnessSlider = document.getElementById("brightness");

let isLampOn = true; // global lamp state

function toggleLampState(on) {
    console.log(on);
    if (on === undefined) {

        if (isLampOn) {
            isLampOn = false;
            img.classList.remove("glow-on");
            sendCommand("off");
        } else {
            isLampOn = true;
            img.classList.add("glow-on");
            sendCommand("on");
        }
    } else {
        if(on != isLampOn)
            toggleLampState();
    }

}


////////////////////// CURRENTLY JUST ON/OFF IS SENT TO BACKEND //////////////////////

/* an / aus Regler*/
img.addEventListener("click", () => {

    toggleLampState(!isLampOn);
    console.log("Lamp state toggled:", isLampOn ? "ON" : "OFF");
    
});

/*Farbregler*/

colorCircles.forEach(circle => {
    circle.addEventListener('click', () => {
        const style = window.getComputedStyle(circle);
        const color = style.backgroundColor; // z.B. "rgb(255, 0, 0)"
        const rgbMatch = color.match(/\d+/g); // [255, 0, 0]
        if (rgbMatch) {
            const rgb = rgbMatch.slice(0, 3).join(', ');
            img.style.setProperty('--glow-rgb', rgb);
        }
    });
});

/*Helligkeit*/
brightnessSlider.addEventListener('input', () => {
    const value = brightnessSlider.value; // 1–100
    const alpha = (value / 100).toFixed(2); // z.B. 0.75
    img.style.setProperty('--glow-alpha', alpha);
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
function sendCommand(state) {
  fetch('/led', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state })
  }).then(res => res.json()).then(data => console.log(data));
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



/*
const colorCircles = document.querySelectorAll('.color-circle');

colorCircles.forEach(circle => {
    circle.addEventListener('click', () => {
        const style = window.getComputedStyle(circle);
        const color = style.backgroundColor;
        img.style.setProperty('--glow-color', color);
    });
});*/




/*import * as TPLink from 'tplink-bulbs';
import { presetColors, getColour } from './colors.js'; // deine bestehende Datei

const email = 'DEINE_EMAIL';
const password = 'DEIN_PASSWORT';
const deviceId = 'DEINE_DEVICE_ID';

let device = null;
const virtualBulb = document.querySelector('.glow-img');
const picker = document.querySelector('.color-picker');

// 🔁 HTML-Kreise aus presetColors erzeugen
Object.keys(presetColors).forEach(colorName => {
    const circle = document.createElement('div');
    circle.classList.add('color-circle');
    circle.style.backgroundColor = colorName;

    circle.addEventListener('click', async () => {
        const colorSetting = getColour(colorName);
        console.log(`Farbe gewählt: ${colorName}`, colorSetting);

        // 🟡 Glühbirne ansprechen
        if (device) {
            try {
                await device.turnOn();
                if ('hue' in colorSetting) {
                    await device.setColourWithOptions(colorSetting);
                } else if ('color_temp' in colorSetting) {
                    await device.setColorTemperature(colorSetting.color_temp);
                }
            } catch (err) {
                console.error('Fehler beim Steuern der Lampe:', err);
            }
        }

        // 💡 Visueller Glow
        virtualBulb.style.filter = `drop-shadow(0 0 25px ${colorName})`;
    });

    picker.appendChild(circle);
});

// 🔌 Bei Start: TP-Link verbinden
(async function init() {
    try {
        const cloudApi = await TPLink.API.cloudLogin(email, password);
        const devices = await cloudApi.listDevicesByType('SMART.TAPOBULB');
        const target = devices.find(d => d.deviceId === deviceId);
        if (!target) {
            console.error('Gerät nicht gefunden!');
            return;
        }
        device = await TPLink.API.loginDevice(email, password, target);
    } catch (err) {
        console.error('Login oder Geräteverbindung fehlgeschlagen:', err);
    }
})();

*/