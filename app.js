const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Connected to MongoDB");

    app.locals.db = client.db(DB_NAME);

    app.use("/api/books", bookRoutes);
    app.use("/api/authors", authorRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

startServer();