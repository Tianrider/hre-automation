import React from 'react';
import { RatingRow } from './RatingRow';
import type { EmployeeReview } from '../types/employee';
import coverImage from '../assets/cover.png';

interface EmployeeReportPageProps {
  employee: EmployeeReview;
  pageNumber: number;
  totalPages: number;
  period: string;
}

const RATING_LABELS = {
  tanggungJawab: 'Tanggung Jawab',
  kerjaSama: 'Kerja Sama',
  komunikasi: 'Komunikasi',
  pekaDanInisiatif: 'Peka dan Inisiatif',
  kedekatan: 'Kedekatan',
  profesional: 'Profesional',
} as const;

export const EmployeeReportPage: React.FC<EmployeeReportPageProps> = ({
  employee,
  pageNumber,
  totalPages,
  period,
}) => {
  const ratingEntries = Object.entries(RATING_LABELS) as [keyof typeof RATING_LABELS, string][];
  const firstHalfRatings = ratingEntries.slice(0, 3);
  const secondHalfRatings = ratingEntries.slice(3);

  return (
    <div
      className="report-container"
      style={{ margin: 0, padding: 0, width: '210mm', height: 'auto' }}
    >
      {/* PAGE 1: Header and Employee Information */}
      <div
        className="report-page bg-white text-black"
        style={{
          width: '210mm',
          height: '297mm',
          padding: '20mm',
          boxSizing: 'border-box',
          pageBreakAfter: 'always',
          backgroundImage: `url(${coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Header with Logo */}
        <header className="mb-8 flex items-center justify-between">
          <div className="text-xl font-bold">Company Logo</div>
          <div className="text-right">
            <h2 className="text-lg font-medium">Performance Review</h2>
            <p className="text-sm text-gray-600">{period}</p>
          </div>
        </header>

        {/* Employee Name */}
        <h1 className="mb-8 text-3xl font-bold text-center">{employee.name}</h1>

        {/* Page 1 Content */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Employee Information</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-lg">
                <strong>Employee:</strong> {employee.name}
              </p>
              <p className="text-lg">
                <strong>Review Period:</strong> {period}
              </p>
              <p className="text-lg">
                <strong>Report:</strong> Page {pageNumber} of {totalPages}
              </p>
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Performance Review Overview</h2>
          <p className="text-gray-700 leading-relaxed">
            This comprehensive performance review evaluates {employee.name}'s contributions and
            performance across multiple key competency areas during the {period} period. The
            assessment covers professional skills, teamwork, communication, and overall workplace
            effectiveness.
          </p>
        </div>

        {/* Page Footer */}
        <div
          className="text-center text-sm text-gray-500 mt-auto"
          style={{ position: 'absolute', bottom: '15mm', left: '20mm', right: '20mm' }}
        >
          Page 1 of 4 - {employee.name} Performance Review
        </div>
      </div>

      {/* PAGE 2: First Half of Ratings */}
      <div
        className="report-page bg-white text-black"
        style={{
          width: '210mm',
          height: '297mm',
          padding: '20mm',
          boxSizing: 'border-box',
          pageBreakAfter: 'always',
        }}
      >
        {/* Page Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="text-xl font-bold">Company Logo</div>
          <div className="text-right">
            <h2 className="text-lg font-medium">Performance Review - Page 2</h2>
            <p className="text-sm text-gray-600">
              {employee.name} | {period}
            </p>
          </div>
        </header>

        <h2 className="text-2xl font-semibold mb-8">Core Competencies (Part 1)</h2>

        {/* First Half Ratings */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
          {firstHalfRatings.map(([key, label]) => (
            <RatingRow key={key} label={label} rating={employee.ratings[key]} />
          ))}
        </div>

        {/* Additional Analysis */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Performance Analysis</h3>
          <p className="text-gray-700 leading-relaxed">
            The first set of competencies demonstrates {employee.name}'s foundational professional
            skills. These ratings reflect consistent performance in key areas that form the backbone
            of effective workplace contribution.
          </p>
        </div>

        {/* Page Footer */}
        <div
          className="text-center text-sm text-gray-500 mt-auto"
          style={{ position: 'absolute', bottom: '15mm', left: '20mm', right: '20mm' }}
        >
          Page 2 of 4 - {employee.name} Performance Review
        </div>
      </div>

      {/* PAGE 3: Second Half of Ratings */}
      <div
        className="report-page bg-white text-black"
        style={{
          width: '210mm',
          height: '297mm',
          padding: '20mm',
          boxSizing: 'border-box',
          pageBreakAfter: 'always',
        }}
      >
        {/* Page Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="text-xl font-bold">Company Logo</div>
          <div className="text-right">
            <h2 className="text-lg font-medium">Performance Review - Page 3</h2>
            <p className="text-sm text-gray-600">
              {employee.name} | {period}
            </p>
          </div>
        </header>

        <h2 className="text-2xl font-semibold mb-8">Core Competencies (Part 2)</h2>

        {/* Second Half Ratings */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
          {secondHalfRatings.map(([key, label]) => (
            <RatingRow key={key} label={label} rating={employee.ratings[key]} />
          ))}
        </div>

        {/* Comments Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Kesan & Pesan</h3>
          <ul className="list-inside list-disc space-y-2">
            {employee.comment.map((comment, index) => (
              <li key={index} className="text-gray-700">
                {comment}
              </li>
            ))}
          </ul>
        </div>

        {/* Page Footer */}
        <div
          className="text-center text-sm text-gray-500 mt-auto"
          style={{ position: 'absolute', bottom: '15mm', left: '20mm', right: '20mm' }}
        >
          Page 3 of 4 - {employee.name} Performance Review
        </div>
      </div>

      {/* PAGE 4: Final Rating and Summary */}
      <div
        className="report-page bg-white text-black"
        style={{
          width: '210mm',
          height: '297mm',
          padding: '20mm',
          boxSizing: 'border-box',
          pageBreakAfter: 'always',
        }}
      >
        {/* Page Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="text-xl font-bold">Company Logo</div>
          <div className="text-right">
            <h2 className="text-lg font-medium">Performance Review - Page 4</h2>
            <p className="text-sm text-gray-600">
              {employee.name} | {period}
            </p>
          </div>
        </header>

        <h2 className="text-2xl font-semibold mb-8 text-center">Overall Performance Summary</h2>

        {/* Final Rating - Big Number */}
        <div className="w-full flex justify-center items-center mb-8">
          <div className="text-center">
            <div className="text-8xl font-extrabold text-yellow-500 drop-shadow-lg mb-4">
              {employee.finalRating.toFixed(2)}
            </div>
            <p className="text-xl font-semibold text-gray-700">Overall Performance Score</p>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 leading-relaxed mb-4">
              {employee.name} has demonstrated{' '}
              {employee.finalRating >= 4.5
                ? 'exceptional'
                : employee.finalRating >= 4.0
                  ? 'strong'
                  : employee.finalRating >= 3.5
                    ? 'satisfactory'
                    : employee.finalRating >= 3.0
                      ? 'acceptable'
                      : 'needs improvement'}{' '}
              performance during the {period} review period.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This comprehensive evaluation reflects consistent effort across all measured
              competency areas and provides a foundation for continued professional development.
            </p>
          </div>
        </div>

        {/* Signature Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Review Completion</h3>
          <div className="flex justify-between">
            <div className="text-center">
              <div className="border-t border-gray-400 w-48 mb-2"></div>
              <p className="text-sm text-gray-600">Employee Signature</p>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 w-48 mb-2"></div>
              <p className="text-sm text-gray-600">Supervisor Signature</p>
            </div>
          </div>
        </div>

        {/* Page Footer */}
        <div
          className="text-center text-sm text-gray-500 mt-auto"
          style={{ position: 'absolute', bottom: '15mm', left: '20mm', right: '20mm' }}
        >
          Page 4 of 4 - {employee.name} Performance Review | Review Date:{' '}
          {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
