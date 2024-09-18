import { readFileSync } from 'fs'
import express from 'express'
import { createHandler } from 'graphql-http/lib/use/express'
import { buildSchema, GraphQLSchema} from 'graphql'


var schemaFileContent: string = readFileSync("resource/schema.graphql", "utf-8")

const schema: GraphQLSchema= buildSchema(schemaFileContent)


const resolver:Object = {
    Pong() {
        return "Pong!"
    }
}


const app: express.Express = express()
