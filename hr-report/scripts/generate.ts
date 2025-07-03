#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const fs = require('fs');

interface CLIOptions {
  input: string;
  period: string;
  out: string;
}

const program = new Command();

program
  .name('generate-hr-report')
  .description('Generate HR report PDFs from JSON input')
  .version('1.0.0')
  .requiredOption('-i, --input <path>', 'Input JSON file path')
  .requiredOption('-p, --period <period>', 'Report period (e.g., 2024-Q2)')
  .option('-o, --out <directory>', 'Output directory for reports', './reports')
  .action(async (options: CLIOptions) => {
    try {
      // Validate input file exists
      if (!fs.existsSync(options.input)) {
        console.error(`Error: Input file "${options.input}" does not exist`);
        process.exit(1);
      }

      // Validate and create output directory if it doesn't exist
      const outDir = path.resolve(options.out);
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }

      // TODO: Implement report generation logic in future tasks
      console.log('CLI Options:', {
        input: path.resolve(options.input),
        period: options.period,
        outDir
      });

    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse(); 