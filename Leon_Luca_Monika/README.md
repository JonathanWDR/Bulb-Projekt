# Lampensteuerung – README

## Projektüberblick: LLM-Light-Control

Dieses Projekt ermöglicht die Steuerung einer smarten Lampe (TP-Link Tapo Bulb) über eine Web-Oberfläche. Die Kommunikation erfolgt asynchron über RabbitMQ. Es gibt einen Producer (Frontend + Backend) und einen Consumer (Anbindung an die Lampe).

---

## Setup-Anleitung

### Voraussetzungen

- **Node.js** 
- **npm**
- **RabbitMQ** (lokal installiert und gestartet)
- **TP-Link Tapo Bulb** (optional, für echten Lampenbetrieb)

### 1. RabbitMQ installieren und starten

Auf macOS mit Homebrew:
```sh
brew install rabbitmq
brew services start rabbitmq
```
RabbitMQ läuft dann standardmäßig auf amqp://localhost.

#### RabbitMQ Web-UI

RabbitMQ läuft standardmäßig unter:

**AMQP-URL:** `amqp://localhost`

Du kannst die Queues und Nachrichten im Browser unter folgendem Link einsehen:  
[http://localhost:15672](http://localhost:15672)

**Login:**

- **Benutzername:** `guest`  
- **Passwort:** `guest`

> ⚠️ **Hinweis:** Die Verwendung von Standard-Zugangsdaten (`guest`/`guest`) sollte nur in lokalen oder sicheren Testumgebungen erfolgen. In produktiven Umgebungen sollten Benutzerkonten mit sicheren Passwörtern eingerichtet werden.


### 2. Repositories & Abhängigkeiten installieren
```sh
cd producer
npm install

cd consumer
npm install
```

### 3. Umgebungsvariablen für die Lampe setzen
Lege in `consumer/` eine `.env`-Datei an mit folgendem Inhalt:
```env
TP_EMAIL=deine-tplink-email@example.com
TP_PASSWORD=dein-tplink-passwort
TP_DEVICE_ID=deine_geraete_id
```
> ⚠️ **Hinweis:** Die TP_DEVICE_ID findest du z.B. über die Tapo-App oder das Skript-Log.


### 4. Dienste starten
Producer:
```sh
cd producer
node server.js
```
Consumer (Lampe):
```sh
cd consumer
node consumer.js
```


### 5. Web-UIs öffnen

- **Steuerung:**  
  Öffne **`producer/index.html`** im Browser.

- **Statusanzeige:**  
  Öffne **`consumer/status.html`** im Browser.


## Funktionen

- Lampe an/aus schalten
- Helligkeit (0–100) einstellen
- Farbe setzen (Hex oder Name)
- Text als Morsecode blinken lassen
- Live-Statusanzeige der Lampe

## Hinweise
- Ohne echte Lampe wird ein Demo-Modus verwendet (nur Konsolen-Logs, Statusanzeige funktioniert trotzdem).
- Bei Problemen mit RabbitMQ: Web-UI unter http://localhost:15672 (Login: guest/guest)


## Autoren 
Leon, Luca, Monika