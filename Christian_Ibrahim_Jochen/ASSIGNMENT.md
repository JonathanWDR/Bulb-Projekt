
# Architektur und Funktionsweise der Anwendung

## Architektur

Für die Steuerung unserer Lampe haben wir eine einfache, aber klar strukturierte Architektur umgesetzt, die aus vier Hauptteilen besteht: RabbitMQ, Producer, Consumer und Frontend. Dazu kommt ein gemeinsames Shared Verzeichnis für wiederverwendbare Funktionen.

RabbitMQ fungiert als Nachrichtenvermittler zwischen Producer und Consumer. Der Producer stellt eine REST API bereit, über die Befehle vom Frontend entgegengenommen, geprüft und an RabbitMQ übergeben werden. Der Consumer liest diese Nachrichten aus der Queue und steuert die Lampe entsprechend. Das Frontend basiert auf React und bietet eine benutzerfreundliche Oberfläche zum Ein- und Ausschalten der Lampe, Ändern von Farbe und Helligkeit sowie zum Abspielen von Morsecode.

Im Shared Verzeichnis sind Funktionen gebündelt, die von Producer und Consumer genutzt werden. Dazu gehört die Verbindung zu RabbitMQ, die Steuerung der Lampe über die Tapo API oder ein MockDevice im Entwicklungsmodus sowie die Übersetzung von Text in Morsecode.

Diese Architektur wurde gewählt, um eine klare Trennung der Zuständigkeiten zu gewährleisten. Durch RabbitMQ sind Producer und Consumer entkoppelt, was die Ausfallsicherheit erhöht und das System erweiterbar macht. Änderungen am gemeinsamen Code müssen nur an einer Stelle gemacht werden, was die Wartung vereinfacht.

## Funktionsweise

Die Funktionsweise lässt sich einfach erklären. Ein Nutzer steuert die Lampe über die React Anwendung. Bei einer Aktion wie Einschalten oder Farbwechsel schickt das Frontend eine POST Anfrage an den Producer. Dieser überprüft die Anfrage und legt sie in der RabbitMQ Queue ab.

Der Consumer ist ständig mit RabbitMQ verbunden und wartet auf Nachrichten. Sobald eine Nachricht ankommt, verarbeitet er diese und führt den Befehl aus. Die Lampe wird über die Tapo API gesteuert. Im Entwicklungsmodus kann ein MockDevice verwendet werden, um ohne echte Hardware zu testen.

Beim Morsecode wird der eingegebene Text vom Frontend an den Producer gesendet. Der Consumer übersetzt den Text in eine Abfolge von An- und Aus-Signalen und lässt die Lampe den Morsecode blinken.

Durch diese Architektur ist die Anwendung robust und kann bei Bedarf um neue Funktionen erweitert werden, ohne die Grundstruktur ändern zu müssen.

## Warum RabbitMQ und nicht Apache Kafka?

Für unsere Anwendung haben wir RabbitMQ anstelle von Apache Kafka verwendet. Kafka ist vor allem für große Datenströme, Log-Analysen und verteilte Systeme optimiert, bei denen sehr viele Events pro Sekunde verarbeitet werden müssen und eine dauerhafte Speicherung der Events notwendig ist.

Da es in unserem Fall nur um einzelne Steuerbefehle für eine Lampe geht, reicht ein klassischer Message Broker wie RabbitMQ aus. RabbitMQ ist einfacher einzurichten, bietet eine übersichtliche Benutzeroberfläche für das Monitoring und hat genau die Funktionen, die wir für zuverlässiges Queueing und Routing der Nachrichten brauchen. So konnten wir uns auf die eigentliche Logik konzentrieren, ohne eine komplexe Streaming-Plattform betreiben zu müssen.
