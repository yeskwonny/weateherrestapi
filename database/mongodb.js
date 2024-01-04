import { MongoClient } from "mongodb";

import * as dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.MDBURL;
const client = new MongoClient(connectionString);
export const db = client.db("weather-api");
