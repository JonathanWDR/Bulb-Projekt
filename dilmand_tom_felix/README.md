## How to Use

Die Applikation ist Containerisiert und muss deshalb mittels Docker-Compose gestartet werden. Dazu muss folgendes ausgeführt werden:

```sh
docker-compose build
docker-compose up
```

Durch aufrufen der entsprechenden Web-UI, bspw. durch nutzen von Live-Server, können die erwünschten Funktionalitäten der Lampe angesteuert werden.\
Daruter fallen: Ein-/Ausschalten, Farbänderungen, Anpassung der Helligkeit, sowie Darstellung eines Wortes mittels Morse-Code.

<img src="./image.png" width="60%" alt="Beschreibung des Bildes">

## Verbinden der Lampe

1. Hotspot/WLAN öffnen (min. 2,4 Ghz).
2. Die Lampe und Gerät der Anwendung mit dem WLAN verbinden.
3. Lampe mit der App verbinden.
4. Die entsprechenden Credentails in der .env eintragen.