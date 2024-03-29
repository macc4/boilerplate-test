FROM node:18.12

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]