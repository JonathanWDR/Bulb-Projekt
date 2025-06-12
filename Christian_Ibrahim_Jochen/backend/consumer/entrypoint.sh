#!/bin/sh
set -e

# Use an environment variable if you prefer, otherwise hard-coded works.
TARGET_IP=${TAPO_DEVICE_IP:-192.168.216.238}

echo "🏁 Running setup…"
echo "🔄 Pinging $TARGET_IP to prime ARP cache"
ping -c 5 "$TARGET_IP" > /dev/null || true

# Give the kernel a moment to update its ARP table
sleep 2

echo "🚀 Starting consumer server…"
exec npm start
