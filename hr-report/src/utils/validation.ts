import { z } from 'zod';
import type { EmployeeReview, Rating } from '../types/employee';

// Schema for individual ratings (1-6)
const ratingSchema = z.number()
  .min(1, "Rating must be at least 1")
  .max(6, "Rating must not exceed 6")
  .refine((n): n is Rating => n >= 1 && n <= 6, {
    message: "Rating must be between 1 and 6"
  });

// Schema for the ratings object
const ratingsSchema = z.object({
  tanggungJawab: ratingSchema,
  kerjaSama: ratingSchema,
  komunikasi: ratingSchema,
  pekaDanInisiatif: ratingSchema,
  kedekatan: ratingSchema,
  profesional: ratingSchema,
});

// Schema for the entire employee review
export const employeeReviewSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  ratings: ratingsSchema,
  comment: z.array(z.string())
    .min(1, "At least one comment is required")
    .transform(comments => comments.filter(c => c.trim().length > 0)), // Remove empty comments
  finalRating: z.number()
});

// Schema for an array of employee reviews
export const employeeReviewsSchema = z.array(employeeReviewSchema)
  .min(1, "At least one employee review is required");

// Type inference from the schema
export type EmployeeReviewFromZod = z.infer<typeof employeeReviewSchema>;

// Validation function that returns either the validated data or throws an error
export function validateEmployeeReviews(data: unknown): EmployeeReview[] {
  return employeeReviewsSchema.parse(data);
}

// Safe validation function that returns a Result type
export function validateEmployeeReviewsSafe(data: unknown): { 
  success: true; 
  data: EmployeeReview[];
} | { 
  success: false; 
  errors: z.ZodError;
} {
  try {
    const validData = employeeReviewsSchema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error; // Re-throw unexpected errors
  }
} 