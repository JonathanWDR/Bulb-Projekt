Ramona 5719044  
Jan 6558355
Jonathan 1267780

# 1. Architektur und ihre Begründung

Die Anwendung kombiniert eine Client-Server-Architektur mit einer Event-Driven Architecture. Die ereignisbasierte Kommunikation wird durch eine asynchrone Nachrichtenschicht (RabbitMQ) im Producer-Consumer-Modell realisiert:

- **Frontend**: Ein statisches Web-Interface (HTML/CSS/JS) zur Interaktion mit der Lampe (z. B. Ein-/Ausschalten, Farbauswahl).
- **Backend**: Node.js-Server mit REST-API, WebSocket-Server und einer AMQP-Produzenten-/Konsumenten-Logik zur Kommunikation mit der Smart-Bulb.
- **Message Queue (RabbitMQ)**: Vermittelt Steuerbefehle zwischen dem Webserver (Producer) und dem eigentlichen Lampensteuerungsmodul (Consumer).
- **IoT-Komponente**: Eine TP-Link Tapo Smart Bulb, die über die Bibliothek `tplink-bulbs` gesteuert wird.

Diese Architektur wurde gewählt, um:

- **Entkopplung** von Frontend-Logik und Gerätekommunikation zu erreichen.
- **Asynchrone Verarbeitung** (via Message Queue) zu ermöglichen.
- Die **Zustandsübertragung** an mehrere Clients in Echtzeit (WebSocket) umzusetzen.

---

# 2. Funktionsweise der Anwendung

## Frontend (im Browser)

- Der Benutzer steuert die Lampe über ein Interface (z. B. Farbauswahl mit dem `colorpicker.js`).
- Aktionen (z. B. Einschalten, Farbe ändern) werden per **HTTP-POST** an den Express-Server gesendet (`/led`).
- Zusätzlich empfängt das Frontend **Live-Updates** des Lampenzustands über einen **WebSocket** auf Port 8081.

---

# Backend-Komponenten

## server.js

- Startet Express und stellt zwei Routen bereit:
  - `/led`: Entgegennahme von Steuerbefehlen vom Frontend.
  - `/getState`: Optionaler Abruf des Lampenzustands.
- Diese Befehle werden an **RabbitMQ** weitergeleitet (via `producer.js`).

## producer.js

- Verbindet sich mit **RabbitMQ** und legt Nachrichten (z. B. „Farbe = rot“) in die Queue `led_control`.

## consumer.js

- Hört auf Nachrichten in der Queue.
- Führt entsprechend Steuerbefehle an die Smart-Bulb aus (z. B. `turnOn`, `setBrightness`).
- Nutzt die `tplink-bulbs`-API zur Kommunikation mit der Cloud der TP-Link Geräte.
- Aktualisiert lokal den Zustand der Lampe und sendet diesen via **WebSocket** an alle verbundenen Clients.

## websocket.js

- Öffnet einen **WebSocket**-Server (Port 8081) zur bidirektionalen Kommunikation mit Frontends.
- Ermöglicht, dass alle verbundenen Clients synchron den aktuellen Lampenzustand sehen.
