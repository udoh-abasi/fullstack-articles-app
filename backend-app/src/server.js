import "dotenv/config";
import express from "express";
import { db, connectToDb } from "./db.js";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const mycredential = JSON.parse(fs.readFileSync("./fullstack-auth.json"));

admin.initializeApp({
  credential: admin.credential.cert(mycredential),
});

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(express.static(path.join(__dirname, "../build")));

app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.use(async (req, res, next) => {
  const { authtoken } = req.headers;
  if (authtoken) {
    try {
      req.user = await admin.auth().verifyIdToken(authtoken);
    } catch (e) {
      return res.sendStatus(401);
    }
  }

  req.user = req.user || {};

  next();
});

app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const theArticle = await db
    .collection("articles")
    .findOne({ articleName: name });

  if (theArticle) {
    const allUpvoteIDs = theArticle.allUpvoteIDs || [];
    theArticle.canUpvote = !allUpvoteIDs.includes(uid);

    res.json(theArticle);
  } else {
    res.sendStatus(400);
  }
});

app.use((req, res, next) => {
  if (req.user && req.user !== {}) {
    next();
  } else {
    res.sendStatus(403);
  }
});

app.put(`/api/articles/:name/upvotes`, async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;
  const theArticle = await db
    .collection("articles")
    .findOne({ articleName: name });

  if (theArticle) {
    const allUpvoteIDs = theArticle.allUpvoteIDs || [];
    const canUpvote = !allUpvoteIDs.includes(uid);

    if (canUpvote) {
      await db.collection("articles").updateOne(
        { articleName: name },
        {
          $inc: { upvote: 1 },
          $push: { allUpvoteIDs: uid },
        }
      );

      const updatedArticle = await db
        .collection("articles")
        .findOne({ articleName: name });

      res.json(updatedArticle);
    } else {
      res.json(theArticle);
    }
  } else {
    res.sendStatus(400);
  }
});

app.put(`/api/articles/:name/removeUpvotes`, async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const theArticle = await db
    .collection("articles")
    .findOne({ articleName: name });

  const canNotUpvote = theArticle.allUpvoteIDs.includes(uid);
  console.log(canNotUpvote);

  if (canNotUpvote) {
    await db.collection("articles").updateOne(
      { articleName: name },
      {
        $pullAll: { allUpvoteIDs: [uid] },
        $inc: { upvote: -1 },
      }
    );

    const updatedArticle = await db
      .collection("articles")
      .findOne({ articleName: name });
    if (updatedArticle) {
      console.log(updatedArticle);
      updatedArticle.canUpvote = true;
      res.json(updatedArticle);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post(`/api/articles/:name/comments`, async (req, res) => {
  const { name } = req.params;
  const { text } = req.body;
  const { email, uid } = req.user;

  const theArticle = await db
    .collection("articles")
    .findOne({ articleName: name });

  if (theArticle) {
    await db.collection("articles").updateOne(
      { articleName: name },
      {
        $push: { comment: { postedBy: email, text } },
        // $set: { comment: [] },
      }
    );

    const updatedArticle = await db
      .collection("articles")
      .findOne({ articleName: name });

    const allUpvoteIDs = updatedArticle.allUpvoteIDs || [];
    updatedArticle.canUpvote = !allUpvoteIDs.includes(uid);

    res.json(updatedArticle);
  } else {
    res.sendStatus(400);
  }
});

app.post(`/api/articles/:name/deleteComment`, async (req, res) => {
  const { name } = req.params;
  const { text } = req.body;
  const { email, uid } = req.user;

  await db.collection("articles").updateOne(
    { articleName: name },
    {
      $pull: { comment: { postedBy: email, text } },
    }
  );

  const theArticle = await db
    .collection("articles")
    .findOne({ articleName: name });

  if (theArticle) {
    const allUpvoteIDs = theArticle.allUpvoteIDs || [];
    theArticle.canUpvote = !allUpvoteIDs.includes(uid);

    res.json(theArticle);
  }
});

const PORT = process.env.PORT || 8000;

connectToDb(() => {
  app.listen(PORT, () => {
    console.log("Server is listening on port", PORT);
  });
});
