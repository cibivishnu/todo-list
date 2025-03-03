import winston from "winston";
const { combine, timestamp, cli, json } = winston.format;

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), cli()),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: './logs/info.log',
            level: 'info',
            format: combine(timestamp(), json())
        }),
        new winston.transports.File({
            filename: './logs/error.log',
            level: 'error',
            format: combine(timestamp(), json())
        })
    ],
});