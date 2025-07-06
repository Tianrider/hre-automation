import { validateEmployeeReviews, validateEmployeeReviewsSafe } from '../validation';
import { z } from 'zod';

describe('Employee Review Validation', () => {
  const validEmployee = {
    name: "John Doe",
    ratings: {
      tanggungJawab: 4,
      kerjaSama: 5,
      komunikasi: 4,
      pekaDanInisiatif: 4,
      kedekatan: 3,
      profesional: 5
    },
    comment: [
      "John consistently shows great responsibility and teamwork.",
      "Always willing to help others when needed."
    ]
  };

  describe('validateEmployeeReviews', () => {
    it('should accept valid employee data', () => {
      const result = validateEmployeeReviews([validEmployee]);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(validEmployee);
    });

    it('should reject empty array', () => {
      expect(() => validateEmployeeReviews([])).toThrow();
    });

    it('should reject missing required fields', () => {
      const invalidEmployee = {
        name: "John Doe",
        // missing ratings
        comment: ["Good work"]
      };
      expect(() => validateEmployeeReviews([invalidEmployee])).toThrow();
    });

    it('should reject invalid rating values', () => {
      const invalidRatings = {
        ...validEmployee,
        ratings: {
          ...validEmployee.ratings,
          tanggungJawab: 7 // invalid rating > 6
        }
      };
      expect(() => validateEmployeeReviews([invalidRatings])).toThrow();
    });

    it('should reject empty name', () => {
      const emptyName = {
        ...validEmployee,
        name: ""
      };
      expect(() => validateEmployeeReviews([emptyName])).toThrow();
    });

    it('should reject empty comments array', () => {
      const noComments = {
        ...validEmployee,
        comment: []
      };
      expect(() => validateEmployeeReviews([noComments])).toThrow();
    });

    it('should filter out empty comments', () => {
      const withEmptyComments = {
        ...validEmployee,
        comment: ["Good work", "", "  ", "Great teamwork"]
      };
      const result = validateEmployeeReviews([withEmptyComments]);
      expect(result[0].comment).toEqual(["Good work", "Great teamwork"]);
    });
  });

  describe('validateEmployeeReviewsSafe', () => {
    it('should return success true for valid data', () => {
      const result = validateEmployeeReviewsSafe([validEmployee]);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0]).toEqual(validEmployee);
      }
    });

    it('should return success false with ZodError for invalid data', () => {
      const result = validateEmployeeReviewsSafe([]);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toBeInstanceOf(z.ZodError);
      }
    });

    it('should handle malformed input gracefully', () => {
      const result = validateEmployeeReviewsSafe("not an array");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toBeInstanceOf(z.ZodError);
      }
    });
  });
}); 