FROM node:18-alpine
WORKDIR /usr/src/app

# Copy and install consumer dependencies
COPY backend/consumer/package*.json ./backend/consumer/
RUN cd backend/consumer && npm install --production


# Copy and install shared dependencies
COPY backend/shared/package*.json ./backend/shared/
RUN cd backend/shared && npm install --production

# Copy actual source code
COPY backend/consumer ./backend/consumer
COPY backend/shared ./backend/shared


# Set working dir and start
WORKDIR /usr/src/app/backend/consumer

CMD ["npm", "start"]
