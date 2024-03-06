const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;

app.use(
  cors({
    origin: [
      "https://akashmedia.net",
      "https://www.akashmedia.net",
      "http://akashmedia.net",
      "http://www.akashmedia.net",
      "https://akash-media.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@media-max-cluster.yrng6ax.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db('akash-media');
    const channelCollection = database.collection('channels');
    const bannerCollection = database.collection('banners');
    
    // Channels API
    app.get("/channels", async(req, res) => {
      let filter;
      if (req.query?.search) {
        filter = {
          $or: [
            { name: {$regex: req.query?.search, $options: "i"} },
            { displayName: {$regex: req.query?.search, $options: "i"} }
          ]
        };
      }
      const result = await channelCollection.find(filter).toArray();
      res.send(result);
    })

    // Banners API
    app.get("/banners", async(req, res) => {
      const result = await bannerCollection.find().toArray();
      res.send(result);
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Akash Media's Server!");
});
app.listen(port);

module.exports = app;