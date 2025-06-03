import React, { useState, useEffect } from "react";
import "./LampControl.css";

export default function LampControl() {
  const [isOn, setIsOn] = useState(false);
  const [color, setColor] = useState("#80c080");   // Beispiel: weiches Grün
  const [brightness, setBrightness] = useState(100);

  useEffect(() => {
    // Optional: Hier könnt ihr initialen Status vom Backend laden
    // fetch("/api/lamp/status")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setIsOn(data.isOn);
    //     setColor("#" + data.colorHex);
    //     setBrightness(data.brightness);
    //   });
  }, []);

  const toggleLamp = async (neuerStatus) => {
    setIsOn(neuerStatus);
    // TODO: An Backend senden
    // await fetch("/api/lamp/toggle", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ isOn: neuerStatus }),
    // });
  };

  const updateColor = async (e) => {
    const neueFarbe = e.target.value;
    setColor(neueFarbe);
    // TODO: An Backend senden
    // const hex = neueFarbe.replace("#", "");
    // await fetch("/api/lamp/color", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ colorHex: hex }),
    // });
  };

  const updateBrightness = async (e) => {
    const neueHelligkeit = parseInt(e.target.value, 10);
    setBrightness(neueHelligkeit);
    // TODO: An Backend senden
    // await fetch("/api/lamp/brightness", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ brightness: neueHelligkeit }),
    // });
  };

  // Berechne Opazität für Füllung (fillOpacity) und Filament (strokeOpacity)
  const fillOpacity = isOn ? brightness / 100 : 0;
  const filamentOpacity = isOn ? brightness / 100 : 0;

  return (
    <div className="lamp-card">
      <h1 className="lamp-title">Lampe steuern</h1>

      <div
        className="lamp-icon"
        style={{
          color: isOn ? color : "#e0e0e0", // „color“ steuert fill="currentColor"
        }}
      >
        <svg
          viewBox="0 0 64 100"
          xmlns="http://www.w3.org/2000/svg"
          className="bulb-svg"
        >
          {/* ─── Birnen‐Form ─── */}
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
            fillOpacity={fillOpacity}    /* Füllung wird mit Helligkeit ein/ausgeblendet */
            stroke="#333"
            strokeWidth="2"
            strokeOpacity={1}            /* Rand immer sichtbar */
          />

          {/* ─── Filament (Zacken) ─── */}
          <path
            d="
              M32 70   /* Startpunkt: Boden der inneren Birne */
              L32 55   /* gerade nach oben */
              L28 60   /* erste Zacke: schräg nach unten‐links */
              L36 65   /* zweite Zacke: schräg nach unten‐rechts */
              L30 45   /* dritte Zacke: schräg nach oben‐links */
              L34 35   /* Spitze: schräg nach oben‐rechts */
            "
            fill="none"
            stroke="#333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity={filamentOpacity} /* Filament wird mit Helligkeit ein/ausgeblendet */
          />

          {/* ─── Metall‐Sockel (dicker Balken) ─── */}
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
          Helligkeit: <span className="bright-value">{brightness}%</span>
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
  );
}
