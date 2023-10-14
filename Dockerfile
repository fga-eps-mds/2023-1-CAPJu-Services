FROM node:18.13.0-alpine

WORKDIR /app

COPY . .

COPY entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

RUN npm i -g sequelize-cli

RUN npm install

ENTRYPOINT ["/bin/sh", "-c", "./entrypoint.sh"]