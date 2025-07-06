import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import Poppler from 'pdf-poppler';

describe('Visual regression', () => {
  const sampleInput = path.resolve(__dirname, '../../examples/sample-reviews.json');
  const outDir = path.resolve(__dirname, '../../reports');
  const period = '2024-Q2';
  const pdfName = `john-doe_${period}.pdf`;
  const pdfPath = path.join(outDir, pdfName);
  const baselinePng = path.resolve(__dirname, '../../tests/baseline/john-doe_2024-Q2.png');
  const outputPng = path.join(outDir, 'john-doe_2024-Q2.png');

  beforeAll(() => {
    // Clean up previous outputs
    if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    if (fs.existsSync(outputPng)) fs.unlinkSync(outputPng);
  });

  it('matches the baseline PNG within 1% diff', async () => {
    // Run the CLI to generate PDF
    execSync(`node ../generate.js --input ${sampleInput} --period ${period} --out ${outDir}`, {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
    });
    expect(fs.existsSync(pdfPath)).toBe(true);
    // Convert PDF to PNG (first page)
    await Poppler.convert(pdfPath, {
      format: 'png',
      out_dir: outDir,
      out_prefix: 'john-doe_2024-Q2',
      page: 1,
      singleFile: true,
    });
    expect(fs.existsSync(outputPng)).toBe(true);
    // Compare with baseline
    const img1 = PNG.sync.read(fs.readFileSync(baselinePng));
    const img2 = PNG.sync.read(fs.readFileSync(outputPng));
    const { width, height } = img1;
    const diff = new PNG({ width, height });
    const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
    const percentDiff = numDiffPixels / (width * height);
    expect(percentDiff).toBeLessThanOrEqual(0.01);
  });
}); 