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
    }
  </style>
</head>
<body>
  <div class="report-page">
    ${html}
  </div>
</body>
</html>`;
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
  const componentHtml = renderEmployeePage(employee, options);
  return wrapWithDocumentTemplate(componentHtml);
} 