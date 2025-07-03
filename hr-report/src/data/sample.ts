import type { EmployeeReview } from '@/types/employee';

export const sampleEmployee: EmployeeReview = {
  name: 'John Doe',
  ratings: {
    tanggungJawab: 4,
    kerjaSama: 5,
    komunikasi: 4,
    pekaDanInisiatif: 3,
    kedekatan: 4,
    profesional: 5,
  },
  comment: [
    'Consistently shows great responsibility in handling tasks',
    'Excellent team player, always willing to help others',
    'Good communication skills but can improve in formal settings',
    'Takes initiative in most situations',
  ],
}; 