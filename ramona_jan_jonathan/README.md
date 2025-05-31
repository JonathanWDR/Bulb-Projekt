# Basis Struktur des Projekts
consumer: enthält das repo https://github.com/DrBackmischung/DHBW-Mannheim-WI2023SEB-Consumer/blob/main/README.md
producer: enthält das repo https://github.com/DrBackmischung/DHBW-Mannheim-WI2023SEB-Producer/blob/main/README.md
src: sind die configs für die tplink-bulbs https://github.com/DrBackmischung/tplink-bulbs/tree/main/src
ui: enthält die Grafik der benutzer oberfläche



Was noch gebraucht wird um producer und consumer zu starten:
richtiges passwort und verbindung
und rabbitMQ starten:
docker run -d --hostname my-rabbit --name some-rabbit -p 5672:5672 rabbitmq:3

