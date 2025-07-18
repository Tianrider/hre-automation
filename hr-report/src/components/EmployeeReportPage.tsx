import React, { useLayoutEffect, useRef, useState } from 'react';
import type { EmployeeReview } from '../types/employee';
import coverImage from '../assets/cover.png';
import page2 from '../assets/page-2.png';
import templateIpo from '../assets/template-ipo.svg';
import page3 from '../assets/page-3.png';
import endPage from '../assets/ending.png';

interface EmployeeReportPageProps {
  employee: EmployeeReview;
  pageNumber: number;
  totalPages: number;
  period: string;
}

export const EmployeeReportPage: React.FC<EmployeeReportPageProps> = ({ employee }) => {
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  const [commentFontSize, setCommentFontSize] = useState('text-xl');

  useLayoutEffect(() => {
    setCommentFontSize('text-xl');
  }, [employee.comment]);

  useLayoutEffect(() => {
    if (commentsContainerRef.current) {
      const { offsetHeight } = commentsContainerRef.current;
      if (offsetHeight > 600) {
        if (commentFontSize === 'text-xl') {
          setCommentFontSize('text-md');
        } else if (commentFontSize === 'text-lg') {
          setCommentFontSize('text-base');
        } else if (commentFontSize === 'text-base') {
          setCommentFontSize('text-sm');
        } else if (commentFontSize === 'text-sm') {
          setCommentFontSize('text-xs');
        }
      }
    }
  }, [commentFontSize, employee.comment]);

  return (
    <div
      className="report-container"
      style={{ margin: 0, padding: 0, width: '210mm', height: 'auto' }}
    >
      {/* PAGE 1: Header and Employee Information */}
      <div
        className="report-page"
        style={{
          width: '210mm',
          height: '297mm',
          boxSizing: 'border-box',
          pageBreakAfter: 'always',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src={coverImage}
          alt="Report Cover"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
          }}
        />
        <div
          className="absolute top-[60%] w-2/3 left-1/2 -translate-x-1/2 flex flex-col text-white"
          style={{ zIndex: 2 }}
        >
          <div className="bg-[#1c465c] rounded-md mb-4">
            <p className="text-center text-2xl pb-8">{employee.name}</p>
          </div>
          <div className="bg-[#1c465c] rounded-md">
            <p className="text-center text-2xl pb-8">{employee.divisi}</p>
          </div>
        </div>
      </div>

      {/* PAGE 2: First Half of Ratings */}
      <div
        className="report-page"
        style={{
          width: '210mm',
          height: '297mm',
          boxSizing: 'border-box',
          pageBreakAfter: 'always',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src={page2}
          alt="Report Cover"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
          }}
        />
        <div
          className="absolute top-[27%] w-40 left-1/2 -translate-x-1/2 flex flex-col text-white"
          style={{ zIndex: 2 }}
        >
          <div className="bg-[#1c465c] rounded-full mb-4 relative w-32 h-20">
            <p className="text-center text-5xl font-bold absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {employee.finalRating}
            </p>
          </div>
        </div>

        <img
          src={templateIpo}
          alt="Report Cover"
          style={{
            position: 'absolute',
            zIndex: 2,
          }}
          className="top-[50%] left-1/2 -translate-x-1/2"
        />
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 z-10 gap-[70px] pt-12 grid grid-cols-3 text-white">
          <div className="col-span-1">
            <div className="bg-[#1c465c] rounded-full mb-[100px] relative w-20 h-12">
              <p className="text-center text-3xl font-bold absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {employee.ratings.tanggungJawab}
              </p>
            </div>
            <div className="bg-[#1c465c] rounded-full mb-4 relative w-20 h-12">
              <p className="text-center text-3xl font-bold absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {employee.ratings.pekaDanInisiatif}
              </p>
            </div>
          </div>

          <div className="col-span-1 gap-8">
            <div className="bg-[#1c465c] rounded-full mb-[100px] relative w-20 h-12">
              <p className="text-center text-3xl font-bold absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {employee.ratings.kerjaSama}
              </p>
            </div>
            <div className="bg-[#1c465c] rounded-full mb-4 relative w-20 h-12">
              <p className="text-center text-3xl font-bold absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {employee.ratings.kedekatan}
              </p>
            </div>
          </div>

          <div className="col-span-1 gap-8">
            <div className="bg-[#1c465c] rounded-full mb-[100px] relative w-20 h-12">
              <p className="text-center text-3xl font-bold absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {employee.ratings.komunikasi}
              </p>
            </div>
            <div className="bg-[#1c465c] rounded-full mb-4 relative w-20 h-12">
              <p className="text-center text-3xl font-bold absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {employee.ratings.profesional}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 3: Peer Comments */}
      <div
        className="report-page"
        style={{
          width: '210mm',
          height: '297mm',
          boxSizing: 'border-box',
          pageBreakAfter: 'always',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src={page3}
          alt="Report Cover"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
          }}
        />

        <div
          className={`absolute w-[65%] top-[23%] h-[650px] text-black left-1/2 -translate-x-1/2 z-10 pt-12 ${commentFontSize}`}
        >
          <div ref={commentsContainerRef}>
            {employee.comment.map((comment) => (
              <div key={comment}>
                <p className="text-start pb-4">{comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PAGE 4: Final Rating and Summary */}
      <div
        className="report-page"
        style={{
          width: '210mm',
          height: '297mm',
          boxSizing: 'border-box',
          pageBreakAfter: 'always',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src={endPage}
          alt="Report Cover"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
          }}
        />

        <p className="absolute z-20 top-[28%] w-[80%] italic left-1/2 -translate-x-1/2 text-start text-white text-lg">
          <div className="mb-2">Hi, {employee.name}!</div>
          <div className="mb-0">
            {' '}
            Thanks a bunch for all your hard work, dedication, and positive energy throughout this
            term.
          </div>
          <div className="mb-4">
            Your presence in the team has truly made a difference, not just in what we achieved, but
            in how we got there, together.
          </div>
          <div className="">
            As we move forward, keep growing, keep contributing, and keep inspiring those around
            you.
          </div>
          <div className="mb-4">
            Your journey in this <span className="font-bold">EXERCISE</span> is far from over and
            we’re so excited to see where it leads you next.
          </div>
          <div className="mb-4">
            Let’s keep supporting each other, learning from every challenge, and making{' '}
            <span className="font-bold">EXERCISE</span> not just a place to work, but a place to
            grow.
          </div>
          <div className="mb-4">We’re proud of you, keep it up!</div>
          <div className="font-bold">— With love,</div>
          <div>HR EXERCISE FTUI</div>
          #𝓼𝓽𝓮𝓬𝓾-𝓼𝓽𝓮𝓬𝓾
        </p>
      </div>
    </div>
  );
};
