import express from "express";
import { readFileSync } from "fs";
import { buildSchema, GraphQLSchema} from "graphql";
import { createHandler } from "graphql-http/lib/use/express";

import { ruruHTML } from "ruru/server";
import IGetWebsite from "./resource/types/request/IGetWebsite.js";
import IPing from "./resource/types/request/IPing.js";

import { searchWebsite } from "./database/index.js";
import { logger } from "./winston/index.js";

const schemaFileContent: string = readFileSync("./src/graphql/schema.graphql", "utf-8");
const schema: GraphQLSchema = buildSchema(schemaFileContent);

const app: express.Express = express();

const resolver: object = {
    Ping( req: IPing) {
            return req.inputContent;
    },

    GetWebsite( req: IGetWebsite ) {
        return searchWebsite(req);
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
