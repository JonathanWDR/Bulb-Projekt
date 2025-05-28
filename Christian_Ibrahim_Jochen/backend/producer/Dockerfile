# Use a slim Node image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy only the producer's package files & install deps
COPY producer/package*.json ./
RUN npm install --production

# Copy shared code + producer source
COPY shared ./shared
COPY producer/src ./src

# Start the producer
CMD ["npm", "start"]
