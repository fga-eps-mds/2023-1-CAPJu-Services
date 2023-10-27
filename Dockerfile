FROM node:18.13.0

WORKDIR /app

COPY . .

COPY entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/bin/sh", "-c", "chmod +x ./entrypoint.sh; ./entrypoint.sh"]
