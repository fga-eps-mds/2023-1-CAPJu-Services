FROM node:18.13.0

WORKDIR /app

COPY . .

RUN npm i

RUN chmod +x entrypoint.sh

RUN npm i -g sequelize-cli

RUN npm install

ENTRYPOINT ["./entrypoint.sh"]