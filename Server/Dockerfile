FROM node:18

# Poppler install
RUN apt-get update && apt-get install -y poppler-utils
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    pkg-config

# App setup
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Run app
CMD ["node", "server.js"]