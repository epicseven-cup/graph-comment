import {InsertOneResult, MongoClient, WithId } from "mongodb";
import IGetWebsite from "../resource/types/request/IGetWebsite.js";
import IWebsite from "../resource/types/respond/IWebsite.js";
import { databaseLogger } from "../winston/index.js";

const uri =  process.env.MONGODB_URI || "mongodb://mongo:27017";
const databaseName: string = process.env.MONGO_DB_NAME || "comment-api";
const client = new MongoClient(uri);
async function run() {
    try {
        client.db(databaseName);
        databaseLogger.info("Starting database");
    } finally {
        await client.close();
    }
}

export async function insertWebsite(website: IWebsite) {
    client.connect()
    databaseLogger.info(`Data is going to be inserted: ${website}`);
    const result: InsertOneResult = await client.db(databaseName).collection("webiste").insertOne(website);
    databaseLogger.info(`Website was inserted with _id: ${result.insertedId}`);
}

export async function searchWebsite(iGetWebsite: IGetWebsite) {
    databaseLogger.info(`Reconnecting to MongoDB`);
    client.connect()
    databaseLogger.info(`Connected`);
    databaseLogger.info(`Searching for: ${iGetWebsite.websiteId}`);
    const result: WithId<IWebsite> | null =
        await client.db(databaseName).collection<IWebsite>("webiste")
        .findOne({websiteId: iGetWebsite.websiteId});
    databaseLogger.info(`Website was find with _id: ${result?._id}`);
}

run()