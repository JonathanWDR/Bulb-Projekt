import React, { useState, useEffect, useRef } from "react";
import "./LampControl.css";
import { sendLampCommand } from "./api";

const MORSE_MAP = {
  A: ".-",    B: "-...",  C: "-.-.",  D: "-..",   E: ".",
  F: "..-.",  G: "--.",   H: "....",  I: "..",    J: ".---",
  K: "-.-",   L: ".-..",  M: "--",    N: "-.",    O: "---",
  P: ".--.",  Q: "--.-",  R: ".-.",   S: "...",   T: "-",
  U: "..-",   V: "...-",  W: ".--",   X: "-..-",  Y: "-.--",
  Z: "--..",
  0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-",
  5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
  " ": " "
};

export default function LampControl() {
  // ─── Zustände für die Lampe ───
  const [isOn, setIsOn] = useState(false);
  const [color, setColor] = useState("#80c080");
  const [brightness, setBrightness] = useState(100);

  // ─── Zustände für den Morsecode-Teil ───
  const [morseText, setMorseText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [morseOn, setMorseOn] = useState(false);
  const timeoutRefs = useRef([]);

  useEffect(() => {
    // Cleanup beim Unmount: alle Timeouts zurücksetzen
    return () => {
      timeoutRefs.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const toggleLamp = async (neuerStatus) => {
  if (isPlaying) {
    timeoutRefs.current.forEach((t) => clearTimeout(t));
    timeoutRefs.current = [];
    setIsPlaying(false);
    setMorseOn(false);
  }

  try {
    await sendLampCommand(neuerStatus ? "on" : "off");
    setIsOn(neuerStatus);
  } catch (err) {
    console.error("API Fehler:", err);
    alert("Fehler beim Senden des Lampenbefehls!");
  }
};


  const updateColor = async (e) => {
  const newColor = e.target.value;
  setColor(newColor);
  if (isOn && !isPlaying) {
    try {
      await sendLampCommand("color", newColor);
    } catch (err) {
      console.error("API Fehler:", err);
      alert("Fehler beim Ändern der Farbe!");
    }
  }
};

const updateBrightness = async (e) => {
  const newBrightness = parseInt(e.target.value, 10);
  setBrightness(newBrightness);
  if (isOn && !isPlaying) {
    try {
      await sendLampCommand("brightness", newBrightness);
    } catch (err) {
      console.error("API Fehler:", err);
      alert("Fehler beim Ändern der Helligkeit!");
    }
  }
};


  // ─── Morsecode-Sequenz erzeugen ───
  function buildMorseSequence(text) {
    const DOT = 300;
    const DASH = DOT * 3;
    const BETWEEN_SYMBOL = DOT;
    const BETWEEN_LETTER = DOT * 3;
    const BETWEEN_WORD = DOT * 7;

    const seq = [];
    const upper = text.toUpperCase().trim();

    for (let i = 0; i < upper.length; i++) {
      const ch = upper[i];
      // Leerzeichen → Wort-Pause
      if (ch === " ") {
        seq.push({ signal: false, duration: BETWEEN_WORD });
        continue;
      }
      const code = MORSE_MAP[ch] || "";
      // Jedes Zeichen von „.“ und „-“ in .-Code umwandeln
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
      // Pause nach Buchstabe (außer vor Leerzeichen oder am Ende)
      if (i < upper.length - 1 && upper[i + 1] !== " ") {
        seq.push({ signal: false, duration: BETWEEN_LETTER });
      }
    }

    return seq;
  }

  // ─── Abspielen des Morse-Codes ───
  const playMorse = () => {
    if (!isOn || isPlaying) return;
    const text = morseText.trim();
    if (!text) return;

    const sequence = buildMorseSequence(text);
    setIsPlaying(true);
    setMorseOn(false);
    timeoutRefs.current = [];

    let timeAccum = 0;
    sequence.forEach((item) => {
      const to = setTimeout(() => {
        setMorseOn(item.signal);
      }, timeAccum);
      timeoutRefs.current.push(to);
      timeAccum += item.duration;
    });

    const endTimeout = setTimeout(() => {
      setMorseOn(false);
      setIsPlaying(false);
      timeoutRefs.current = [];
    }, timeAccum + 50);
    timeoutRefs.current.push(endTimeout);
  };

  // ─── Füll-Opa­zität: entweder normal an/aus oder Morseblink-Logik ───
  const actualFillOpacity = () => {
    if (isPlaying) {
      return morseOn ? brightness / 100 : 0;
    }
    return isOn ? brightness / 100 : 0;
  };

  return (
    <div className="container">
      {/** ─── Box 1: Lampe steuern ─── **/}
      <div className="lamp-card lamp-card--small">
        <h1 className="lamp-title">Lampe steuern</h1>

        <div
          className="lamp-icon"
          style={{ color: isOn || isPlaying ? color : "#e0e0e0" }}
        >
          <svg
            viewBox="0 0 64 100"
            xmlns="http://www.w3.org/2000/svg"
            className="bulb-svg"
          >
            {/** ─── Birnen-Form ─── **/}
            <path
              d="
                M32 2
                C18 2, 6 14, 6 28
                C6 40, 14 49, 16 62
                C17 69, 20 75, 24 80
                C28 86, 36 86, 40 80
                C44 75, 47 69, 48 62
                C50 49, 58 40, 58 28
                C58 14, 46 2, 32 2
                Z
              "
              fill="currentColor"
              fillOpacity={actualFillOpacity()}
              stroke="#333"
              strokeWidth="2"
              strokeOpacity={1}
            />

            {/** ─── Metall-Sockel ─── **/}
            <rect
              x="20"
              y="80"
              width="24"
              height="12"
              rx="3"
              ry="3"
              fill="#333"
            />
            <rect
              x="24"
              y="92"
              width="16"
              height="6"
              rx="2"
              ry="2"
              fill="#333"
            />
          </svg>
        </div>

        <div className="lamp-section">
          <label htmlFor="colorPicker" className="section-label">
            Farbe wählen:
          </label>
          <input
            type="color"
            id="colorPicker"
            className="color-picker"
            value={color}
            onChange={updateColor}
            disabled={!isOn || isPlaying}
          />
        </div>

        <div className="lamp-section controls">
          <button
            className="btn btn-on"
            onClick={() => toggleLamp(true)}
            disabled={isOn || isPlaying}
            title={
              isPlaying
                ? "Während Morsecode-Wiedergabe deaktiviert"
                : isOn
                ? "Lampe ist bereits an"
                : ""
            }
          >
            Einschalten
          </button>
          <button
            className="btn btn-off"
            onClick={() => toggleLamp(false)}
            disabled={!isOn || isPlaying}
            title={
              isPlaying
                ? "Während Morsecode-Wiedergabe deaktiviert"
                : !isOn
                ? "Lampe ist bereits aus"
                : ""
            }
          >
            Ausschalten
          </button>
        </div>

        <div className="lamp-section brightness">
          <label htmlFor="brightRange" className="section-label">
            Helligkeit:{" "}
            <span className="bright-value">{brightness}%</span>
          </label>
          <input
            type="range"
            id="brightRange"
            min="0"
            max="100"
            step="1"
            value={brightness}
            onChange={updateBrightness}
            disabled={!isOn || isPlaying}
            className="brightness-slider"
          />
        </div>
      </div>

      {/** ─── Box 2: Morsecode übersetzen ─── **/}
      <div className="lamp-card lamp-card--large">
        <h1 className="lamp-title">Morsecode übersetzen</h1>

        <div className="lamp-section morse-section">
          <label htmlFor="morseInput" className="section-label">
            Text eingeben:
          </label>
          <input
            type="text"
            id="morseInput"
            className="morse-input"
            placeholder={isOn ? "z. B. HELLO" : "Lampe bitte einschalten"}
            value={morseText}
            onChange={(e) => setMorseText(e.target.value)}
            disabled={!isOn || isPlaying}
          />
        </div>

        <div className="lamp-section controls morse-controls">
          <button
            className="btn btn-play"
            onClick={playMorse}
            disabled={!isOn || morseText.trim() === "" || isPlaying}
            title={
              !isOn
                ? "Lampe bitte einschalten"
                : isPlaying
                ? "Morsecode läuft bereits"
                : morseText.trim() === ""
                ? "Bitte Text eingeben"
                : ""
            }
          >
            Abspielen
          </button>
        </div>
      </div>
    </div>
  );
}
