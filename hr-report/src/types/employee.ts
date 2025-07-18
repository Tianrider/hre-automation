import { z } from 'zod';
import { employeeReviewSchema } from '../utils/validation';

export type Rating = 1 | 2 | 3 | 4 | 5 | 6;

export interface EmployeeRatings {
  tanggungJawab: Rating;
  kerjaSama: Rating;
  komunikasi: Rating;
  pekaDanInisiatif: Rating;
  kedekatan: Rating;
  profesional: Rating;
}

export type Ratings = {
  tanggungJawab: number;
  kerjaSama: number;
  komunikasi: number;
  pekaDanInisiatif: number;
  kedekatan: number;
  profesional: number;
};

export type EmployeeReview = {
  name: string;
  ratings: Ratings;
  finalRating: number;
  comment: string[];
  divisi: string;
};

export type EmployeeReview_v2 = z.infer<typeof employeeReviewSchema>;

// Label mapping for display purposes
export const ratingLabels: Record<keyof EmployeeRatings, string> = {
  tanggungJawab: 'Tanggung Jawab',
  kerjaSama: 'Kerja Sama',
  komunikasi: 'Komunikasi',
  pekaDanInisiatif: 'Peka dan Inisiatif',
  kedekatan: 'Kedekatan',
  profesional: 'Profesional',
};
