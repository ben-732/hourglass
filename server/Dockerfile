FROM node:18-alpine
WORKDIR /api

COPY package.json ./
COPY package-lock.json ./
RUN  apk add alsa-lib-dev
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN npm install
COPY . ./

ENV PORT=8080

EXPOSE 8080

CMD ["node", "index.js"]
