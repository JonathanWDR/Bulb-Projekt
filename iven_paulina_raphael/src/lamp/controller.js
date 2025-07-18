import * as TPLink from "tplink-bulbs";

const morseTable = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  " ": "/",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
};

function textToMorse(text) {
  return text
    .toUpperCase()
    .split("")
    .map((c) => morseTable[c] || "")
    .join(" ");
}

export async function blinkMorse(device, message) {
  const morse = textToMorse(message);
  console.log("Morse-Code für '" + message + "':", morse);
  
  for (let symbol of morse) {
    if (symbol === ".") {
      console.log("Kurzer Blitz (.)");
      await device.turnOn();
      await TPLink.API.delay(300);
    } else if (symbol === "-") {
      console.log("Langer Blitz (-)");
      await device.turnOn();
      await TPLink.API.delay(700);
    } else {
      console.log("Pause zwischen Zeichen");
      await TPLink.API.delay(500);
    }
    await device.turnOff();
    await TPLink.API.delay(300);
  }
  console.log("Morse-Nachricht beendet");
}