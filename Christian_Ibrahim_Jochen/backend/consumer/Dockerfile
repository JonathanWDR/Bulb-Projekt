FROM node:18-alpine
WORKDIR /usr/src/app/backend/consumer

# Install consumer deps
COPY backend/consumer/package*.json ./
RUN npm install --production

# Copy shared code
COPY backend/shared ../shared

# Copy consumer source
COPY backend/consumer/src ./src

# Start the consumer
CMD ["npm", "start"]
