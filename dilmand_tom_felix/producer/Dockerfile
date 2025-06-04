FROM node:18

WORKDIR /app

# Producer-Dateien
COPY producer/package*.json ./
COPY producer/tsconfig.json ./
COPY producer/src ./src

# Frontend aus Root kopieren
COPY Frontend ./Frontend

RUN npm install

CMD ["npx", "ts-node", "src/index.ts"]
