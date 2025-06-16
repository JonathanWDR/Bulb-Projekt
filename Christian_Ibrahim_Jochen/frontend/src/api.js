/**
 * sendLampCommand
 * Schickt einen Befehl an deinen Producer REST-API-Endpunkt,
 * der ihn dann in die RabbitMQ-Queue stellt.
 *
 * @param {string} command - z.B. "on", "off", "brightness", "color"
 * @param {any} value - optionaler Wert (z.B. Zahl oder Farbcodestring)
 */
export async function sendLampCommand(command, value) {
  const response = await fetch("http://localhost:3000/api/command", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ command, value })
  });

  if (!response.ok) {
    throw new Error(`Server returned ${response.status}: ${response.statusText}`);
  }

  return response.json(); // optional, nur falls du es brauchst
}
