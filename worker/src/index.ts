import { createClient } from "redis";

const client = createClient();

// @ts-ignore
async function processSubmission(submission) {
  const { problemId, language, userId, code } = JSON.parse(submission);
  console.log(`Processing submission for problemId ${problemId}...`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);

  // run the user's code and get output (run in docker!)

  await new Promise((res) => setTimeout(res, 1000));
  console.log(`processed user: ${userId}'s submission!`);
}

async function startWorker() {
  try {
    await client.connect();
    console.log("Worker connected to redis");
    // main logic
    while (true) {
      const submission = await client.BRPOP("submissions", 0);
      console.log(submission);
      await processSubmission(submission.element);
    }
  } catch (error) {
    console.error("Error in processing submission", error);
  }
}

startWorker();
