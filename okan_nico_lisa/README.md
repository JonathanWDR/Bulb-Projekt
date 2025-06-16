## Voraussetzungen
- Docker muss installiert sein
- TP-Link Tapo App muss installiert sein
- Account muss in der App erstellt worden sein
- Lampe muss konfiguriert worden sein (& sich bei Ausführung in einem *geeigneten* Netzwerk befinden.)

## Ausführung
- git clone https://github.com/okso-hub/DHBW-Mannheim-WI2023SEB-Assignment.git
- cd .\DHBW-Mannheim-WI2023SEB-Assignment\okan-nico-lisa\consumer\
- cp .env.copy .env
- Credentials in der .env Datei anpassen (IP kann in den Einstellungen der Lampe in der TP-Link Tapo App ausgelesen werden)
- cd ..
- docker-compose up
- Website nach vollständigem Start aller Services aufrufen: http://localhost:3000
