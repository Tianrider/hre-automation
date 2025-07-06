import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

describe('generate CLI integration', () => {
  const sampleInput = path.resolve(__dirname, '../../examples/sample-reviews.json');
  const outDir = path.resolve(__dirname, '../../reports');
  const period = '2024-Q2';
  const zipName = `hr-reports_${period}.zip`;
  const zipPath = path.join(outDir, zipName);

  beforeAll(() => {
    // Clean up any previous output
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
  });

  it('generates a ZIP with one PDF per employee', async () => {
    // Run the CLI
    execSync(`node ../generate.js --input ${sampleInput} --period ${period} --out ${outDir}`, {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
    });
    // Check ZIP exists
    expect(fs.existsSync(zipPath)).toBe(true);
    // Read ZIP and check file count
    const zipData = fs.readFileSync(zipPath);
    const zip = await JSZip.loadAsync(zipData);
    const files = Object.keys(zip.files).filter(f => f.endsWith('.pdf'));
    // Read sample input to get expected count
    const sample = JSON.parse(fs.readFileSync(sampleInput, 'utf-8'));
    expect(files.length).toBe(sample.length);
  });
}); 