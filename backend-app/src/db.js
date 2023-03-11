import { MongoClient } from "mongodb";

let db;

const connectToDb = async (listener) => {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  await client.connect();

  db = client.db("fullstack-db");

  listener();
};

export { db, connectToDb };
