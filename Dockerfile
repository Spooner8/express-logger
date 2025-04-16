FROM node:lts-alpine

WORKDIR /usr/src/logger

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "prod"]