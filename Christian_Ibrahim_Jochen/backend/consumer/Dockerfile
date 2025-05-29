FROM node:18-alpine3.21
WORKDIR /usr/src/app/backend/consumer

# Update Alpine packages to fix vulnerabilities
RUN apk update && apk upgrade --no-cache

# Install curl
RUN apk add --no-cache curl

# Install consumer deps
COPY backend/consumer/package*.json ./
RUN npm install --production

# Copy shared code
COPY backend/shared ../shared

# Copy consumer source
COPY backend/consumer/src ./src

# Start the consumer
CMD ["npm", "start"]
