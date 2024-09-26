import { MongoClient } from "mongodb";
import { applicationLogger } from "../winston/index.js";
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const databaseName = process.env.MONGO_DB_NAME || "comment-api";
const client = new MongoClient(uri);
export const database = client.db(databaseName);
async function run() {
    try {
        applicationLogger.info("Starting database");
    }
    finally {
        await client.close();
    }
}
// async function insertWebsite(website: IWebsite) {
//     applicationLogger.info(`Data is going to be inserted: ${website}`);
//     const result: InsertOneResult = await database.collection("webiste").insertOne(website);
//     applicationLogger.info(`Website was inserted with _id: ${result.insertedId}`);
// }
export async function searchWebsite(iGetWebsite) {
    applicationLogger.info(`Searching for: ${iGetWebsite.websiteId}`);
    const result = await database.collection("webiste")
        .findOne({ websiteId: iGetWebsite.websiteId });
    applicationLogger.info(`Website was find with _id: ${result === null || result === void 0 ? void 0 : result._id}`);
}
run();
