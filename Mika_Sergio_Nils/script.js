class LightbulbController {
    constructor() {
        this.isOn = false;
        this.brightness = 50;
        this.hexColor = "#ffcc00";
        this.morseInterval = null;
        this.apiBaseUrl = 'http://localhost:3000';
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeElements() {
        this.lightbulb = document.getElementById('lightbulb');
        this.powerToggle = document.getElementById('powerToggle');
        this.brightnessInput = document.getElementById('brightness');
        this.colorPicker = document.getElementById('colorPicker');
        this.hexColorInput = document.getElementById('hexColor');
        this.morseInput = document.getElementById('morseInput');
        this.sendMorseBtn = document.getElementById('sendMorse');
        this.morseOutput = document.getElementById('morseOutput');
        this.morseStatus = document.getElementById('morseStatus');
        
        this.brightnessValue = document.getElementById('brightnessValue');
    }

    bindEvents() {
        this.powerToggle.addEventListener('change', () => this.togglePower());
        this.brightnessInput.addEventListener('input', (e) => this.setBrightness(e.target.value));
        this.colorPicker.addEventListener('input', (e) => this.setColor(e.target.value));
        this.hexColorInput.addEventListener('input', (e) => this.setColorFromHex(e.target.value));
        this.sendMorseBtn.addEventListener('click', () => this.startMorseCode());
    }

    // Convert hex to RGB
    hexToRgb(hex) {
        // Remove the # if present
        hex = hex.replace(/^#/, '');
        
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16)
        };
    }

    setColor(hexColor) {
        // Update hex input to match color picker
        this.hexColorInput.value = hexColor;
        this.hexColor = hexColor;
        
        this.updateColor();
    }

    setColorFromHex(hexInput) {
        // Validate hex format
        if (/^#[0-9A-F]{6}$/i.test(hexInput)) {
            // Update color picker to match hex input
            this.colorPicker.value = hexInput;
            this.hexColor = hexInput;
            this.updateColor();
        }
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
                await this.apiCall('/on', { value: this.brightness });
                console.log('Glühbirne eingeschaltet (API)');
            } else {
                await this.apiCall('/off', { value: this.brightness });
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
        if (this.brightnessValue) {
            this.brightnessValue.textContent = `${this.brightness}%`;
        }
        
        try {
            await this.apiCall('/brightness', { value: this.brightness });
            console.log(`Helligkeit gesetzt auf: ${this.brightness}% (API)`);
        } catch (error) {
            console.error('Fehler beim Setzen der Helligkeit:', error);
        }
        
        this.updateDisplay();
    }

    async updateColor() {
        const { r, g, b } = this.hexToRgb(this.hexColor);
        
        const colorValue = {
            red: r,
            green: g,
            blue: b
        };
        
        try {
            await this.apiCall('/color', { value: this.hexColor });
            console.log(`Farbe gesetzt auf: RGB(${r}, ${g}, ${b}) / ${this.hexColor} (API)`);
        } catch (error) {
            console.error('Fehler beim Setzen der Farbe:', error);
        }
        
        this.updateDisplay();
    }

    updateDisplay() {
        if (this.isOn) {
            this.lightbulb.classList.add('on');
            
            const { r, g, b } = this.hexToRgb(this.hexColor);
            
            // Adjust brightness
            const brightnessMultiplier = this.brightness / 100;
            const adjustedR = Math.round(r * brightnessMultiplier);
            const adjustedG = Math.round(g * brightnessMultiplier);
            const adjustedB = Math.round(b * brightnessMultiplier);
            
            const color = `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;
            const glowColor = `rgba(${r}, ${g}, ${b}, 0.7)`;
            
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

    textToMorse(text) {
        const morseCodeMap = {  
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
            'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
            'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
            '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
            '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...',
            ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
            ' ': '/'
        };
        
        return text.toUpperCase().split('').map(char => 
            morseCodeMap[char] || ''
        ).join(' ');
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