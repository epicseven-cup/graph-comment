"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const graphql_1 = require("graphql");
const express_2 = require("graphql-http/lib/use/express");
const winston_1 = __importDefault(require("winston"));
const server_1 = require("ruru/server");
const schemaFileContent = (0, fs_1.readFileSync)("./src/graphql/schema.graphql", "utf-8");
const schema = (0, graphql_1.buildSchema)(schemaFileContent);
const app = (0, express_1.default)();
const logger = winston_1.default.createLogger({
    defaultMeta: { service: "user-service" },
    format: winston_1.default.format.json(),
    level: "info",
    transports: [
        new winston_1.default.transports.File({
            filename: "error.log", level: "error",
        }),
    ],
});
if (process.env.APP_ENV !== "production") {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple(),
    }));
}
const resolver = {
    Ping(req) {
        return req.inputContent;
    },
    GetWebsite(req) {
        return req;
    },
};
app.use((req, _, next) => {
    logger.info(`Received a ${req.method} request for ${req.url}.`);
    next();
});
app.all("/graphql", (0, express_2.createHandler)({
    rootValue: resolver,
    schema,
}));
// Serve the GraphiQL IDE.
app.get("/", (_, res) => {
    res.type("html");
    res.end((0, server_1.ruruHTML)({ endpoint: "/graphql" }));
});
app.listen(4000);
