FROM node:18-alpine
WORKDIR /usr/src/app/backend/producer

# 1) Install producer deps
COPY backend/producer/package*.json ./
RUN npm install --production

# 2) Copy shared code (to match ../../shared)
COPY backend/shared ../shared

# 3) Copy producer source
COPY backend/producer/src ./src

# 4) Expose HTTP API port
EXPOSE 3000

# 5) Run your Express server
CMD ["npm", "start"]
