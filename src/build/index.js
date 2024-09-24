import express from "express";
import { readFileSync } from "fs";
import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";
import { searchWebsite } from "./database/index.js";
import { logger } from "./winston/index.js";
const schemaFileContent = readFileSync("./src/graphql/schema.graphql", "utf-8");
const schema = buildSchema(schemaFileContent);
const app = express();
const resolver = {
    Ping(req) {
        return req.inputContent;
    },
    GetWebsite(req) {
        return searchWebsite(req);
    },
};
app.use((req, _, next) => {
    logger.info(`Received a ${req.method} request for ${req.url}.`);
    next();
});
app.all("/graphql", createHandler({
    rootValue: resolver,
    schema,
}));
// Serve the GraphiQL IDE.
app.get("/", (_, res) => {
    res.type("html");
    res.end(ruruHTML({ endpoint: "/graphql" }));
});
app.listen(4000);
