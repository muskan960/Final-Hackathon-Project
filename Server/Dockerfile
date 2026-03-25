FROM node:18

# Poppler install
RUN apt-get update && apt-get install -y poppler-utils

# App setup
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Run app
CMD ["node", "server.js"]