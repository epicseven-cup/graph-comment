import express from "express";
import { readFileSync } from "fs";
import { buildSchema, GraphQLSchema} from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import winston from "winston";

import Pong from "./resource/types/Pong";

const schemaFileContent: string = readFileSync("./src/graphql/schema.graphql", "utf-8");
const schema: GraphQLSchema = buildSchema(schemaFileContent);
const resolver: object = {
    Ping(content: string) {
        return new Pong(content);
    },
};

const app: express.Express = express();

const logger: winston.Logger = winston.createLogger({
    defaultMeta: { service: "user-service"},
    format: winston.format.json(),
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

app.use((req, res, next) => {
    logger.info(`Received a ${req.method} request for ${req.url}. Current respond ${res.json}`);
    next();
});

app.all(
    "/graphql", createHandler({
        rootValue: resolver,
        schema,
    }),
);

app.listen(4000);
