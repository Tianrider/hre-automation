# PRD: Automated PDF Generation for Human Resource Peer-Review Reports

## 1. Introduction / Overview

This document defines the requirements for building an automated system that converts structured peer-review data into paginated PDF reports. Each report page will summarise an individual employee's performance, displaying six 1-to-6 star ratings and free-text feedback collected from team-mates. The system ingests a simple JSON array, renders it into an HTML template (one employee per page), and exports every page as a separate, print-ready PDF file.

This project will streamline HR's quarterly review workflow by eliminating manual design work in Google Docs and reducing report preparation time from hours to minutes.

## 2. Goals

-   Accept a JSON payload describing multiple employee reviews.
-   Render a visually consistent, A4-sized HTML template for each employee, including:
    -   Employee name.
    -   Six performance categories with star ratings (1–6).
    -   Free-text "Kesan & Pesan" comments list.
-   Paginate the HTML automatically so that **exactly one employee appears per page** when printed.
-   Export each page to an individual PDF file named `<employeeName>_<yyyy-mm>.pdf`.
-   Package all generated PDFs into a single ZIP archive for download.

## 3. User Stories

-   **As an HR analyst,** I want to upload or paste review data and instantly obtain branded PDF files for each employee so that I can share results without further formatting.
-   **As a team lead,** I want a clear, single-page summary of each direct report's ratings and comments so that I can discuss performance efficiently.
-   **As a designer,** I want assurance that typography, spacing, and branding remain consistent across hundreds of reports, so that the documents look professional without manual QA.

## 4. Functional Requirements

### 4.1. Data Ingestion

1. The system shall accept an array of JSON objects with the following shape:
    ```json
    {
    	"name": "John Doe",
    	"ratings": {
    		"tanggungJawab": 4,
    		"kerjaSama": 5,
    		"komunikasi": 4,
    		"pekaDanInisiatif": 4,
    		"kedekatan": 3,
    		"profesional": 5
    	},
    	"comment": [
    		"John consistently shows great responsibility and teamwork.",
    		"Always willing to help others when needed."
    	]
    }
    ```
2. Input validation shall reject payloads lacking required fields or with rating values outside 1-6.

### 4.2. HTML Template Rendering

1. A responsive, print-optimised HTML template shall be created (CSS `@media print`) sized to A4 (210 × 297 mm) with 15 mm margins.
2. The template shall map `ratings` keys to **six labelled rows** in Bahasa Indonesia:
    - Tanggung Jawab
    - Kerja Sama
    - Komunikasi
    - Peka dan Inisiatif
    - Kedekatan
    - Profesional
3. Each rating is visualised by filled and empty star SVG icons (max 6 per row).
4. Comments are rendered as a bulleted list beneath the ratings section.
5. The company logo and report period (quarter & year) appear in the header; page number appears in the footer.
6. Page-break rules (`page-break-after: always;`) ensure exactly one employee per printed page.

### 4.3. PDF Generation

1. The system shall convert the rendered HTML into PDF using a headless browser engine (e.g. Puppeteer or Playwright) to preserve CSS fidelity.
2. Each employee page shall be exported to a **separate** PDF file.
3. File names follow the pattern `<nameSlug>_<period>.pdf` where `nameSlug` is kebab-cased.
4. All PDFs are compressed into a single ZIP archive returned to the user.

### 4.4. Delivery Mechanism

1. Provide a CLI command (`generate-hr-report <input.json> --period 2024-Q2 --out ./reports`) **or**
2. A lightweight web interface where users can paste JSON or upload a file and download the ZIP.
3. The system shall run offline without external network calls to meet data-privacy requirements.

## 5. Non-Goals (Out of Scope)

-   No database persistence; data is processed in-memory only.
-   No authentication or user management.
-   No editing of individual PDF content after generation within the tool.
-   No aggregation PDF (multi-page combined file); requirement is one PDF per employee.

## 6. Design Considerations

-   Use vector SVG stars to ensure crisp rendering at any DPI.
-   Choose web-safe fonts (e.g. Inter, Roboto) embedded in the PDF to avoid substitution.
-   RTL language support is not required for this phase.
-   Maintain colour palette compliance with corporate branding guidelines.

## 7. Technical Considerations

-   **Language / Runtime:** Node.js 18+.
-   **Template Engine:** React + Vite + `@react-email/components` **or** Handlebars; must support server-side rendering to static HTML.
-   **PDF Engine:** Puppeteer (`page.pdf()`) with `printBackground: true`, `format: 'A4'`, and a 0 margin to rely on template CSS.
-   **Packaging:** `archiver` npm package for ZIP creation.
-   **CI:** GitHub Actions workflow to run lint, unit tests (rating renderer, filename slugifier) and a sample PDF generation check.
-   **Dependencies security:** Use `npm audit` on every pull request.

## 8. Success Metrics

-   Generation time ≤ 500 ms per employee on a 4-core machine.
-   Visual regression tests (Pixelmatch) show **≤ 1 % diff** between template baseline and 100 generated samples.
-   0 validation errors when sample JSON with 50 employees is processed.
-   HR team reports ≥ 80 % reduction in manual formatting time compared with previous process.

## 9. Open Questions – Resolved

1. **Six vs. five-star scale?** The business confirmed a 6-star maximum better reflects existing KPI documents.
2. **Combined PDF download?** Out of scope; individual PDFs packaged in ZIP meet archival needs.
3. **Watermark?** Not required because reports are internal-only.

# Implementation

## Relevant Files

