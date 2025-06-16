import React, { useState } from "react";
import "./LampControl.css";
import { sendLampCommand } from "./api";

export default function LampControl() {
  // ─── Zustände für die Lampe ───
  const [isOn, setIsOn] = useState(false);
  const [color, setColor] = useState("#80c080");
  const [brightness, setBrightness] = useState(100);

  // ─── Morsecode-Zustände ───
  const [morseText, setMorseText] = useState("");

  // ─── Lampe AN/AUS ───
  const toggleLamp = async (neuerStatus) => {
    try {
      await sendLampCommand(neuerStatus ? "on" : "off");
      setIsOn(neuerStatus);
    } catch (err) {
      console.error("API Fehler:", err);
      alert("Fehler beim Senden des Lampenbefehls!");
    }
  };

  // ─── Farbe ───
  const updateColor = async (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    if (isOn) {
      try {
        await sendLampCommand("color", newColor);
      } catch (err) {
        console.error("API Fehler:", err);
        alert("Fehler beim Ändern der Farbe!");
      }
    }
  };

  // ─── Helligkeit ───
  const updateBrightness = async (e) => {
    const newBrightness = parseInt(e.target.value, 10);
    setBrightness(newBrightness);
    if (isOn) {
      try {
        await sendLampCommand("brightness", newBrightness);
      } catch (err) {
        console.error("API Fehler:", err);
        alert("Fehler beim Ändern der Helligkeit!");
      }
    }
  };

  // ─── Morsecode: an Backend senden ───
  const playMorse = async () => {
    const text = morseText.trim();
    if (!isOn || !text) return;

    try {
      await sendLampCommand("morse", text);
    } catch (err) {
      console.error("API Fehler:", err);
      alert("Fehler beim Senden des Morsecodes!");
    }
  };

  // ─── Sichtbarkeit der Lampe ───
  const actualFillOpacity = () => {
    return isOn ? brightness / 100 : 0;
  };

  return (
    <div className="container">
      {/* ─── Box 1: Lampe steuern ─── */}
      <div className="lamp-card lamp-card--small">
        <h1 className="lamp-title">Lampe steuern</h1>

        <div
          className="lamp-icon"
          style={{ color: isOn ? color : "#e0e0e0" }}
        >
          <svg
            viewBox="0 0 64 100"
            xmlns="http://www.w3.org/2000/svg"
            className="bulb-svg"
          >
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
            disabled={!isOn}
          />
        </div>

        <div className="lamp-section controls">
          <button
            className="btn btn-on"
            onClick={() => toggleLamp(true)}
            disabled={isOn}
          >
            Einschalten
          </button>
          <button
            className="btn btn-off"
            onClick={() => toggleLamp(false)}
            disabled={!isOn}
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
            disabled={!isOn}
            className="brightness-slider"
          />
        </div>
      </div>

      {/* ─── Box 2: Morsecode ─── */}
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
            disabled={!isOn}
          />
        </div>

        <div className="lamp-section controls morse-controls">
          <button
            className="btn btn-play"
            onClick={playMorse}
            disabled={!isOn || morseText.trim() === ""}
          >
            Abspielen
          </button>
        </div>
      </div>
    </div>
  );
}
