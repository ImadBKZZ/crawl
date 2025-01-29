FROM ghcr.io/puppeteer/puppeteer:23.4.0

USER root

RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    amqp-tools \
    jq

WORKDIR /app/crawler

COPY crawler/package*.json ./

RUN chmod 644 package*.json

RUN npm install

# Copie le reste des fichiers de l'application
COPY crawler /app/crawler

# Compile le code TypeScript en JavaScript (si nécessaire)
RUN npx tsc

# Génère le schéma JSON à partir du fichier de configuration TypeScript (si nécessaire)
RUN npx typescript-json-schema ./tsconfig.json CrawlerFlags > ./gen/crawlerFlagsSchema.json

# Définit le point d'entrée pour lancer l'application
ENTRYPOINT node gen/serv.js
