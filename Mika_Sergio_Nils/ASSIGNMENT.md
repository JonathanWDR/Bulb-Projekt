# DHBW-Mannheim-WI2023SEB-Assignment - Mika, Sergio, Nils

## Welche Architektur habt ihr gewählt - und warum?

Wir haben uns für eine Event-Driven-Architecture (EDA), wie sie in der Vorlesung "SE-II: Moderne Softwarearchitekturen" angerissen wurde, entschieden und wie es in den Anforderungen für das Assignment formuliert wurde.
Explizit haben wir uns dabei für eine Architektur entschieden, die auf RabbitMQ als Message Broker setzt. Teile der Gruppe hatten bereits mit Apache Kafka gearbeitet, weshalb wir etwas Neues ausprobieren wollten und uns deshalb für RabbitMQ entschieden haben.
RabbitMQ selbst ist wie eben genannt eine sogenannte Message Broker Software, die in Erlang geschrieben ist und von der Rabbit Technologies Ltd. entwickelt und gepflegt wird.
Bei der Event-Driven-Architecture fungieren Events als zentrales Kommunikationsmedium. Die Events in unserem speziellen Projekt sind beispielsweise die Veränderung der Farbe oder das Reduzieren beziehungsweise Erhöhen der Helligkeit.
Für uns von Vorteil war insbesondere die Flexibilität der Event-Driven-Architecture, also in unserem Fall explizit die Flexibilität in Bezug auf die Events, die relativ leicht hinzugefügt, geändert und erweitert werden konnten. Des Weiteren haben wir die Asynchronität als äußerst vorteilhaft bewertet, da so Befehle unabhängig voneinander verarbeitet werden können. Das schnelle Ändern der Helligkeit und Anpassen der Farbe etwa sorgt für keine Komplikationen, da die Warteschlange der Befehle einfach vom Consumer nacheinander abgearbeitet werden können.
Die in der Vorlesung angesprochenen Nachteile wie etwa aufwendigeres Debbuging, die sich aus der Asynchronität ergeben, waren für uns nachrangig, da es sich um eine relativ kleine Anwendung handelt.
Die erhöhte Schwierigkeit beim Testen (da jeder Consumer getrennt getestet werden muss), spielte für uns auch keine Rolle, da wir in dieser kleinen Applikation mit einem Consumer auskommen.
Zusammenfassend haben wir uns aus Neugier eine neue Technologie auszuprobieren, auf Basis der Vorgaben des Assignments und den angesprochenen Vorteilen für die vorliegende Architektur entschieden.
  
## Wie funktioniert eure Anwendung?

Unsere Anwendung besteht aus unterschiedlichen Komponenten, die zusammenarbeiten, um das Steuern der Glühbirne zu ermöglichen.

1. Für den Anwender sichtbar ist nur die Benutzeroberfläche also das Frontend. Dieses ist in der index.html implementiert und wird durch script.js gesteuert. Über das Frontend kann der Endnutzer die Glühbirne einschalten, ausschalten, die Helligkeit anpassen, die Farbe der Glühbirne ändern und Nachrichten als Morse-Code senden. Die Eingaben des Anwenders (also unsere Events) werden nach Bestätigung via der Buttons als HTTP-POST-Anfragen an den Producer gesendet.

2. Die Producer-Api und der Producer in Form der producerApi.js und der producer.js stellen den Producer dar. Die Producer-API nimmt dabei die Befehle des Frontends entgegen und ruft den Producer auf, um die Events in RabbitMQ zu veröffentlichen.

3. RabbitMQ stellt in diesem Fall also unseren Message Broker dar und vermittelt zwischen dem Producer und dem Consumer.

4. Der Consumer, in diesem Fall durch die consumer.js realisiert, liest die Nachrichten aus der RabbitMQ-Warteschlange (asynchrone Verarbeitung) aus und "führt" die entsprechenden Aktionen schlussendlich für den Endnutzer sichtbar aus, in dem er die TP-Link-API aufruft und so den Zustand der Lampe verändert.
