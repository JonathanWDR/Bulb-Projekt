# Basis-Image
FROM node:23

# Arbeitsverzeichnis
WORKDIR /usr/src/app

# Abhängigkeiten installieren
COPY package.json ./
RUN npm install --production

# Applikationscode kopieren
COPY . .

# Startbefehl
CMD ["node", "consumer.js"]