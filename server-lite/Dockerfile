FROM node:18-alpine
WORKDIR /api

COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./

ENV PORT=3000

EXPOSE 3000

CMD ["node", "index.js"]
