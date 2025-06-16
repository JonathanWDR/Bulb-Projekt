const MORSE_MAP = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
  H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--",
  N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...",
  T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-",
  5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
  " ": " "
};

export function buildMorseSequence(text) {
  const DOT = 300;
  const DASH = DOT * 3;
  const BETWEEN_SYMBOL = DOT;
  const BETWEEN_LETTER = DOT * 3;
  const BETWEEN_WORD = DOT * 7;

  const seq = [];
  const upper = text.toUpperCase().trim();

  for (let i = 0; i < upper.length; i++) {
    const ch = upper[i];
    if (ch === " ") {
      seq.push({ signal: false, duration: BETWEEN_WORD });
      continue;
    }
    const code = MORSE_MAP[ch] || "";
    for (let j = 0; j < code.length; j++) {
      const sym = code[j];
      if (sym === ".") {
        seq.push({ signal: true, duration: DOT });
      } else if (sym === "-") {
        seq.push({ signal: true, duration: DASH });
      }
      if (j < code.length - 1) {
        seq.push({ signal: false, duration: BETWEEN_SYMBOL });
      }
    }
    if (i < upper.length - 1 && upper[i + 1] !== " ") {
      seq.push({ signal: false, duration: BETWEEN_LETTER });
    }
  }

  return seq;
}

export async function playMorse(device, text) {
  const sequence = buildMorseSequence(text);

  for (const item of sequence) {
    if (item.signal) {
      await device.turnOn();
    } else {
      await device.turnOff();
    }
    await new Promise((res) => setTimeout(res, item.duration));
  }
  await device.turnOff();
}
