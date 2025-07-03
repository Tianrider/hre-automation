export interface EmployeeRatings {
  tanggungJawab: number;
  kerjaSama: number;
  komunikasi: number;
  pekaDanInisiatif: number;
  kedekatan: number;
  profesional: number;
}

export interface EmployeeReview {
  name: string;
  ratings: EmployeeRatings;
  comment: string[];
} 