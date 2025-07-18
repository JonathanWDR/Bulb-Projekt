# Tapo Lampen Steuerung

Ein System zur Fernsteuerung einer Tapo Smart-Lampe über RabbitMQ mit Webinterface und Live-Status.

## Installation

### 1. Repository klonen
```bash
git clone git@github.com:The-One-and-only-Captain/DHBW-Mannheim-WI2023SEB-Assignment.git

cd Jonas_Max_Tarnbir
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. RabbitMQ installieren
```bash
brew install rabbitmq
```

### 4. Umgebungsvariablen konfigurieren
Erstelle eine `.env` Datei:
```bash
TPLINK_USERNAME=tapo-email
TPLINK_PASSWORD=tapo-passwort
```

### 5. Tapo Lampe verbinden
Tapo Lampe ins gleiche Netzwerk bringen und IP-Adresse der Lampe in `consumer.js` eintragen:
```javascript
const deviceIP = '192.168.0.25';
```

## System starten

### 1. RabbitMQ starten
```bash
brew services start rabbitmq
```

### 2. Producer starten (Terminal 1)
```bash
node producer.js
```
Ausgabe sollte sein:

``Producer listening at http://localhost:3000``

### 3. Consumer starten (Terminal 2)
```bash
node consumer.js
```
Ausgabe sollte sein:

``Lamp ready``

``WebSocket ready on port 8080``


## Verwendung

### Control Interface
Öffne `index.html` im Browser

#### Funktionen:
- **An/Aus**: Lampe ein- und ausschalten
- **Farbe**: Beliebige Farbe setzen (z.B. "red", "blue", "green")
- **Helligkeit**: 0-100% einstellen
- **Morsecode**: Text als Lichtsignale senden

### Status Interface
Öffne `status.html` im Browser: 

#### Zeigt live an:
- Verbindungsstatus
- Power Status (An/Aus)
- Aktuelle Helligkeit
- Aktuelle Farbe
- Letzte Aktualisierung