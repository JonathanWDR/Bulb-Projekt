## Setup
- install docker extension in vs code

- npm init -y
- npm install express amqplib cors

- Connect the bulb with a network via the tapo mobile app

- make sure .env exists in ./ramona_jan_jonathan/.env, with the credentials used in the tapo app:
    - TP_EMAIL=<email@example.com>
    - TP_PASSWORD=<password>

- make sure docker-compose.yml exists

## Run the project
### 1. Start RabbitMQ (docker desktop needs to be running)
docker-compose up -d

### 2. Start backend server
node backend/server.js

### 4. Open in browser
http://localhost:3000

(Visit RabbitMQ Dashboard at: http://localhost:15672 (user: guest, pass: guest))
