# HR Report PDF Automation

## Overview
Automates the generation of branded, paginated PDF reports for HR peer reviews. Converts structured JSON data into A4-ready PDFs (one per employee), packages them into a ZIP, and provides both CLI and web UI workflows.

## Features
- Accepts JSON array of employee reviews
- Renders A4 HTML template (one employee per page)
- Exports each page as a PDF file
- Packages all PDFs into a ZIP archive
- CLI and web UI (React) interfaces
- Fully offline, no external network calls

## Installation

**Requirements:**
- Node.js 18+
- npm

**Setup:**
```sh
npm install
cd hr-report
npm install
```

## CLI Usage

Generate reports from JSON:
```sh
node scripts/generate.js --input examples/sample-reviews.json --period 2024-Q2 --out reports
```
- PDFs and ZIP will be saved in the `reports/` directory.

## Web UI Usage

1. Start the dev server:
   ```sh
   cd hr-report
   npm run dev
   ```
2. Open [http://localhost:5173](http://localhost:5173)
3. Paste or upload your JSON, set the period, and download the ZIP.

## Architecture Diagram

```mermaid
graph TD;
  A[JSON Input] --> B[Validation (Zod)]
  B --> C[HTML Rendering (React SSR)]
  C --> D[PDF Generation (Puppeteer)]
  D --> E[ZIP Packaging (archiver)]
  E --> F[Download/Artifact]
```

## Testing
- Run all tests:
  ```sh
  npm test --workspace=hr-report
  ```
- Visual regression: see `scripts/__tests__/visual-regression.test.ts`

## Contributing
- PRs welcome! See `.github/workflows/ci.yml` for CI details.

## License
MIT
