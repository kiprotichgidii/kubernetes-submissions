FROM node:22-alpine

WORKDIR /app

COPY package.json index.js ./

RUN npm install --omit=dev

EXPOSE 3001

CMD ["node", "index.js"]
