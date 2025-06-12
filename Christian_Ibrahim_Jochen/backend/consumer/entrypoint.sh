#!/bin/sh

# Ziel-IP
TARGET_IP=192.168.216.238

# Einmal ARP erzwingen – auch wenn keine Antwort kommt
echo "running setup…"
echo "Führe initialen Ping zu $TARGET_IP aus, um ARP zu triggern..."
ping -c 1 -W 1 $TARGET_IP > /dev/null || true

# Jetzt 2 Sekunden warten, damit ARP-Cache sich füllt
sleep 2

echo "Starte Consumer-Server…"

exec npm start