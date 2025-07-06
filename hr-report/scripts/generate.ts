#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const archiver = require('archiver');

// Get the absolute path to src directory
const srcDir = path.resolve(__dirname, '../src');

// Import our modules using absolute paths
const { validateEmployeeReviewsSafe } = require(path.join(srcDir, 'utils/validation'));
const { renderHtmlForEmployees, renderEmployeeDocument } = require(path.join(srcDir, 'utils/serverRenderer'));

interface CLIOptions {
  input: string;
  period: string;
  out: string;
}

function formatZodError(error: any): string {
  return error.issues.map((issue: any) => {
    const path = issue.path.length > 0 ? `at ${issue.path.join('.')}` : '';
    return `- ${issue.message} ${path}`;
  }).join('\n');
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

      // Read and parse JSON file
      const jsonContent = fs.readFileSync(options.input, 'utf-8');
      let inputData;
      try {
        inputData = JSON.parse(jsonContent);
      } catch (error) {
        console.error('Error: Invalid JSON file format');
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
      }

      // Validate employee reviews data
      const validationResult = validateEmployeeReviewsSafe(inputData);
      if (!validationResult.success) {
        console.error('Error: Invalid employee reviews data');
        console.error('Validation errors:');
        console.error(formatZodError(validationResult.errors));
        process.exit(1);
      }

      // Validate and create output directory if it doesn't exist
      const outDir = path.resolve(options.out);
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }

      // Generate HTML for all employees
      const html = renderHtmlForEmployees(validationResult.data, options.period);

      // Save debug HTML file
      const debugHtmlPath = path.join(outDir, 'debug.html');
      fs.writeFileSync(debugHtmlPath, html, 'utf-8');

      // --- PDF GENERATION START ---
      const employees = validationResult.data;
      const period = options.period;
      const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
      for (const employee of employees) {
        const employeeHtml = renderEmployeeDocument(employee, { period });
        const page = await browser.newPage();
        await page.setContent(employeeHtml, { waitUntil: 'networkidle0' });
        const filename = `${slugify(employee.name)}_${period}.pdf`;
        const pdfPath = path.join(outDir, filename);
        await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
        await page.close();
        console.log(`Generated PDF: ${pdfPath}`);
      }
      await browser.close();
      // --- PDF GENERATION END ---

      // --- ZIP PACKAGING START ---
      const zipFilename = `hr-reports_${period}.zip`;
      const zipPath = path.join(outDir, zipFilename);
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      const closePromise: Promise<void> = new Promise((resolve, reject) => {
        output.on('close', function () {
          console.log(`Created ZIP archive: ${zipPath} (${archive.pointer()} total bytes)`);
          // Optionally, clean up individual PDFs after zipping
          fs.readdirSync(outDir)
            .filter(f => f.endsWith('.pdf') && f.includes(`_${period}.pdf`))
            .forEach(f => fs.unlinkSync(path.join(outDir, f)));
          resolve();
        });
        archive.on('error', function(err){ reject(err); });
      });

      archive.pipe(output);
      // Add all PDFs for this period
      fs.readdirSync(outDir)
        .filter(f => f.endsWith('.pdf') && f.includes(`_${period}.pdf`))
        .forEach(f => {
          archive.file(path.join(outDir, f), { name: f });
        });
      await archive.finalize();
      await closePromise;
      // --- ZIP PACKAGING END ---

      // Log success
      console.log(`Successfully validated ${validationResult.data.length} employee reviews`);
      console.log('Generated debug HTML file:', debugHtmlPath);
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

// Simple slugify function for filenames
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Generates PDFs for each employee and returns a Promise that resolves to the ZIP file path.
 * Used by both CLI and backend API.
 */
async function generateReportsZip({ inputData, period, outDir }: { inputData: any, period: string, outDir: string }) {
  // Validate employee reviews data
  const validationResult = validateEmployeeReviewsSafe(inputData);
  if (!validationResult.success) {
    const error = new Error('Validation failed: ' + formatZodError(validationResult.errors));
    // @ts-ignore
    error.validation = validationResult.errors;
    throw error;
  }

  // Validate and create output directory if it doesn't exist
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Generate HTML for all employees
  const html = renderHtmlForEmployees(validationResult.data, period);

  // Save debug HTML file
  const debugHtmlPath = path.join(outDir, 'debug.html');
  fs.writeFileSync(debugHtmlPath, html, 'utf-8');

  // --- PDF GENERATION START ---
  const employees = validationResult.data;
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  for (const employee of employees) {
    const employeeHtml = renderEmployeeDocument(employee, { period });
    const page = await browser.newPage();
    await page.setContent(employeeHtml, { waitUntil: 'networkidle0' });
    const filename = `${slugify(employee.name)}_${period}.pdf`;
    const pdfPath = path.join(outDir, filename);
    await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
    await page.close();
  }
  await browser.close();
  // --- PDF GENERATION END ---

  // --- ZIP PACKAGING START ---
  const zipFilename = `hr-reports_${period}.zip`;
  const zipPath = path.join(outDir, zipFilename);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  const closePromise = new Promise<void>((resolve, reject) => {
    output.on('close', function () {
      // Clean up individual PDFs after zipping
      fs.readdirSync(outDir)
        .filter(f => f.endsWith('.pdf') && f.includes(`_${period}.pdf`))
        .forEach(f => fs.unlinkSync(path.join(outDir, f)));
      resolve();
    });
    archive.on('error', function(err){ reject(err); });
  });

  archive.pipe(output);
  // Add all PDFs for this period
  fs.readdirSync(outDir)
    .filter(f => f.endsWith('.pdf') && f.includes(`_${period}.pdf`))
    .forEach(f => {
      archive.file(path.join(outDir, f), { name: f });
    });
  await archive.finalize();
  await closePromise;
  // --- ZIP PACKAGING END ---

  return zipPath;
}

module.exports.generateReportsZip = generateReportsZip; 