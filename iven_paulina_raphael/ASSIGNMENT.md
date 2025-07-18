# Ausarbeitung - IoT-Projekt

SE II: Moderne Software Architekturen - IoT-Projekt  
Gruppe: Raphael Plett, Iven Stahl, Paulina Clauss  
Abgabe: 27.06.2025 20Uhr  
Dozent: Mathis Neunzig

## Aufgabenstellung und gewählte Architektur

Im Rahmen des Projekts bestand die Aufgabe darin, eine Anwendung zur Steuerung einer Smart Bulb zu entwickeln. Die folgenden Vorgaben waren dabei einzuhalten:

- Architektur: Es sollte eine Event-Driven-Architecture umgesetzt werden.

- Vorgegebene Bibliothek: Für die Steuerung der Lampe sollte die JavaScript/TypeScript-Bibliothek tplink-bulbs verwendet werden (für die Komponente, die die Events erzeugt).

### Funktionale Anforderungen an die App:

- Ein- und Ausschalten der Lampe

- Einstellen der Helligkeit

- Ändern der Farbe

- Darstellung von Morse-Code über Lichtsignale


## Architekturentscheidung und Begründung

Zur Umsetzung dieser Anforderungen haben wir, wie in der Aufgabenstellung vorgegeben, eine ereignisgesteuerte Architektur gewählt. Die Kommunikation zwischen dem Frontend/Backend (Producer) und der Lampensteuerung (Consumer) erfolgt asynchron über den Message Broker RabbitMQ.

### Stärken der Architektur:

- Entkopplung: Die Producer (Benutzereingaben) und Consumer (Lampensteuerung) sind unabhängig voneinander.

- Skalierbarkeit: Weitere Steuerungs-Frontends oder Lampen lassen sich leicht ergänzen.

- Fehlertoleranz: Nachrichten bleiben erhalten, auch wenn ein Systemteil kurzfristig ausfällt.

- Erweiterbarkeit: Die Architektur erlaubt es, künftig weitere IoT-Geräte oder Funktionen einfach zu integrieren.

### Warum RabbitMQ perfekt zu unserem System passt:

RabbitMQ wurde gewählt, da es als klassischer Message Broker ideal zu unserer Event-Driven-Architecture passt. Es unterstützt das AMQP-Protokoll, bietet zuverlässige, persistente Nachrichtenübermittlung und ermöglicht durch Exchanges flexibles Routing. Zudem ist es leicht integrierbar, stabil im Einsatz und über ein Web-UI gut überwachbar.

### Warum andere Message Broker für uns nicht geeignet sind:

- Kafka: Für sehr große Datenmengen und Echtzeit-Streaming ausgelegt, also für unsere Anwendung mit wenigen Events zu aufwendig.

- Redis: Sehr schnell, aber ohne echtes Routing und nur eingeschränkte Persistenz.

- ActiveMQ: Ebenfalls AMQP-basiert, aber weniger verbreitet und schlechter integriert mit modernen JS-Technologien.

## Aufbau und Funktionsweise der Anwendung

### Komponenten im Überblick:

Frontend (Producer):
- Stellt eine HTML/JavaScript-Oberfläche bereit, über die die Lampe gesteuert wird (z. B. Licht an/aus, Helligkeit, Farbe, Morsecode).

Backend (Producer):
- Setzt auf Node.js/Express auf, verarbeitet die Benutzereingaben und sendet sie als Nachrichten an RabbitMQ.

RabbitMQ (Message Broker):
- Vermittelt Nachrichten zwischen Frontend/Backend und der Lampensteuerung.

Consumer (Lampensteuerung):
- Ein Node.js-Skript empfängt die Nachrichten und steuert die TP-Link Tapo Bulb über die vorgegebene Bibliothek tplink-bulbs.

Änderungen am Lampenzustand werden per WebSocket an die Statusanzeige im Browser gesendet.

## Wie funktioniert eure Anwendung?
### Ablauf der Steuerung:

Benutzereingabe:
- Der Nutzer steuert über das Web-Frontend (HTML mit Express) Funktionen wie Ein-/Ausschalten, Helligkeit, Farbe oder Morsecode.

Nachrichtenversand:
- Das Backend sendet die Befehle in Form von JSON-Nachrichten an die Queue lamp-commands.

Nachrichtenverarbeitung:
- Der Consumer verarbeitet die Nachricht und führt die gewünschte Aktion an der Lampe aus. Ohne reale Lampe wird ein Demo-Modus mit Konsolenausgaben aktiviert.

## Erfüllung der Anforderungen
Die Anwendung erfüllt alle in der Aufgabenstellung genannten Funktionen:

Ein- und Ausschalten:
Über die Web-Oberfläche steuerbar.

Helligkeit regulieren:
Einstellbar von 0 bis 100 Prozent.

Farbe ändern:
Eingabe als RGB oder Farbpalette.

Morse-Code:
Texteingaben werden in Morsezeichen übersetzt und durch Blinksignale der Lampe dargestellt.

## Besondere Hinweise

RabbitMQ muss lokal installiert und gestartet sein (siehe README).

Zugangsdaten für die Lampe sind in der .env-Datei im Consumer-Verzeichnis gespeichert.

Demo-Modus: Ohne echte Lampe erfolgt eine Konsolen-Simulation der Befehle.

Statusanzeige: Live im Browser über consumer/status.html.

RabbitMQ-Weboberfläche erreichbar unter http://localhost:15672 (Login: guest / guest).

## Teamarbeit

Alle Teammitglieder waren gleichermaßen an Architektur, Implementierung und Dokumentation beteiligt. Die Zusammenarbeit erfolgte kollaborativ über GitHub.

## Matrikelnummern

- Raphael Plett: 6622347  
- Iven Stahl: 9820647
- Paulina Clauss: 4097552
