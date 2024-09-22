import express from "express";
import { readFileSync } from "fs";
import { buildSchema, GraphQLSchema} from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import winston from "winston";

import { ruruHTML } from "ruru/server";
import IPing from "./resource/types/Ping";

const schemaFileContent: string = readFileSync("./src/graphql/schema.graphql", "utf-8");
const schema: GraphQLSchema = buildSchema(schemaFileContent);

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

const resolver: object = {
    Ping( req: IPing) {
            return req.inputContent ;
    },
};

app.use((req, _, next) => {
    logger.info(`Received a ${req.method} request for ${req.url}.`);
    next();
});

app.all(
    "/graphql", createHandler({
        rootValue: resolver,
        schema,
    }),
);

// Serve the GraphiQL IDE.
app.get("/", (_, res) => {
    res.type("html");
    res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.listen(4000);
