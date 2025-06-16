FROM node:23

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install --production

COPY . .

# Exposes port 3000
EXPOSE 3000

CMD ["node", "api.js"]