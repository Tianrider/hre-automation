export type Rating = 1 | 2 | 3 | 4 | 5 | 6;

export interface EmployeeRatings {
  tanggungJawab: Rating;
  kerjaSama: Rating;
  komunikasi: Rating;
  pekaDanInisiatif: Rating;
  kedekatan: Rating;
  profesional: Rating;
}

export interface EmployeeReview {
  name: string;
  ratings: EmployeeRatings;
  comment: string[];
  finalRating: number;
}

// Label mapping for display purposes
export const ratingLabels: Record<keyof EmployeeRatings, string> = {
  tanggungJawab: "Tanggung Jawab",
  kerjaSama: "Kerja Sama",
  komunikasi: "Komunikasi",
  pekaDanInisiatif: "Peka dan Inisiatif",
  kedekatan: "Kedekatan",
  profesional: "Profesional"
}; 

export const sampleEmployees = [
  {
    name: "John Doe",
    ratings: { tanggungJawab: 4, kerjaSama: 5, ... },
    comment: ["Great job!"],
    finalRating: 4.5
  }
]; 