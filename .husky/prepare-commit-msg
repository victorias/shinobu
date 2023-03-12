#!/usr/bin/env node

const { exec } = require("child_process");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

function prepareCommitMessage() {
  const commitMsgFile = process.argv[2];

  // NOTE: Commits will already be staged before running prepare-commit-message hook
  // Run git diff command and capture output in a variable

  const excludes = [
    "package-lock.json",
    "pnpm-lock.yaml",
    "*.lock",
    ".DS-Store",
  ].map((file) => `:(exclude)${file}`);

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  exec(
    `git diff --staged -- '${excludes.join(` `)}'`,
    async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing git diff: ${error}`);
        return;
      }

      const gitDiff = stdout;

      try {
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a git commit message bot. You write helpful, concise git commits based on inputted diffs. Focus primarily on what the code does and what changes have been made in the code. Put less priority on developer comments and package installations. The format of your response should be a first summary line of max 50 characters. Subsequent lines should be less than 72 characters. Do not preface the message with anything. Write the message in present tense.",
            },
            {
              role: "user",
              content: gitDiff,
            },
          ],
        });
        fs.writeFileSync(
          commitMsgFile,
          completion.data.choices[0].message.content
        );
      } catch (error) {
        console.error(`Error creating completion: ${error}`);
      }
    }
  );
}

prepareCommitMessage();
