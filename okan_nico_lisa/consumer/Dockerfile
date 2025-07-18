FROM node:23

RUN apt-get update && \
    apt-get install -y --no-install-recommends net-tools && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install --production

COPY . .

CMD ["node", "consumer.mjs"]