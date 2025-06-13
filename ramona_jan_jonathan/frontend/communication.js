function sendCommand(state) {
  fetch('/led', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state })
  }).then(res => res.json()).then(data => console.log(data));
}
