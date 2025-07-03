import { useState } from 'react'
import { Star } from '@/components/Star'
import { RatingRow } from '@/components/RatingRow'
import { EmployeeReportPage } from '@/components/EmployeeReportPage'
import { sampleEmployee } from '@/data/sample'
import './App.css'

function App() {
  const [rating, setRating] = useState(3)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Component Preview Section */}
        <section className="rounded-lg bg-white p-6 shadow-lg">
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
        <section className="rounded-lg bg-white p-6 shadow-lg">
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
