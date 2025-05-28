# Smart Glühbirnen Steuerung

Eine webbasierte Benutzeroberfläche zur Steuerung einer intelligenten Glühbirne mit Morse-Code-Funktionalität.

## Features

- **Ein/Aus-Schalter**: Glühbirne an- und ausschalten
- **Helligkeitsregelung**: Stufenlose Anpassung der Helligkeit (0-100%)
- **Farbsteuerung**: 
  - Farbton (Hue): 0-360°
  - Sättigung: 0-100%
  - Farb-Helligkeit: 0-100%
- **Morse-Code-Übertragung**: Text in Morse-Code umwandeln und über die Glühbirne ausgeben
- **Visuelle Glühbirne**: Realitätsnahe Darstellung mit Farbänderungen und Leuchteffekten

## Installation und Nutzung

### Voraussetzungen
- Moderner Webbrowser (Chrome, Firefox, Safari, Edge)
- Keine zusätzlichen Installationen erforderlich

### Projekt starten
1. Alle Dateien in einen Ordner herunterladen
2. `index.html` in einem Webbrowser öffnen
3. Das Interface ist sofort einsatzbereit

### Bedienung

#### Grundsteuerung
- **Ein/Aus**: Toggle-Schalter links verwenden
- **Helligkeit**: Slider bewegen (0-100%)

#### Farbeinstellungen
- **Farbton (Hue)**: Bestimmt die Grundfarbe (0° = Rot, 120° = Grün, 240° = Blau)
- **Sättigung**: Farbintensität (0% = Grau, 100% = volle Farbe)
- **Farb-Helligkeit**: Helligkeit der Farbe (0% = Schwarz, 100% = Weiß)

#### Morse-Code
1. Text in das Eingabefeld eingeben
2. "Morse Code senden" klicken
3. Die Glühbirne blinkt entsprechend dem Morse-Code:
   - **Punkt (.)**: Kurzes Aufblinken (200ms)
   - **Strich (-)**: Langes Aufblinken (600ms)
   - **Pause**: Verschiedene Pausenlängen zwischen Zeichen/Wörtern
4. Mit "Stop" kann die Übertragung abgebrochen werden

## Technische Details

### Dateien
- `index.html`: Hauptseite mit UI-Elementen
- `styles.css`: CSS-Styling für Layout und Glühbirnen-Animation
- `script.js`: JavaScript-Logik für Interaktionen und Morse-Code
- `README.md`: Diese Anleitung

### Browser-Konsole
Alle Aktionen werden in der Browser-Konsole geloggt:
- Ein/Aus-Zustand
- Helligkeits- und Farbänderungen
- Morse-Code-Übertragung (Punkte/Striche)

### Morse-Code-Unterstützung
- Alle Buchstaben A-Z
- Zahlen 0-9
- Leerzeichen werden als Wort-Trennungen interpretiert
- Automatische Umwandlung in Großbuchstaben

## Struktur

```
lightbulb-control/
├── index.html          # Hauptseite
├── styles.css          # Styling
├── script.js           # JavaScript-Logik
└── README.md          # Diese Anleitung
```

## Browser-Kompatibilität

- ✅ Chrome (empfohlen)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (nicht unterstützt)

## Hinweise

- Das UI funktioniert rein clientseitig ohne Server
- Keine Backend-Logik implementiert
- Alle Aktionen werden nur visuell dargestellt und in der Konsole geloggt
- Responsive Design für verschiedene Bildschirmgrößen
