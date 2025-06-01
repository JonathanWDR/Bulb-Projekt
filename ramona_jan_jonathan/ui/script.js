const img = document.getElementById("bulb-img");

img.addEventListener("click", () => {
    img.classList.toggle("glow-on");
});

const colorCircles = document.querySelectorAll('.color-circle');
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

const brightnessSlider = document.getElementById("brightness");

brightnessSlider.addEventListener('input', () => {
    const value = brightnessSlider.value; // 1–100
    const alpha = (value / 100).toFixed(2); // z.B. 0.75
    img.style.setProperty('--glow-alpha', alpha);
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