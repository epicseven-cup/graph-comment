import winston from "winston";

const {combine, timestamp, label, prettyPrint, cli } = winston.format

export const applicationLogger: winston.Logger= winston.createLogger({
    defaultMeta: { service: "application-service"},
    format: combine(
        timestamp(),
        label({label: "Express.js"}),
        prettyPrint(),
        cli(),
    ),
    level: "info",
    transports: [
        new winston.transports.File({
            filename: "error.log", level: "error",
        }),
    ],
});

export const databaseLogger: winston.Logger = winston.createLogger({
    defaultMeta: { service: "database-service" },
    format: combine(
        timestamp(),
        label({label: 'Database'}),
        prettyPrint(),
        cli()
    ),
    level: "info",
    transports: [
        new winston.transports.File({
            filename: "database-error.log", level: "error",
        }),
    ],

});

if (process.env.APP_ENV !== "production") {
    applicationLogger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));

   databaseLogger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}
