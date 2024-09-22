import {MongoClient } from 'mongodb'

const uri =  process.env.MONGODB_URI || "mongodb://localhost:27017"

export const client = new MongoClient(uri)

async function run(){
    try {
        client.db('comment-api')
    } finally {
        await client.close()
    }
}

run()