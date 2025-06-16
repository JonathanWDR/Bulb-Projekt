
# 🗂️ Chris & Jochen: Wir machen eine Lampe

Dieses Projekt ist eine verteilte Lampensteuerung mit RabbitMQ, Producer (API), Consumer (Gerätesteuerung) und einem Frontend zum Steuern und Morsecode-Abspielen.
Alles läuft bequem über Docker Compose.

---

## 🚀 Schnellstart

## 1️⃣ Repository klonen

    git clone https://github.com/Jochern/Chris-Jochen-IbU_machen_eine_Lampe.git
    cd Chris-Jochen-IbU_machen_eine_Lampe

## 2️⃣ .env erstellen

Erstelle im Projektordner eine .env mit deinen TAPO-Zugangsdaten und optional Dev-Mode:

    TAPO_EMAIL=dein@email.de
    TAPO_PASSWORD=deinPasswort
    TAPO_IP=192.168.x.x
    DEV_MODE=true

Hinweis: Mit DEV_MODE=true wird ein MockDevice verwendet — keine echte Lampe nötig.
Für echten Betrieb: DEV_MODE=false und echte IP & Zugangsdaten verwenden.

---

## 3️⃣ Starten

    docker-compose up --build

- Frontend: http://localhost:8080
- API Producer: http://localhost:3000
- RabbitMQ Management: http://localhost:15672 (Login: guest / guest)

---

## ⚙️ Architektur

Frontend (React)

   ──> Producer (Express REST API)
               
               ──> RabbitMQ (Queue)
                           
                           ──> Consumer (verbindet & steuert Lampe)


- Frontend: UI zum Ein-/Ausschalten, Farbe, Helligkeit & Morsecode.
- Producer: REST API → wandelt HTTP-Requests in RabbitMQ-Nachrichten.
- RabbitMQ: Vermittelt die Befehle.
- Consumer: Liest Befehle aus der Queue & steuert die Lampe (oder Mock).

---

## 🔑 Umgebungsvariablen

| Variable | Beschreibung | Pflicht |
| -------- | ------------- | ------- |
| TAPO_EMAIL | Dein TP-Link Tapo Login | ✅ |
| TAPO_PASSWORD | Dein Tapo-Passwort | ✅ |
| TAPO_IP | Lokale IP deiner Lampe | ✅ |
| DEV_MODE | true = Mock verwenden, false = echte Lampe | ✅ |

---

## 💡 Nutzung

- Lampe AN/AUS: Ein-/Ausschalten, Farbe & Helligkeit einstellen.
- Morsecode: Text eingeben → Lampe blinkt den Morsecode.
- RabbitMQ Management: Queues & Nachrichten überwachen.

---

## 🧑‍💻 Entwicklerhinweise

- Consumer manuell starten:

      cd backend/consumer
      node index.js

- DEV_MODE=true für lokale Tests ohne echte Lampe.
- Frontend entwickeln:

      cd frontend
      npm install
      npm run dev

---

## 🫶 Viel Spaß beim Basteln & Steuern!
