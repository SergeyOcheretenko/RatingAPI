FROM node:18.12.1-buster-slim

RUN apt-get update \
    && apt-get install apt-file -y \
    && apt-file update \
    && apt-get install vim -y

RUN mkdir -p /app/RatingAPI/node_modules \
    && chown -R node:node /app

WORKDIR /app/RatingAPI

COPY package*.json ./
COPY tsconfig.json ./

USER node

RUN npm ci

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "start:prod" ]
