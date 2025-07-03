import { renderToString } from 'react-dom/server';
import type { EmployeeReview } from '@/types/employee';
import { EmployeeReportPage } from '@/components/EmployeeReportPage';

interface RenderOptions {
  period: string;
  pageNumber?: number;
  totalPages?: number;
}

/**
 * Renders an employee report page to static HTML markup
 * @param employee The employee review data to render
 * @param options Rendering options including period and page numbers
 * @returns HTML string of the rendered page
 */
export function renderEmployeePage(
  employee: EmployeeReview,
  { period, pageNumber = 1, totalPages = 1 }: RenderOptions
): string {
  return renderToString(
    <EmployeeReportPage
      employee={employee}
      period={period}
      pageNumber={pageNumber}
      totalPages={totalPages}
    />
  );
}

/**
 * Wraps the rendered HTML in necessary document structure
 * @param html The rendered component HTML
 * @returns Complete HTML document string
 */
export function wrapWithDocumentTemplate(html: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Employee Review Report</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    @media print {
      body {
        margin: 0;
      }
      .report-page {
        page-break-after: always;
      }
      /* Remove page break after the last page */
      .report-page:last-child {
        page-break-after: avoid;
      }
    }
    /* Base styles for consistent rendering */
    body {
      background: white;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .report-page {
      width: 210mm;
      min-height: 297mm;
      padding: 15mm;
      box-sizing: border-box;
      background: white;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
}

/**
 * Renders multiple employee reviews into a single HTML document
 * @param employees Array of employee review data
 * @param period The review period (e.g., "2024-Q1")
 * @returns Complete HTML document string with all employee pages
 */
export function renderHtmlForEmployees(
  employees: EmployeeReview[],
  period: string
): string {
  const totalPages = employees.length;
  
  const pagesHtml = employees
    .map((employee, index) => {
      const pageHtml = renderEmployeePage(employee, {
        period,
        pageNumber: index + 1,
        totalPages
      });
      
      return `<div class="report-page">${pageHtml}</div>`;
    })
    .join('\n');

  return wrapWithDocumentTemplate(pagesHtml);
}

/**
 * Renders an employee review to a complete HTML document
 * @param employee The employee review data
 * @param options Rendering options
 * @returns Complete HTML document string
 */
export function renderEmployeeDocument(
  employee: EmployeeReview,
  options: RenderOptions
): string {
  const pageHtml = renderEmployeePage(employee, options);
  return wrapWithDocumentTemplate(`<div class="report-page">${pageHtml}</div>`);
} 