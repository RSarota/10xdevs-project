import { describe, it, expect } from "vitest";
import {
  FlashcardInputSchema,
  BulkFlashcardsSchema,
  CreateFlashcardSchema,
  UpdateFlashcardSchema,
  BulkDeleteFlashcardsSchema,
  isBulkInput,
} from "./flashcard.schema";

describe("FlashcardInputSchema", () => {
  it("should validate front - required field", () => {
    const result = FlashcardInputSchema.safeParse({
      back: "Answer",
      source: "manual",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("front");
    }
  });

  it("should validate front - minimum 1 character", () => {
    const result = FlashcardInputSchema.safeParse({
      front: "",
      back: "Answer",
      source: "manual",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("puste");
    }
  });

  it("should validate front - maximum 200 characters", () => {
    const longFront = "a".repeat(201);
    const result = FlashcardInputSchema.safeParse({
      front: longFront,
      back: "Answer",
      source: "manual",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("200 znaków");
    }
  });

  it("should validate front - trim whitespace", () => {
    const result = FlashcardInputSchema.safeParse({
      front: "  Question  ",
      back: "Answer",
      source: "manual",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.front).toBe("Question");
    }
  });

  it("should validate front - cannot consist only of whitespace", () => {
    const result = FlashcardInputSchema.safeParse({
      front: "   ",
      back: "Answer",
      source: "manual",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("białych znaków");
    }
  });

  it("should validate back - required field", () => {
    const result = FlashcardInputSchema.safeParse({
      front: "Question",
      source: "manual",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("back");
    }
  });

  it("should validate back - minimum 1 character", () => {
    const result = FlashcardInputSchema.safeParse({
      front: "Question",
      back: "",
      source: "manual",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("puste");
    }
  });

  it("should validate back - maximum 500 characters", () => {
    const longBack = "a".repeat(501);
    const result = FlashcardInputSchema.safeParse({
      front: "Question",
      back: longBack,
      source: "manual",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("500 znaków");
    }
  });

  it("should validate back - trim whitespace", () => {
    const result = FlashcardInputSchema.safeParse({
      front: "Question",
      back: "  Answer  ",
      source: "manual",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.back).toBe("Answer");
    }
  });

  it("should validate back - cannot consist only of whitespace", () => {
    const result = FlashcardInputSchema.safeParse({
      front: "Question",
      back: "   ",
      source: "manual",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("białych znaków");
    }
  });

  it("should validate source - required field", () => {
    const result = FlashcardInputSchema.safeParse({
      front: "Question",
      back: "Answer",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("source");
    }
  });

  it("should validate source - enum (manual, ai-full, ai-edited)", () => {
    const validSources = ["manual", "ai-full", "ai-edited"];

    for (const source of validSources) {
      const result = FlashcardInputSchema.safeParse({
        front: "Question",
        back: "Answer",
        source,
        ...(source !== "manual" ? { generation_id: 1 } : {}),
      });

      expect(result.success).toBe(true);
    }

    const invalidResult = FlashcardInputSchema.safeParse({
      front: "Question",
      back: "Answer",
      source: "invalid",
    });

    expect(invalidResult.success).toBe(false);
  });

  it("should validate generation_id - optional field", () => {
    const result = FlashcardInputSchema.safeParse({
      front: "Question",
      back: "Answer",
      source: "manual",
    });

    expect(result.success).toBe(true);
  });

  it("should validate generation_id - must be positive integer", () => {
    const result1 = FlashcardInputSchema.safeParse({
      front: "Question",
      back: "Answer",
      source: "ai-full",
      generation_id: -1,
    });

    expect(result1.success).toBe(false);

    const result2 = FlashcardInputSchema.safeParse({
      front: "Question",
      back: "Answer",
      source: "ai-full",
      generation_id: 1.5,
    });

    expect(result2.success).toBe(false);
  });

  it("should refine: manual CANNOT have generation_id", () => {
    const result = FlashcardInputSchema.safeParse({
      front: "Question",
      back: "Answer",
      source: "manual",
      generation_id: 1,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const refineError = result.error.issues.find((issue) => issue.path.includes("generation_id"));
      expect(refineError?.message).toContain("manualne nie mogą mieć");
    }
  });

  it("should refine: ai-full MUST have generation_id", () => {
    const result = FlashcardInputSchema.safeParse({
      front: "Question",
      back: "Answer",
      source: "ai-full",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const refineError = result.error.issues.find((issue) => issue.path.includes("generation_id"));
      expect(refineError?.message).toContain("wymagają");
    }
  });

  it("should refine: ai-edited MUST have generation_id", () => {
    const result = FlashcardInputSchema.safeParse({
      front: "Question",
      back: "Answer",
      source: "ai-edited",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const refineError = result.error.issues.find((issue) => issue.path.includes("generation_id"));
      expect(refineError?.message).toContain("wymagają");
    }
  });

  it("should provide validation error messages", () => {
    const result = FlashcardInputSchema.safeParse({
      front: "",
      back: "",
      source: "invalid",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
      result.error.issues.forEach((issue) => {
        expect(issue.message).toBeTruthy();
      });
    }
  });
});

describe("BulkFlashcardsSchema", () => {
  it("should validate flashcards - required field", () => {
    const result = BulkFlashcardsSchema.safeParse({});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("flashcards");
    }
  });

  it("should validate flashcards - must be array", () => {
    const result = BulkFlashcardsSchema.safeParse({
      flashcards: "not an array",
    });

    expect(result.success).toBe(false);
  });

  it("should validate flashcards - minimum 1 element", () => {
    const result = BulkFlashcardsSchema.safeParse({
      flashcards: [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("przynajmniej jeden");
    }
  });

  it("should validate flashcards - maximum 100 elements", () => {
    const flashcards = Array.from({ length: 101 }, () => ({
      front: "Q",
      back: "A",
      source: "manual" as const,
    }));

    const result = BulkFlashcardsSchema.safeParse({
      flashcards,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("100");
    }
  });

  it("should validate each element with FlashcardInputSchema", () => {
    const result = BulkFlashcardsSchema.safeParse({
      flashcards: [
        { front: "Q1", back: "A1", source: "manual" },
        { front: "", back: "A2", source: "manual" }, // Invalid: empty front
      ],
    });

    expect(result.success).toBe(false);
  });

  it("should accept valid bulk flashcards", () => {
    const result = BulkFlashcardsSchema.safeParse({
      flashcards: [
        { front: "Q1", back: "A1", source: "manual" },
        { front: "Q2", back: "A2", source: "ai-full", generation_id: 1 },
      ],
    });

    expect(result.success).toBe(true);
  });
});

describe("CreateFlashcardSchema", () => {
  it("should accept single FlashcardInput", () => {
    const result = CreateFlashcardSchema.safeParse({
      front: "Question",
      back: "Answer",
      source: "manual",
    });

    expect(result.success).toBe(true);
  });

  it("should accept BulkFlashcardsInput", () => {
    const result = CreateFlashcardSchema.safeParse({
      flashcards: [{ front: "Q1", back: "A1", source: "manual" }],
    });

    expect(result.success).toBe(true);
  });

  it("should work with isBulkInput type guard", () => {
    const singleInput = {
      front: "Question",
      back: "Answer",
      source: "manual" as const,
    };

    const bulkInput = {
      flashcards: [{ front: "Q1", back: "A1", source: "manual" as const }],
    };

    expect(isBulkInput(singleInput)).toBe(false);
    expect(isBulkInput(bulkInput)).toBe(true);
  });
});

describe("UpdateFlashcardSchema", () => {
  it("should allow front as optional field", () => {
    const result = UpdateFlashcardSchema.safeParse({
      back: "New Answer",
    });

    expect(result.success).toBe(true);
  });

  it("should allow back as optional field", () => {
    const result = UpdateFlashcardSchema.safeParse({
      front: "New Question",
    });

    expect(result.success).toBe(true);
  });

  it("should validate front - if provided, 1-200 chars, trim", () => {
    const result1 = UpdateFlashcardSchema.safeParse({
      front: "",
      back: "Answer",
    });

    expect(result1.success).toBe(false);

    const result2 = UpdateFlashcardSchema.safeParse({
      front: "a".repeat(201),
      back: "Answer",
    });

    expect(result2.success).toBe(false);

    const result3 = UpdateFlashcardSchema.safeParse({
      front: "  Question  ",
      back: "Answer",
    });

    expect(result3.success).toBe(true);
    if (result3.success) {
      expect(result3.data.front).toBe("Question");
    }
  });

  it("should validate back - if provided, 1-500 chars, trim", () => {
    const result1 = UpdateFlashcardSchema.safeParse({
      front: "Question",
      back: "",
    });

    expect(result1.success).toBe(false);

    const result2 = UpdateFlashcardSchema.safeParse({
      front: "Question",
      back: "a".repeat(501),
    });

    expect(result2.success).toBe(false);

    const result3 = UpdateFlashcardSchema.safeParse({
      front: "Question",
      back: "  Answer  ",
    });

    expect(result3.success).toBe(true);
    if (result3.success) {
      expect(result3.data.back).toBe("Answer");
    }
  });

  it("should refine: at least one field (front or back) must be provided", () => {
    const result = UpdateFlashcardSchema.safeParse({});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Przynajmniej jedno pole");
    }
  });

  it("should provide validation error messages", () => {
    const result = UpdateFlashcardSchema.safeParse({});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBeTruthy();
    }
  });
});

describe("BulkDeleteFlashcardsSchema", () => {
  it("should validate flashcard_ids - required field", () => {
    const result = BulkDeleteFlashcardsSchema.safeParse({});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("flashcard_ids");
    }
  });

  it("should validate flashcard_ids - must be array of numbers", () => {
    const result1 = BulkDeleteFlashcardsSchema.safeParse({
      flashcard_ids: "not an array",
    });

    expect(result1.success).toBe(false);

    const result2 = BulkDeleteFlashcardsSchema.safeParse({
      flashcard_ids: ["1", "2"],
    });

    expect(result2.success).toBe(false);
  });

  it("should validate flashcard_ids - minimum 1 element", () => {
    const result = BulkDeleteFlashcardsSchema.safeParse({
      flashcard_ids: [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("przynajmniej jeden");
    }
  });

  it("should validate flashcard_ids - maximum 100 elements", () => {
    const flashcard_ids = Array.from({ length: 101 }, (_, i) => i + 1);

    const result = BulkDeleteFlashcardsSchema.safeParse({
      flashcard_ids,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("100");
    }
  });

  it("should validate each element - must be positive integer", () => {
    const result1 = BulkDeleteFlashcardsSchema.safeParse({
      flashcard_ids: [-1, 2],
    });

    expect(result1.success).toBe(false);

    const result2 = BulkDeleteFlashcardsSchema.safeParse({
      flashcard_ids: [1.5, 2],
    });

    expect(result2.success).toBe(false);

    const result3 = BulkDeleteFlashcardsSchema.safeParse({
      flashcard_ids: [0, 1],
    });

    expect(result3.success).toBe(false);
  });

  it("should accept valid flashcard_ids", () => {
    const result = BulkDeleteFlashcardsSchema.safeParse({
      flashcard_ids: [1, 2, 3],
    });

    expect(result.success).toBe(true);
  });
});
