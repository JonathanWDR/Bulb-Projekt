## Welche Architektur habt ihr gewählt - und warum?
Wir haben uns für eine Event-Driven-Architecture (EDA) entschieden, da diese Vorgabe für das im Folgenden beschriebene Projekt aufgrund der nachfolgend genannten Vorteile besonders gut geeignet ist.

**Vorteile**
- Entkopplung
  - Unsere Implementierung der EDA besteht aus einem Producer und einem Consumer, welche durch die Entkopplung voneinander getrennt entwickelt und ausgeführt werden können
- Queue
  - Wir haben in RabbitMQ eine Queue, welche Events sammelt und zwischenspeicher, bis der Consumer diese entgegennimmt. Dadurch gehen Events nicht verloren, wenn der Consumer zwischenzeitlich nicht erreichbar ist.
- Skalierbarkeit
  - Es kann mehrere Producer geben, somit können wir mehrere Instanzen des Frontend ausführen.

## Wie funktioniert eure Anwendung?
Unsere Anwendung besteht aus drei Services, welche jeweils in Docker Containern ausgeführt werden: 

1. Producer
    - Wir haben ein Backend, welches über Express eine HTML Webseite bereitstellt. Auf dieser befinden sich verschiedene Einstellmöglichkeiten für eine Tapo TPlink Smart Glühbirne (Ein/Aus, Farbe ändern, Helligkeit, Morse Code). Das Backend stellt Endpunkte bereit, über welche das Frontend die im UI getätigten Befehle für die Lampe an das Backend übergibt. Das Backend gibt diese Befehle dann in Form von Events an die RabbitMQ Queue weiter.
2. Consumer
    - Im Consumer, welcher in einem separaten Container läuft, werden die vom Producer über RabbitMQ gesendeten Events entgegengenommen und bearbeitet. Der Consumer loggt sich beim Start in der TPlink Cloud API ein und übergibt die aus den Events abgeleiteten Befehle an die API weiter. Die API steuert die Lampe an. Dazu wird die Library tplink-bulbs verwendet. Wie bereits erwähnt soll die Anwendung ermöglichen, dass die Lampe definierte Zeichenfolgen in Morse Code ausgeben kann. Dabei werden die einzelnen Zeichen eingelesen und in ihrer Morse Code repräsentation mittels Leucht- und Wartezeiten visualisiert.
3. RabbitMQ
    - Als Docker Image wird 'rabbitmq:3-management' verwendet. Dieses startet eine [RabbitMQ](https://www.rabbitmq.com/docs) Instanz.

Da die Verbindung zum RabbitMQ Channel beim Consumer und Producer identisch ist, wurde dieser Code in die Datei [rabbitmq/rmq.js](./rabbitmq/rmq.js) ausgelagert.

Über Docker Compose können alle genannten Container in korrekter Reihenfolge gestartet werden. Über einen Health Check wird sichergestellt, dass der RabbitMQ Container gestartet ist. Erst dann werden Producer und Consumer gestartet.

Sobald der Producer, welcher das Frontend bereitstellt, gestartet wurde, kann auf die Weboberfläche über die URL http://localhost:3000 zugegriffen werden. 

Eine Anleitung zum Aufsetzen und Ausführen dieser Anwendung ist in der Datei [README.md](./README.md) zu finden.

## Unsere Matrikelnummern
- Lisa 8604987
- Nico 4644690
- Okan 5646996
