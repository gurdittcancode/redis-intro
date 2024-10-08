import express from "express";
import { createClient } from "redis";

const client = createClient();
const app = express();
app.use(express.json());

app.post("/submit", async function (req, res) {
  const { problemId, userId, code, language } = req.body;
  // push this to a database (prisma.submission.create())
  try {
    await client.LPUSH(
      "submissions",
      JSON.stringify({ problemId, userId, code, language }),
    );

    res.status(200).json({
      msg: "submission received",
    });
  } catch (error) {
    console.log("Redis error: ", error);
    res.status(500).send("Failed to store submission");
  }
});

async function start() {
  try {
    await client.connect();
    console.log("Connected to redis");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Something went wrong...", error);
  }
}

start();
