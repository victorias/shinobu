#!/usr/bin/env node

import { Command } from "commander";
import { exec } from "child_process";
import dotenv from "dotenv";
import path from "path";

console.log("Hello, CLI!");

const program = new Command();
program
  .name("shinobu")
  .description("Use AI to write your git commits.")
  .version("1.0.0");

// Load environment variables from .env.local file
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// Get the open_ai_key variable from the environment
const openAiKey = process.env.OPENAI_SECRET_KEY;

if (!openAiKey) {
  console.error(
    `Error: No Open AI Secret Key found. Have you setup .env.local OPENAI_SECRET_KEY?`
  );
}

// NOTE: Commits will already be staged before running pre-commit hook
// Run git diff command and capture output in a variable

const excludes = ["package-lock.json", "pnpm-lock.yaml", "*.lock"].map(
  (file) => `:(exclude)${file}`
);

exec(
  `git diff --staged -- '${excludes.join(` `)}'`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing git diff: ${error}`);
      return;
    }

    const gitDiff = stdout;

    console.log(gitDiff);
  }
);
