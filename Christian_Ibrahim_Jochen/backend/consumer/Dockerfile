FROM node:18-alpine3.21

WORKDIR /usr/src/app/backend/consumer

# Install curl + arp (net-tools), and upgrade
RUN apk update \
    && apk upgrade --no-cache \
    && apk add --no-cache curl net-tools

# Install consumer deps
COPY backend/consumer/package*.json ./
RUN npm install --production

# Copy shared code
COPY backend/shared ../shared

# Copy consumer source
COPY backend/consumer/src ./src

# Copy and make entrypoint executable
COPY backend/consumer/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Run the setup wrapper; the script must 'exec "$@"' at its end
ENTRYPOINT ["./entrypoint.sh"]
# ENTRYPOINT ["sh", "-c", "echo \"PWD=$(pwd)\"; ls -la; echo \"--- now exec---\"; exec ./entrypoint.sh"]


# Default to starting your app
CMD ["npm", "start"]
