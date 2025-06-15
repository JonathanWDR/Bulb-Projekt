export const morseCodeMap = {  
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...',
    ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
    ' ': '/'
};

export const MORSE_TIMING = {
  DOT: 200,                     
  DASH: 600,                    
  PAUSE_BETWEEN_SIGNALS: 200,  
  PAUSE_BETWEEN_LETTERS: 600,  
  PAUSE_BETWEEN_WORDS: 1400
};

export function textToMorse(text) {
    return text.toUpperCase().split('').map(char => 
        morseCodeMap[char] || ''
    ).join(' ');
}

export async function transmitMorseCode(text, device, lampState) {
  const morseCode = textToMorse(text);
  console.log(`Text: ${text} => Morse: ${morseCode}`);
  
  const originalState = {
    poweredOn: lampState.poweredOn,
    brightness: lampState.brightness
  };
  
  try {
    for (let i = 0; i < morseCode.length; i++) {
      const symbol = morseCode[i];
      
      switch (symbol) {
        case '.': //
          await device.turnOn();
          await device.setBrightness(100);
          await new Promise(resolve => setTimeout(resolve, MORSE_TIMING.DOT));
          await device.turnOff();
          break;
          
        case '-': 
          await device.turnOn();
          await device.setBrightness(100);
          await new Promise(resolve => setTimeout(resolve, MORSE_TIMING.DASH));
          await device.turnOff();
          break;
          
        case ' ':
          await new Promise(resolve => setTimeout(resolve, MORSE_TIMING.PAUSE_BETWEEN_LETTERS));
          break;
          
        case '/':
          await new Promise(resolve => setTimeout(resolve, MORSE_TIMING.PAUSE_BETWEEN_WORDS));
          break;
      }
      
      if (i < morseCode.length - 1 && symbol !== ' ' && symbol !== '/') {
        await new Promise(resolve => setTimeout(resolve, MORSE_TIMING.PAUSE_BETWEEN_SIGNALS));
      }
    }
    
    if (originalState.poweredOn) {
      await device.turnOn();
      await device.setBrightness(originalState.brightness);
    } else {
      await device.turnOff();
    }
    
  } catch (error) {
    console.error(error);
    
    try {
      if (originalState.poweredOn) {
        await device.turnOn();
        await device.setBrightness(originalState.brightness);
      } else {
        await device.turnOff();
      }
    } catch (e) {
      console.error(e);
    }
  }
}