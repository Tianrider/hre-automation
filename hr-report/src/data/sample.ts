import type { EmployeeReview } from '@/types/employee';

export const sampleEmployee: EmployeeReview = {
  name: 'John Doe',
  ratings: {
    tanggungJawab: 4.5,
    kerjaSama: 5,
    komunikasi: 4,
    pekaDanInisiatif: 4.8,
    kedekatan: 4.2,
    profesional: 4.9,
  },
  comment: [
    'Excellent team player, always willing to help.',
    'Great communication skills.',
    'Proactive and takes initiative on new projects.',
  ],
  finalRating: 4.6,
  divisi: 'Software Engineering',
};
