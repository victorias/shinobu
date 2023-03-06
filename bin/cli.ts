#!/usr/bin/env node

import { Command } from "commander";
import { exec } from "child_process";

console.log("Hello, CLI!");

const program = new Command();
program
  .name("shinobu")
  .description("Use AI to write your git commits.")
  .version("1.0.0");

// Commits will already be staged before running pre-commit hook
