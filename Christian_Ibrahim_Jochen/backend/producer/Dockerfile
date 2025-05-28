FROM node:18-alpine
WORKDIR /usr/src/app/backend/producer

# Install producer deps
COPY backend/producer/package*.json ./
RUN npm install --production

# Copy shared code
COPY backend/shared ../shared

# Copy producer source
COPY backend/producer/src ./src

# Expose HTTP API port
EXPOSE 3000

# run your Express server
CMD ["npm", "start"]
