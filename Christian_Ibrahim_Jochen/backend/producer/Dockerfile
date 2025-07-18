FROM node:18-alpine
WORKDIR /usr/src/app

# Copy and install producer dependencies
COPY backend/producer/package*.json ./backend/producer/
RUN cd backend/producer && npm install --production

# Copy and install shared dependencies
COPY backend/shared/package*.json ./backend/shared/
RUN cd backend/shared && npm install --production

# Copy actual source code
COPY backend/producer ./backend/producer
COPY backend/shared ./backend/shared

# Set working dir and start
WORKDIR /usr/src/app/backend/producer
EXPOSE 3000
CMD ["npm", "start"]
