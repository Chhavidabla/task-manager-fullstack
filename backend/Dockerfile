FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Ensure the data directory exists for JSON persistence
RUN mkdir -p data

EXPOSE 3001
CMD ["node", "src/server.js"]
