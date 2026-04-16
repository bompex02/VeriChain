import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.MONGODB_CONNECTION_STRING;
const dbName = process.env.MONGODB_DB;

if (!connectionString) {
  console.error('MONGODB_CONNECTION_STRING is not set in .env');
  process.exit(1);
}
if (!dbName) {
  console.error('MONGODB_DB is not set in .env');
  process.exit(1);
}

let client;
let db;

export async function connectMongo() {
  if (!client) {
    client = new MongoClient(connectionString);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB:', dbName);
  }
  return db;
}

export function getMongoDb() {
  if (!db) {
    throw new Error('MongoDB not connected. Call connectMongo() first.');
  }
  return db;
}

export async function closeMongo() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
