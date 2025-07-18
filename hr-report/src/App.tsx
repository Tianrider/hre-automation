import React, { useRef, useState, useEffect } from 'react';
import { EmployeeReportPage } from '@/components/EmployeeReportPage';
import './App.css';
import { validateEmployeeReviewsSafe } from '@/utils/validation';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';

function App() {
  const [imageDebug] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState('');
  const [period, setPeriod] = useState('2024-Q2');
  const [status, setStatus] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const dropRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (employeeData.length === 0) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setCurrentPage((prev) => Math.max(0, prev - 1));
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setCurrentPage((prev) => Math.min(employeeData.length - 1, prev + 1));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [employeeData.length]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setJsonInput((event.target?.result as string) || '');
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setJsonInput((event.target?.result as string) || '');
      };
      reader.readAsText(file);
    }
  };

  const handleGenerate = () => {
    let data;
    try {
      data = JSON.parse(jsonInput);
    } catch (err) {
      setStatus('Invalid JSON format.');
      setEmployeeData([]);
      setCurrentPage(0);
      return;
    }
    const result = validateEmployeeReviewsSafe(data);
    if (!result.success) {
      setStatus('Validation failed: ' + JSON.stringify(result.errors));
      setEmployeeData([]);
      setCurrentPage(0);
    } else {
      setStatus(
        `Valid! ${result.data.length} employee reviews loaded. Each report will be 4 pages. Ready to print or export.`
      );
      setEmployeeData(result.data);
      setCurrentPage(0);
    }
  };

  const generatePDF = async (employee: any, index: number): Promise<Blob> => {
    // A4 dimensions - exact match with HTML
    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;

    // Create a temporary container for the employee report
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = `${A4_WIDTH_MM}mm`;
    container.style.height = 'auto';
    container.style.backgroundColor = 'white';
    container.style.margin = '0';
    container.style.padding = '0';
    container.style.boxSizing = 'border-box';
    // container.style.fontSize = '14px';
    container.style.fontFamily = 'Arial, sans-serif';
    // container.style.lineHeight = '1.4';
    document.body.appendChild(container);

    // Render the employee report
    const root = createRoot(container);
    root.render(
      <EmployeeReportPage
        employee={employee}
        pageNumber={index + 1}
        totalPages={employeeData.length}
        period={period}
      />
    );

    // Wait for rendering to complete
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Find all report pages
    const reportPages = container.querySelectorAll('.report-page');

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Get debug container
    const debugContainer = document.getElementById('debug-canvas-container');

    // Process each page
    for (let pageIndex = 0; pageIndex < reportPages.length; pageIndex++) {
      const pageElement = reportPages[pageIndex] as HTMLElement;

      // Ensure the page element matches exact A4 dimensions
      pageElement.style.width = `${A4_WIDTH_MM}mm`;
      pageElement.style.height = `${A4_HEIGHT_MM}mm`;
      // pageElement.style.margin = '0';
      // pageElement.style.padding = '20mm';
      // pageElement.style.boxSizing = 'border-box';
      // pageElement.style.overflow = 'hidden';
      // pageElement.style.position = 'relative';
      // pageElement.style.backgroundColor = 'white';

      // Convert this page to canvas with exact dimensions
      const canvas = await html2canvas(pageElement, {
        scale: 2, // High resolution for crisp PDF
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: A4_WIDTH_MM * 3.78, // Convert mm to px (96 DPI: 1mm = 3.78px)
        height: A4_HEIGHT_MM * 3.78,
        logging: false,
      });

      // --- DEBUG START ---
      if (debugContainer) {
        const title = document.createElement('h3');
        title.innerText = `Debug Canvas for ${employee.name} - Page ${pageIndex + 1}`;
        title.className = 'mt-4 font-semibold';

        const newCanvas = canvas.cloneNode() as HTMLCanvasElement;
        newCanvas.style.width = '50%';
        newCanvas.style.height = 'auto';
        newCanvas.style.border = '2px solid #e53e3e';
        newCanvas.style.marginTop = '8px';

        debugContainer.appendChild(title);
        debugContainer.appendChild(newCanvas);

        const imgData = canvas.toDataURL('image/png');
        const img = document.createElement('img');
        img.src = imgData;
        img.style.width = '50%';
        img.style.border = '2px solid #38a169';
        img.style.marginTop = '8px';
        debugContainer.appendChild(img);
      }
      // --- DEBUG END ---

      const imgDataForPdf = canvas.toDataURL('image/jpeg', 0.8);

      // Add new page if not the first page
      if (pageIndex > 0) {
        pdf.addPage();
      }

      // Add image at exact A4 size without any scaling
      pdf.addImage(imgDataForPdf, 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
    }

    // Clean up
    document.body.removeChild(container);
    root.unmount();

    return pdf.output('blob');
  };

  const handleExportCurrentPDF = async () => {
    const debugContainer = document.getElementById('debug-canvas-container');
    if (debugContainer) {
      debugContainer.innerHTML = '<h2 class="text-xl font-bold mb-4">Debug Canvas Output</h2>';
    }

    if (employeeData.length === 0) {
      setStatus('No employee data to export.');
      return;
    }

    setIsGenerating(true);
    setStatus('Generating PDF for current employee...');

    try {
      const employee = employeeData[currentPage];
      setStatus(`Generating PDF for ${employee.name}...`);

      const pdfBlob = await generatePDF(employee, currentPage);
      const filename = `${slugify(employee.name)}_${period}.pdf`;

      // Download the PDF
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatus(`Successfully exported ${employee.name}'s 4-page report as PDF.`);
    } catch (error) {
      setStatus(
        'Error generating PDF: ' + (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportZIP = async () => {
    const debugContainer = document.getElementById('debug-canvas-container');
    if (debugContainer) {
      debugContainer.innerHTML = '<h2 class="text-xl font-bold mb-4">Debug Canvas Output</h2>';
    }

    if (employeeData.length === 0) {
      setStatus('No employee data to export.');
      return;
    }

    setIsGenerating(true);
    setStatus('Generating PDFs and creating ZIP file...');

    try {
      const zip = new JSZip();

      // Generate PDF for each employee
      for (let i = 0; i < employeeData.length; i++) {
        const employee = employeeData[i];
        setStatus(`Generating PDF ${i + 1} of ${employeeData.length}: ${employee.name}`);

        const pdfBlob = await generatePDF(employee, i);
        const filename = `${slugify(employee.name)}_${period}.pdf`;
        zip.file(filename, pdfBlob);
      }

      // Generate and download ZIP
      setStatus('Creating ZIP file...');
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hr-reports_${period}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatus(
        `Successfully exported ${employeeData.length} employee reports (4 pages each) as ZIP file.`
      );
    } catch (error) {
      setStatus(
        'Error generating ZIP: ' + (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
      {/* Print styles for page breaks and hiding UI controls */}
      <style>{`
        @media print {
          * { 
            -webkit-print-color-adjust: exact !important; 
            color-adjust: exact !important; 
          }
          .no-print { display: none !important; }
          .report-container { 
            margin: 0 !important; 
            padding: 0 !important; 
            width: 100% !important;
            height: auto !important;
          }
          .report-page { 
            page-break-after: always !important; 
            break-after: page !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 20mm !important;
            box-sizing: border-box !important;
            position: relative !important;
            background: white !important;
            overflow: hidden !important;
          }
          .report-page:last-child {
            page-break-after: avoid !important;
          }
          body { 
            background: white !important; 
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
          }
          .mx-auto { margin: 0 !important; max-width: none !important; }
          .max-w-4xl { max-width: none !important; }
          .space-y-8 > * + * { margin-top: 0 !important; }
          .bg-gray-100 { background: white !important; }
        }
        
        /* Ensure consistent rendering across screen and print */
        .report-page {
          font-size: 14px;
          font-family: Arial, sans-serif;
          line-height: 1.4;
          color: black;
        }
      `}</style>
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Minimal Web UI Section */}
        <section className="rounded-lg bg-white p-6 shadow-lg text-gray-900 no-print">
          <h2 className="mb-6 text-2xl font-bold">Generate HR Reports (Web UI)</h2>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Paste JSON or upload file:</label>
            <div
              ref={dropRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full border-2 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'} rounded p-4 mb-2 text-center cursor-pointer transition-colors`}
              style={{ minHeight: 80 }}
            >
              {dragActive
                ? 'Drop your JSON file here...'
                : 'Drag & drop JSON file here, or use the controls below.'}
            </div>
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={6}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste employee reviews JSON here..."
            />
            <input type="file" accept="application/json" onChange={handleFileUpload} />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Period:</label>
            <input
              className="border rounded p-2"
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="2024-Q2"
            />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleGenerate}
          >
            Render Reports
          </button>
          {status && <div className="mt-4 text-sm text-gray-700">{status}</div>}
        </section>

        {/* Employee Reports with Pagination */}
        {employeeData.length > 0 && (
          <div>
            {/* Pagination Controls */}
            <div className="no-print mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  ← Previous
                </button>
                <span className="text-gray-700 font-medium">
                  Employee {currentPage + 1} of {employeeData.length}
                </span>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={() => setCurrentPage(Math.min(employeeData.length - 1, currentPage + 1))}
                  disabled={currentPage === employeeData.length - 1}
                >
                  Next →
                </button>
                <span className="text-xs text-gray-500">(Use ← → arrow keys)</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gray-600">{employeeData[currentPage]?.name}</span>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={() => window.print()}
                >
                  Print Current Report (4 pages)
                </button>
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                  onClick={handleExportCurrentPDF}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Export Current PDF (4 pages)'}
                </button>
                <button
                  className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
                  onClick={handleExportZIP}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating ZIP...' : 'Export All as ZIP'}
                </button>
              </div>
            </div>

            {/* Current Employee Report */}
            <div className="report-page">
              <EmployeeReportPage
                employee={employeeData[currentPage]}
                pageNumber={currentPage + 1}
                totalPages={employeeData.length}
                period={period}
              />
            </div>
          </div>
        )}
      </div>

      <div id="debug-canvas-container" className="no-print mt-8 p-4 bg-gray-200">
        <h2 className="text-xl font-bold mb-4">Debug Canvas Output</h2>
        {imageDebug && <img src={imageDebug} alt="Debug Image" />}
      </div>
    </div>
  );
}

export default App;

// Add a simple slugify function
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
