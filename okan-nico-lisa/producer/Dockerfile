# Basis-Image
FROM node:23

# Arbeitsverzeichnis
WORKDIR /usr/src/app

# Abhängigkeiten installieren
COPY package.json ./
RUN npm install --production

# Applikationscode kopieren
COPY . .

# Port freigeben
EXPOSE 3000

# Startbefehl
CMD ["node", "api.js"]