# DHBW-Mannheim-WI2023SEB-Assignment - Mika, Sergio, Nils

## Projektbeschreibung
Dieses Projekt implementiert eine Event-Driven-Architecture (EDA) zur Steuerung smarter TP-Link-Glühbirnen. Die Anwendung ermöglicht es, die Glühbirne ein- und auszuschalten, die Helligkeit anzupassen, die Farbe zu ändern und Nachrichten als Morse-Code zu senden.

---

## Grundvoraussetzungen

Damit die Anwendung korrekt funktioniert, müssen folgende Voraussetzungen erfüllt sein:

1. **Node.js**  
   - Stelle sicher, dass Node.js installiert ist.
     [Node.js herunterladen](https://nodejs.org/)

2. **RabbitMQ**  
   - RabbitMQ muss lokal installiert und gestartet sein.
     [RabbitMQ herunterladen](https://www.rabbitmq.com/)  
   - Falls erforderlich, installiere auch Erlang 
     [Erlang herunterladen](https://www.erlang.org/)

3. **TP-Link-kompatible Glühbirne**  
   - Die Glühbirne muss mit der `tplink-bulbs`-Bibliothek kompatibel sein.
     [Weitere Informationen zur Bibliothek](https://www.npmjs.com/package/tplink-bulbs?activeTab=readme)

4. **`.env`-Datei**  
   - Erstelle eine `.env`-Datei im Projektverzeichnis mit den folgenden Variablen:  
     ```env
     EMAIL=<TP-Link-Konto-E-Mail>
     PASSWORD=<TP-Link-Konto-Passwort>
     DEVICE_ID=<ID der Glühbirne>
     ```
   - Diese Daten sind notwendig, um die Glühbirne zu steuern.

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
   - Sicherstellen dass RabbitMQ lokal läuft!

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
  - Stelle sicher, dass RabbitMQ installiert und gestartet ist!
- **Glühbirne wird nicht gefunden**:
  - Überprüfe die Angaben in der `.env`-Datei!
- **API-Fehler**:
  - Stelle sicher, dass die Producer API und der Consumer laufen!

## Ansonsten viel Spaß damit und bei Fragen einfach an Mika, Sergio und Nils wenden!