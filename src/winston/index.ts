import winston from "winston";

export const logger: winston.Logger = winston.createLogger({
    defaultMeta: { service: "user-service"},
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.cli(),
    ),
    level: "info",
    transports: [
        new winston.transports.File({
            filename: "error.log", level: "error",
        }),
    ],
});

if (process.env.APP_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}
