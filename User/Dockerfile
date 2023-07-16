FROM node:18.13.0

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . .

CMD ["/bin/sh", "-c", "npm start"]
