import {MongoClient, WithId } from "mongodb";
import IGetWebsite from "../resource/types/request/IGetWebsite.js";
import IWebsite from "../resource/types/respond/IWebsite.js";
import { logger } from "../winston/index.js";

const uri =  process.env.MONGODB_URI || "mongodb://mongo:27017";
const databaseName: string = process.env.MONGO_DB_NAME || "comment-api";
const client = new MongoClient(uri);
async function run() {
    try {
        client.db(databaseName);
        logger.info("Starting database");
    } finally {
        await client.close();
    }
}

// async function insertWebsite(website: IWebsite) {
//     logger.info(`Data is going to be inserted: ${website}`);
//     const result: InsertOneResult = await database.collection("webiste").insertOne(website);
//     logger.info(`Website was inserted with _id: ${result.insertedId}`);
// }

export async function searchWebsite(iGetWebsite: IGetWebsite) {
    logger.info(`Reconnecting to MongoDB`);
    client.connect()
    logger.info(`Connected`);
    logger.info(`Searching for: ${iGetWebsite.websiteId}`);
    const result: WithId<IWebsite> | null =
        await client.db(databaseName).collection<IWebsite>("webiste")
        .findOne({websiteId: iGetWebsite.websiteId});
    logger.info(`Website was find with _id: ${result?._id}`);
}

run()