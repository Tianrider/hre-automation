import fs from 'fs';
import path from 'path';

/**
 * Gets the critical CSS needed for the employee report pages
 * This includes Tailwind's base styles and our custom print styles
 */
export function getCriticalCss(): string {
  // Read the compiled CSS file from the build output
  const cssPath = path.resolve(__dirname, '../../dist/assets/index.css');
  
  try {
    if (fs.existsSync(cssPath)) {
      return fs.readFileSync(cssPath, 'utf8');
    }
    
    // If the build CSS isn't available, return essential print styles
    return `
      /* Essential print styles */
      @page {
        size: A4;
        margin: 15mm;
      }
      
      @media print {
        body {
          margin: 0;
          background: white;
          color: black;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .report-page {
          width: 210mm;
          min-height: 297mm;
          padding: 15mm;
          box-sizing: border-box;
          page-break-after: always;
          background: white;
        }
        
        .report-page:last-child {
          page-break-after: avoid;
        }
      }
      
      /* Essential layout styles */
      .mb-8 { margin-bottom: 2rem; }
      .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
      .font-bold { font-weight: 700; }
      .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
      .font-medium { font-weight: 500; }
      .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
      .text-gray-600 { color: rgb(75 85 99); }
      .text-2xl { font-size: 1.5rem; line-height: 2rem; }
      .rounded-lg { border-radius: 0.5rem; }
      .border { border-width: 1px; }
      .border-gray-200 { border-color: rgb(229 231 235); }
      .bg-gray-50 { background-color: rgb(249 250 251); }
      .p-6 { padding: 1.5rem; }
      .space-y-2 > * + * { margin-top: 0.5rem; }
      .text-gray-700 { color: rgb(55 65 81); }
      .absolute { position: absolute; }
      .bottom-\[15mm\] { bottom: 15mm; }
      .right-\[15mm\] { right: 15mm; }
      .text-gray-500 { color: rgb(107 114 128); }
      
      /* Flex utilities */
      .flex { display: flex; }
      .items-center { align-items: center; }
      .justify-between { justify-content: space-between; }
      
      /* List styles */
      .list-inside { list-style-position: inside; }
      .list-disc { list-style-type: disc; }
    `;
  } catch (error) {
    console.warn('Failed to load critical CSS:', error);
    return '';
  }
} 