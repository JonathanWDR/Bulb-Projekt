FROM node:18-alpine
WORKDIR /usr/src/app

# Install consumer dependencies
COPY consumer/package*.json ./
RUN npm install --production

# Copy shared code + consumer source
COPY shared ./shared
COPY consumer/src ./src

# Start the consumer
CMD ["npm", "start"]
