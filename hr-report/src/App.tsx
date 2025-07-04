import React, { useRef, useState } from 'react'
import { Star } from '@/components/Star'
import { RatingRow } from '@/components/RatingRow'
import { EmployeeReportPage } from '@/components/EmployeeReportPage'
import { sampleEmployee } from '@/data/sample'
import './App.css'
import { validateEmployeeReviewsSafe } from '@/utils/validation'
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function App() {
  const [rating, setRating] = useState(3)
  const [jsonInput, setJsonInput] = useState('');
  const [period, setPeriod] = useState('2024-Q2');
  const [status, setStatus] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setJsonInput(event.target?.result as string || '');
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
        setJsonInput(event.target?.result as string || '');
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
      return;
    }
    const result = validateEmployeeReviewsSafe(data);
    if (!result.success) {
      setStatus('Validation failed: ' + JSON.stringify(result.errors));
      setEmployeeData([]);
    } else {
      setStatus(`Valid! ${result.data.length} employee reviews loaded. Ready to print.`);
      setEmployeeData(result.data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
      {/* Print styles for page breaks and hiding UI controls */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .report-page { page-break-after: always; break-after: page; }
          body { background: white !important; }
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
              {dragActive ? 'Drop your JSON file here...' : 'Drag & drop JSON file here, or use the controls below.'}
            </div>
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={6}
              value={jsonInput}
              onChange={e => setJsonInput(e.target.value)}
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
              onChange={e => setPeriod(e.target.value)}
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

        {/* Print Button (only shown if data is loaded) */}
        {employeeData.length > 0 && (
          <div className="no-print mb-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => window.print()}
            >
              Print or Save as PDF
            </button>
            <span className="ml-4 text-gray-600">Use your browser's print dialog to save as PDF.</span>
          </div>
        )}

        {/* Render all employee reports for printing */}
        {employeeData.length > 0 && (
          <div>
            {employeeData.map((employee, idx) => (
              <div className="report-page" key={employee.name + idx}>
                <EmployeeReportPage
                  employee={employee}
                  pageNumber={idx + 1}
                  totalPages={employeeData.length}
                  period={period}
                />
              </div>
            ))}
          </div>
        )}

        {/* Component Preview Section */}
        <section className="rounded-lg bg-white p-6 shadow-lg text-gray-900">
          <h2 className="mb-6 text-2xl font-bold">Component Preview</h2>
          
          {/* Star Component */}
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold">Star Component</h3>
            <div className="flex gap-4">
              <Star filled={true} size={32} />
              <Star filled={false} size={32} />
            </div>
          </div>

          {/* Rating Row Component */}
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold">Rating Row Component</h3>
            <div className="w-96">
              <RatingRow
                label="Test Rating"
                rating={rating}
              />
              <div className="mt-2">
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Full Page Preview */}
        <section className="rounded-lg bg-white p-6 shadow-lg text-gray-900">
          <h2 className="mb-6 text-2xl font-bold">Full Page Preview</h2>
          <p className="mb-4 text-gray-600">
            Below is a preview of the complete employee report page. Use browser print preview
            (Ctrl/Cmd + P) to see the exact PDF output.
          </p>
          <div className="scale-[0.7] origin-top-left">
            <EmployeeReportPage
              employee={sampleEmployee}
              pageNumber={1}
              totalPages={1}
              period="2024-Q1"
            />
          </div>
        </section>
      </div>
    </div>
  )
}

export default App

// Add a simple slugify function
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
