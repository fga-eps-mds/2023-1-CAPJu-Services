FROM node:18.13.0

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . .

CMD ["npm", "start"]
