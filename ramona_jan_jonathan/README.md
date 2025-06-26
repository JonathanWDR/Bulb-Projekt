## Setup
- install docker extension in vs code

- npm init -y
- npm install express amqplib cors

- make sure .env exists
    TP_EMAIL=<deine-email@example.com>
    TP_PASSWORD=<dein-passwort>
    TP_DEVICE_ID=<deine-device-id>

- make sure docker-compose.yml exists

## Run the project
# 1. Start RabbitMQ (docker desktop needs to be running)
docker-compose up -d

# 2. Start backend server
node backend/server.js

# 4. Open in browser
http://localhost:3000

(Visit RabbitMQ UI at: http://localhost:15672 (user: guest, pass: guest))