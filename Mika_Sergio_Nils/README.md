# DHBW-Mannheim-WI2023SEB-Assignment

## Projektbeschreibung
Dieses Projekt implementiert eine Event-Driven-Architecture (EDA) zur Steuerung einer smarten Glühbirne. Die Anwendung ermöglicht es, die Glühbirne ein- und auszuschalten, die Helligkeit anzupassen, die Farbe zu ändern und Nachrichten als Morse-Code zu senden. RabbitMQ wird als Message Broker verwendet, um die Kommunikation zwischen Producer und Consumer zu ermöglichen.

---

## Voraussetzungen
1.
   - Node.js (Version 16 oder höher)
   - RabbitMQ (lokal installiert und gestartet)
   - tplink-bulbs kompatible Glühbirne (https://www.npmjs.com/package/tplink-bulbs?activeTab=readme)

2.
   - `.env`-Datei mit den folgenden Variablen:
     ```
     EMAIL=<TP-Link-Konto-E-Mail>
     PASSWORD=<TP-Link-Konto-Passwort>
     DEVICE_ID=<ID der Glühbirne>
     ```

---

## Installation
1. **Repository klonen**:
   ```bash
   git clone https://github.com/DarkSerme/DHBW-Mannheim-WI2023SEB-Assignment
   cd DHBW-Mannheim-WI2023SEB-Assignment/Mika_Sergio_Nils
   ```

2. **Abhängigkeiten installieren**:
   ```bash
   npm install
   ```

3. **RabbitMQ starten**:
   - Stelle sicher, dass RabbitMQ lokal läuft. Standardmäßig wird `amqp://localhost` verwendet.

---

## Anwendung starten
1. **Producer API starten**:
   ```bash
   node producerApi.js
   ```
   Die Producer API läuft standardmäßig auf Port `3000`.

2. **Consumer starten**:
   ```bash
   node consumer.js
   ```

3. **Frontend öffnen**:
   - Öffne die Datei `index.html` in einem Browser.

---

## Nutzung der Anwendung
1. **Glühbirne ein-/ausschalten**:
   - Nutze den Schalter im Frontend, um die Glühbirne ein- oder auszuschalten.

2. **Helligkeit anpassen**:
   - Gib einen Wert zwischen `0` und `100` ein und klicke auf "Helligkeit anwenden".

3. **Farbe ändern**:
   - Wähle eine Farbe aus dem Farbwähler oder gib einen Hex-Code ein und klicke auf "Farbe anwenden".

4. **Morse-Code senden**:
   - Gib einen Text ein und klicke auf "Morse Code senden", um die Nachricht als Morse-Code zu übertragen.

---

## Fehlerbehebung
- **RabbitMQ läuft nicht**:
  - Stelle sicher, dass RabbitMQ installiert und gestartet ist.
- **Glühbirne wird nicht gefunden**:
  - Überprüfe die `DEVICE_ID` in der `.env`-Datei.
- **API-Fehler**:
  - Stelle sicher, dass die Producer API und der Consumer laufen.
