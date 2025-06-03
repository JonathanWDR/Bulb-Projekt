class LightbulbController {
    constructor() {
        this.isOn = false;
        this.brightness = 50;
        this.hue = 60;
        this.saturation = 100;
        this.lightness = 50;
        this.morseInterval = null;
        this.apiBaseUrl = 'http://localhost:3000';
        
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
        this.morseOutput = document.getElementById('morseOutput');
        this.morseStatus = document.getElementById('morseStatus');
        
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
    }

    morseCodeMap = {  
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
        'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
        'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
        '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
        '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...',
        ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
        ' ': '/'
    };

    textToMorse(text) {
        return text.toUpperCase().split('').map(char => 
            this.morseCodeMap[char] || ''
        ).join(' ');
    }

    async apiCall(endpoint, data = null) {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            if (data) {
                options.body = JSON.stringify(data);
            }
            
            const response = await fetch(`${this.apiBaseUrl}${endpoint}`, options);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error(`API Call ${endpoint} failed:`, error);
            throw error;
        }
    }

    async togglePower() {
        this.isOn = this.powerToggle.checked;
        
        try {
            if (this.isOn) {
                await this.apiCall('/on', { value: 50} );
                console.log('Glühbirne eingeschaltet (API)');
            } else {
                await this.apiCall('/off', { value: 50} );
                console.log('Glühbirne ausgeschaltet (API)');
            }
        } catch (error) {
            console.error('Fehler beim Umschalten der Glühbirne:', error);

            this.powerToggle.checked = !this.isOn;
            this.isOn = !this.isOn;
        }
        
        this.updateDisplay();
    }

    async setBrightness(value) {
        this.brightness = parseInt(value);
        this.brightnessValue.textContent = `${this.brightness}%`;
        
        try {
            await this.apiCall('/brightness', { value: this.brightness });
            console.log(`Helligkeit gesetzt auf: ${this.brightness}% (API)`);
        } catch (error) {
            console.error('Fehler beim Setzen der Helligkeit:', error);
        }
        
        this.updateDisplay();
    }

    async setHue(value) {
        this.hue = parseInt(value);
        this.hueValue.textContent = `${this.hue}°`;
        await this.updateColor();
        console.log(`Farbton gesetzt auf: ${this.hue}° (API)`);
    }

    async setSaturation(value) {
        this.saturation = parseInt(value);
        this.saturationValue.textContent = `${this.saturation}%`;
        await this.updateColor();
        console.log(`Sättigung gesetzt auf: ${this.saturation}% (API)`);
    }

    async setLightness(value) {
        this.lightness = parseInt(value);
        this.lightnessValue.textContent = `${this.lightness}%`;
        await this.updateColor();
        console.log(`Farb-Helligkeit gesetzt auf: ${this.lightness}% (API)`);
    }

    async updateColor() {
        const colorValue = {
            hue: this.hue,
            saturation: this.saturation,
            lightness: this.lightness
        };
        
        try {
            await this.apiCall('/color', { value: colorValue });
        } catch (error) {
            console.error('Fehler beim Setzen der Farbe:', error);
        }
        
        this.updateDisplay();
    }

    updateDisplay() {
        if (this.isOn) {
            this.lightbulb.classList.add('on');
            
            const actualLightness = (this.lightness * this.brightness) / 100;
            
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

    async startMorseCode() {
        const text = this.morseInput.value.trim();
        if (!text) return;

        const morseCode = this.textToMorse(text);
        this.morseOutput.textContent = morseCode;
        this.morseStatus.textContent = 'Sende Morse Code...';
        

        try {
            await this.apiCall('/morse', { value: text });
            this.morseStatus.textContent = 'Morse Code gesendet';
        } catch (error) {
            this.morseStatus.textContent = 'Fehler beim Senden des Morse Codes';
        }
    }
}

// Initialisiere den Controller wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', () => {
    new LightbulbController();
});