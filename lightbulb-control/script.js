class LightbulbController {
    constructor() {
        this.isOn = false;
        this.brightness = 50;
        this.hue = 60;
        this.saturation = 100;
        this.lightness = 50;
        this.morseInterval = null;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeElements() {
        this.lightbulb = document.getElementById('lightbulb');
        this.powerToggle = document.getElementById('powerToggle');
        this.brightnessSlider = document.getElementById('brightness');
        this.hueSlider = document.getElementById('hue');
        this.saturationSlider = document.getElementById('saturation');
        this.lightnessSlider = document.getElementById('lightness');
        this.morseInput = document.getElementById('morseInput');
        this.sendMorseBtn = document.getElementById('sendMorse');
        this.stopMorseBtn = document.getElementById('stopMorse');
        this.morseOutput = document.getElementById('morseOutput');
        this.morseStatus = document.getElementById('morseStatus');
        
        // Value display elements
        this.brightnessValue = document.getElementById('brightnessValue');
        this.hueValue = document.getElementById('hueValue');
        this.saturationValue = document.getElementById('saturationValue');
        this.lightnessValue = document.getElementById('lightnessValue');
    }

    bindEvents() {
        this.powerToggle.addEventListener('change', () => this.togglePower());
        this.brightnessSlider.addEventListener('input', (e) => this.setBrightness(e.target.value));
        this.hueSlider.addEventListener('input', (e) => this.setHue(e.target.value));
        this.saturationSlider.addEventListener('input', (e) => this.setSaturation(e.target.value));
        this.lightnessSlider.addEventListener('input', (e) => this.setLightness(e.target.value));
        this.sendMorseBtn.addEventListener('click', () => this.startMorseCode());
        this.stopMorseBtn.addEventListener('click', () => this.stopMorseCode());
    }

    togglePower() {
        this.isOn = this.powerToggle.checked;
        this.updateDisplay();
        console.log(`Glühbirne ${this.isOn ? 'eingeschaltet' : 'ausgeschaltet'}`);
    }

    setBrightness(value) {
        this.brightness = parseInt(value);
        this.brightnessValue.textContent = `${this.brightness}%`;
        this.updateDisplay();
        console.log(`Helligkeit gesetzt auf: ${this.brightness}%`);
    }

    setHue(value) {
        this.hue = parseInt(value);
        this.hueValue.textContent = `${this.hue}°`;
        this.updateDisplay();
        console.log(`Farbton gesetzt auf: ${this.hue}°`);
    }

    setSaturation(value) {
        this.saturation = parseInt(value);
        this.saturationValue.textContent = `${this.saturation}%`;
        this.updateDisplay();
        console.log(`Sättigung gesetzt auf: ${this.saturation}%`);
    }

    setLightness(value) {
        this.lightness = parseInt(value);
        this.lightnessValue.textContent = `${this.lightness}%`;
        this.updateDisplay();
        console.log(`Farb-Helligkeit gesetzt auf: ${this.lightness}%`);
    }

    updateDisplay() {
        if (this.isOn) {
            this.lightbulb.classList.add('on');
            
            // Berechne die tatsächliche Helligkeit basierend auf dem Brightness-Slider
            const actualLightness = (this.lightness * this.brightness) / 100;
            
            // Setze die Farbe der Glühbirne
            const color = `hsl(${this.hue}, ${this.saturation}%, ${actualLightness}%)`;
            const glowColor = `hsl(${this.hue}, ${this.saturation}%, ${Math.min(actualLightness + 20, 90)}%)`;
            
            const bulb = this.lightbulb.querySelector('.bulb');
            bulb.style.background = color;
            bulb.style.boxShadow = `0 0 ${this.brightness/2}px ${glowColor}`;
        } else {
            this.lightbulb.classList.remove('on');
            const bulb = this.lightbulb.querySelector('.bulb');
            bulb.style.background = '#f0f0f0';
            bulb.style.boxShadow = 'none';
        }
    }

    // Morse Code Dictionary
    getMorseCode() {
        return {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
            '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
            '9': '----.', '0': '-----', ' ': '/'
        };
    }

    textToMorse(text) {
        const morseDict = this.getMorseCode();
        return text.toUpperCase()
                  .split('')
                  .map(char => morseDict[char] || '')
                  .filter(morse => morse !== '')
                  .join(' ');
    }

    async startMorseCode() {
        const text = this.morseInput.value.trim();
        if (!text) return;

        const morseCode = this.textToMorse(text);
        this.morseOutput.textContent = morseCode;
        this.morseStatus.textContent = 'Sende Morse Code...';
        
        console.log(`Starte Morse Code für: "${text}"`);
        console.log(`Morse Code: ${morseCode}`);

        await this.transmitMorseCode(morseCode);
    }

    async transmitMorseCode(morseCode) {
        const dotDuration = 200; // ms
        const dashDuration = 600; // ms
        const pauseDuration = 200; // ms
        const letterPauseDuration = 600; // ms
        const wordPauseDuration = 1400; // ms

        for (let i = 0; i < morseCode.length; i++) {
            if (this.morseInterval === null) break; // Gestoppt

            const symbol = morseCode[i];
            
            if (symbol === '.') {
                await this.flashLight(dotDuration);
                console.log('Punkt gesendet');
            } else if (symbol === '-') {
                await this.flashLight(dashDuration);
                console.log('Strich gesendet');
            } else if (symbol === ' ') {
                await this.wait(letterPauseDuration);
                console.log('Buchstaben-Pause');
            } else if (symbol === '/') {
                await this.wait(wordPauseDuration);
                console.log('Wort-Pause');
            }
            
            if (i < morseCode.length - 1 && morseCode[i + 1] !== ' ' && morseCode[i + 1] !== '/') {
                await this.wait(pauseDuration);
            }
        }

        this.morseStatus.textContent = 'Morse Code abgeschlossen';
        this.morseInterval = null;
        console.log('Morse Code übertragung abgeschlossen');
    }

    async flashLight(duration) {
        // Temporär einschalten
        const wasOn = this.isOn;
        this.powerToggle.checked = true;
        this.isOn = true;
        this.updateDisplay();
        
        await this.wait(duration);
        
        // Zurück zum ursprünglichen Zustand
        this.powerToggle.checked = wasOn;
        this.isOn = wasOn;
        this.updateDisplay();
    }

    wait(ms) {
        return new Promise(resolve => {
            this.morseInterval = setTimeout(resolve, ms);
        });
    }

    stopMorseCode() {
        if (this.morseInterval) {
            clearTimeout(this.morseInterval);
            this.morseInterval = null;
            this.morseStatus.textContent = 'Morse Code gestoppt';
            console.log('Morse Code übertragung gestoppt');
        }
    }
}

// Initialisiere den Controller wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', () => {
    new LightbulbController();
});
