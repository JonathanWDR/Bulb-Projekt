# Ausarbeitung – LLM-Light-Control

**Software Engineering II – IoT-Projekt**  
**Abgabe: 27.06.2025, 20:00 Uhr**  
**Gruppe:** Leon, Luca, Monika  
**Dozent:** Mathis Neunzig  
**E-Mail:** mathis.neunzig@gmail.com

---

## 1. Gewählte Architektur und Begründung

Wir haben uns für eine **Event-Driven-Architecture** (EDA) entschieden, wie in der Aufgabenstellung gefordert. Die Kommunikation zwischen Frontend/Backend (Producer) und der Lampensteuerung (Consumer) erfolgt asynchron über **RabbitMQ** als Message Broker.

**Vorteile dieser Architektur:**

- **Entkopplung:** Producer und Consumer sind unabhängig voneinander und können getrennt entwickelt, getestet und betrieben werden.
- **Skalierbarkeit:** Weitere Producer oder Consumer können einfach hinzugefügt werden (z.B. mehrere Lampen oder Steuerungs-UIs).
- **Fehlertoleranz:** Nachrichten gehen nicht verloren, wenn ein Teil des Systems kurzzeitig nicht erreichbar ist.
- **Flexibilität:** Die Architektur kann leicht auf andere IoT-Geräte oder zusätzliche Funktionen erweitert werden.

---

## 2. Funktionsweise der Anwendung

### Komponenten

- **Producer (Frontend + Backend):**

  - Das Frontend (HTML/JS) bietet eine Web-Oberfläche zur Steuerung der Lampe (An/Aus, Helligkeit, Farbe, Morsecode).
  - Das Backend (Node.js/Express) nimmt die Steuerbefehle entgegen und sendet sie als Nachrichten an RabbitMQ.

- **Consumer (Lampensteuerung):**

  - Ein Node.js-Skript empfängt die Nachrichten von RabbitMQ.
  - Die Steuerung der TP-Link Tapo Bulb erfolgt über die Bibliothek `tplink-bulbs`.
  - Statusänderungen werden per WebSocket an eine Statusanzeige im Browser übertragen.

- **RabbitMQ:**
  - Vermittelt die Nachrichten zwischen Producer und Consumer.
  - Die Queues und Nachrichten können über das Web-UI ([http://localhost:15672](http://localhost:15672), Login: guest/guest) eingesehen werden.

### Ablauf

1. **Nutzerinteraktion:**  
   Der Nutzer steuert die Lampe über das Web-Frontend (z.B. Licht einschalten, Helligkeit ändern).

2. **Backend:**  
   Das Backend nimmt die Befehle entgegen und sendet sie als JSON-Nachricht an die RabbitMQ-Queue `lamp-commands`.

3. **Consumer:**  
   Der Consumer liest die Nachrichten aus der Queue und führt die gewünschten Aktionen an der Lampe aus.  
   Ist keine echte Lampe verbunden, läuft ein Demo-Modus (nur Konsolen-Logs).

4. **Statusanzeige:**  
   Der aktuelle Lampenstatus wird per WebSocket an eine Statusseite im Browser übertragen und dort live angezeigt.

---

## 3. Erfüllte Anforderungen

- **An- und Ausschalten:**  
  Über die UI kann die Lampe ein- und ausgeschaltet werden.

- **Helligkeit bearbeiten:**  
  Die Helligkeit ist von 0 bis 100 einstellbar.

- **Farbe ändern:**  
  Die Farbe kann als Hex-Wert oder Name gesetzt werden.

- **Morse-Code:**  
  Texteingaben werden in Morsecode umgewandelt und durch Blinken der Lampe dargestellt.

---

## 4. Besonderheiten & Hinweise

- **RabbitMQ muss lokal installiert und gestartet sein** (siehe README).
- **Zugangsdaten für die Lampe** werden in einer `.env`-Datei im Consumer-Ordner hinterlegt.
- **Demo-Modus:** Ohne echte Lampe werden die Befehle simuliert.
- **Statusanzeige:** Live im Browser unter `consumer/status.html`.
- **Queues können im RabbitMQ-Web-UI** ([http://localhost:15672](http://localhost:15672), guest/guest) eingesehen werden.

---

## 5. Zusammenarbeit

Alle Gruppenmitglieder haben gemeinsam an der Architektur, Implementierung und Dokumentation gearbeitet. Die Arbeit erfolgte kollaborativ über GitHub.

---

## 6. Matrikelnummern

- Leon: [Matrikelnummer eintragen]
- Luca: [Matrikelnummer eintragen]
- Monika: [Matrikelnummer eintragen]
