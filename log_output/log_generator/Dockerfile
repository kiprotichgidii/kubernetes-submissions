FROM node:22-alpine

WORKDIR /app

COPY package.json index.js ./

RUN npm install --production

CMD ["node", "index.js"]


