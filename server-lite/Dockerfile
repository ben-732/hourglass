FROM node:18-alpine
WORKDIR /api

COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./

ENV PORT=8080

EXPOSE 8080

CMD ["node", "index.js"]
