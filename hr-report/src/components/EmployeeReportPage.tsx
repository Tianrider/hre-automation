import { RatingRow } from '@/components/RatingRow';
import type { EmployeeReview } from '@/types/employee';

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

export const EmployeeReportPage = ({
  employee,
  pageNumber,
  totalPages,
  period,
}: EmployeeReportPageProps) => {
  return (
    <div className="report-page min-h-[297mm] w-[210mm] break-after-page bg-white px-[15mm] py-[15mm] text-black">
      {/* Header with Logo */}
      <header className="mb-8 flex items-center justify-between">
        <div className="text-xl font-bold">Company Logo</div>
        <div className="text-right">
          <h2 className="text-lg font-medium">Performance Review</h2>
          <p className="text-sm text-gray-600">{period}</p>
        </div>
      </header>

      {/* Employee Name */}
      <h1 className="mb-8 text-2xl font-bold">{employee.name}</h1>

      {/* Ratings Section */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
        {(Object.entries(RATING_LABELS) as [keyof typeof RATING_LABELS, string][]).map(
          ([key, label]) => (
            <RatingRow key={key} label={label} rating={employee.ratings[key]} />
          )
        )}
      </div>

      {/* Comments Section */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-semibold">Kesan & Pesan</h3>
        <ul className="list-inside list-disc space-y-2">
          {employee.comment.map((comment, index) => (
            <li key={index} className="text-gray-700">
              {comment}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer with Page Number */}
      <footer className="absolute bottom-[15mm] right-[15mm] text-sm text-gray-500">
        Page {pageNumber} of {totalPages}
      </footer>
    </div>
  );
}; 