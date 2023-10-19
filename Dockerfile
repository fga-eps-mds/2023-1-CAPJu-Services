FROM node:18.13.0-alpine

WORKDIR /app

COPY . .

COPY entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

RUN npm i -g sequelize-cli

RUN npm install

ENTRYPOINT ["/bin/sh", "-c", "chmod +x ./entrypoint.sh; ./entrypoint.sh"]