-   `package.json` – NPM dependencies, scripts (build, lint, generate).
-   `vite.config.ts` – Vite build & plugin configuration.
-   `tailwind.config.cjs` – Tailwind theme and plugin setup.
-   `postcss.config.cjs` – PostCSS pipeline for Tailwind & Autoprefixer.
-   `src/index.css` – Global styles importing Tailwind layers.
-   `src/main.tsx` – Vite React entry point.
-   `src/components/Star.tsx` – SVG star icon component.
-   `src/components/RatingRow.tsx` – Row showing label + star group.
-   `src/components/EmployeeReportPage.tsx` – One-page employee report template.
-   `src/utils/slugify.ts` – Converts names to safe file names.
-   `src/utils/validation.ts` – Zod schema to validate input JSON.
-   `scripts/generate.ts` – CLI entry: reads JSON, renders React ➜ HTML, calls Puppeteer.
-   `tests/**` – Jest unit + integration suite (render, slugify, PDF generation).

## Tasks

### 1.0 Project Scaffolding & Tooling

-   [x] **1.1 Init repo:** `npm create vite@latest hr-report -- --template react-ts`;
        add project to GitHub.
-   [x] **1.2 Tailwind setup:** `npm i -D tailwindcss postcss autoprefixer` then `npx tailwindcss init -p`; configure `content` paths and extend colours/fonts.
-   [x] **1.3 Linting & formatting:** Install `eslint`, `@typescript-eslint/*`, `eslint-plugin-react`, `prettier`, `eslint-config-prettier`, `eslint-plugin-tailwindcss`; add `.eslintrc.cjs` and `.prettierrc`.
-   [x] **1.4 Commit hooks:** Configure Husky + lint-staged to run `eslint --fix` & `prettier --write` pre-commit.
-   [x] **1.5 Path aliases:** Update `tsconfig.json` + `vite.config.ts` to support `@/` alias.

### 2.0 UI Template & Styling

-   [x] **2.1 Star icon (`<Star />`):** Reusable SVG component with `filled` & `size` props.
-   [x] **2.2 Rating row (`<RatingRow />`):** Accepts label + 1-6 rating, renders star set.
-   [x] **2.3 Employee page (`<EmployeeReportPage />`):** Uses Tailwind for A4 sizing, margins, logo header, page number footer, and `break-after-page` utility (Tailwind v3.3) to force pagination.
-   [x] **2.4 Print styles:** Add `@media print` in `index.css` to hide non-print UI and ensure exact dimensions.
-   [x] **2.5 Sample story:** Add Storybook (optional) or Vite preview route to review component visually.

### 3.0 Data Types & Validation

-   [x] **3.1 Define `EmployeeReview` TypeScript interface** in `src/types.d.ts`.
-   [x] **3.2 Implement Zod schema** (`utils/validation.ts`) for runtime validation and convert to TS type via `zod`.
-   [x] **3.3 Write unit tests** to verify invalid payloads are rejected.

### 4.0 Server-Side HTML Rendering

-   [x] **4.1 Install `react-dom/server`** and helper to render `<EmployeeReportPage />` to static markup.
-   [x] **4.2 Build `renderHtmlForEmployees()`** utility that wraps each rendered page in `<div class="report-page">` and inserts class `break-after-page`.
-   [x] **4.3 Inline Tailwind styles for print** using `@tailwindcss/typography` plugin or `@mui/tailwindcss-ssr` if needed to capture critical CSS.

### 5.0 CLI Tool (`scripts/generate.ts`)

-   [x] **5.1 Parse CLI flags** with `commander`: `--input`, `--period`, `--out`.
-   [x] **5.2 Read & validate JSON** via Zod; show pretty error list on failure.
-   [x] **5.3 Call HTML renderer** and save intermediate HTML file for debug (`reports/debug.html`).

### 6.0 PDF Export & ZIP Packaging

-   [x] **6.1 Install Puppeteer** and launch with `--no-sandbox` for CI compatibility.
-   [x] **6.2 Loop employees**: `page.setContent(html)`; `page.pdf({ format: 'A4', printBackground: true })`.
-   [x] **6.3 Filename convention**: kebab-case employee name + period.
-   [x] **6.4 Use `archiver`** to stream all PDFs into `hr-reports_<period>.zip`.

### 7.0 Web UI (Optional but recommended)

-   [x] **7.1 Set up minimal React page** under `/` with textarea / file-upload for JSON and Download button.
-   [x] **7.2 Use `FileSaver.js`** to trigger ZIP download in browser.
-   [x] **7.3 Add drag-and-drop area & progress bar** for UX polish.

### 8.0 Testing Strategy

-   [x] **8.1 Unit tests**: slugify, star component renders correct number of stars.
-   [x] **8.2 Integration test**: run full CLI on sample `input.json`, assert ZIP exists & contains correct file count.
-   [ ] **8.3 Visual regression**: Generate PDF, rasterise first page (Ghostscript or pdf-to-png) and compare with baseline using `pixelmatch`.

### 9.0 Continuous Integration (GitHub Actions)

-   [ ] **9.1 Workflow**: install deps, run `npm run lint`, `npm test`, execute sample generation (Puppeteer headless) and upload ZIP as artefact.
-   [ ] **9.2 Cache node_modules** with `actions/cache`.
-   [ ] **9.3 Dependabot** for monthly dependency bumps.

### 10.0 Documentation & Samples

-   [ ] **10.1 README.md**: installation, CLI/web usage examples, architecture diagram.
-   [ ] **10.2 Sample data**: `examples/sample-reviews.json` with 3-5 employees.
-   [ ] **10.3 Changelog & versioning**: follow Conventional Commits; automate release notes with `semantic-release`.
