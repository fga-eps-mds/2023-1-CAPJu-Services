import pino from 'pino';

export const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            levelFirst: true,
            translateTime: 'dd/mm/yyyy HH:MM:ss',
            ignore: 'pid,hostname',
            messageFormat: '{msg}',
        }
    },
});