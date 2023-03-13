import { MongoClient } from "mongodb";

let db;

const connectToDb = async (listener) => {
  const client = new MongoClient(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.mxtrpwj.mongodb.net/?retryWrites=true&w=majority`
  );
  await client.connect();

  db = client.db("fullstack-db");

  listener();
};

export { db, connectToDb };
