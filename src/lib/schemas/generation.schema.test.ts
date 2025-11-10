import { describe, it, expect } from "vitest";
import { GenerateFlashcardsSchema, GetGenerationsQuerySchema } from "./generation.schema";

describe("GenerateFlashcardsSchema", () => {
  it("should validate source_text - required field", () => {
    const result = GenerateFlashcardsSchema.safeParse({});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("source_text");
    }
  });

  it("should validate source_text - minimum 1000 characters", () => {
    const shortText = "a".repeat(999);
    const result = GenerateFlashcardsSchema.safeParse({
      source_text: shortText,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("1000 znaków");
    }
  });

  it("should validate source_text - maximum 10000 characters", () => {
    const longText = "a".repeat(10001);
    const result = GenerateFlashcardsSchema.safeParse({
      source_text: longText,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("10000 znaków");
    }
  });

  it("should validate source_text - trim whitespace", () => {
    const text = "a".repeat(1000);
    const result = GenerateFlashcardsSchema.safeParse({
      source_text: `  ${text}  `,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.source_text).toBe(text);
    }
  });

  it("should refine: after trim must have minimum 1000 characters", () => {
    const text = "a".repeat(999) + "   "; // 999 chars + whitespace
    const result = GenerateFlashcardsSchema.safeParse({
      source_text: text,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const refineError = result.error.issues.find((issue) => issue.message.includes("po usunięciu"));
      expect(refineError).toBeDefined();
    }
  });

  it("should refine: cannot consist only of whitespace", () => {
    const result = GenerateFlashcardsSchema.safeParse({
      source_text: "   ".repeat(1000),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const refineError = result.error.issues.find((issue) => issue.message.includes("białych znaków"));
      expect(refineError).toBeDefined();
    }
  });

  it("should accept valid source_text", () => {
    const validText = "a".repeat(1000);
    const result = GenerateFlashcardsSchema.safeParse({
      source_text: validText,
    });

    expect(result.success).toBe(true);
  });

  it("should accept source_text at maximum length", () => {
    const maxText = "a".repeat(10000);
    const result = GenerateFlashcardsSchema.safeParse({
      source_text: maxText,
    });

    expect(result.success).toBe(true);
  });

  it("should provide validation error messages", () => {
    const result = GenerateFlashcardsSchema.safeParse({
      source_text: "short",
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

describe("GetGenerationsQuerySchema", () => {
  it("should validate page - default '1'", () => {
    const result = GetGenerationsQuerySchema.safeParse({
      limit: "20",
      sort_order: "desc",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
    }
  });

  it("should validate page - must be number (string with regex)", () => {
    const result1 = GetGenerationsQuerySchema.safeParse({
      page: "abc",
      limit: "20",
      sort_order: "desc",
    });

    expect(result1.success).toBe(false);

    const result2 = GetGenerationsQuerySchema.safeParse({
      page: "5",
      limit: "20",
      sort_order: "desc",
    });

    expect(result2.success).toBe(true);
  });

  it("should transform page - Math.max(1, parseInt(val)) - minimum 1", () => {
    const result1 = GetGenerationsQuerySchema.safeParse({
      page: "0",
      limit: "20",
      sort_order: "desc",
    });

    expect(result1.success).toBe(true);
    if (result1.success) {
      expect(result1.data.page).toBe(1);
    }

    // Note: "-5" will fail regex validation (only digits allowed), so we test with "0" which passes regex but gets transformed to 1
    const result2 = GetGenerationsQuerySchema.safeParse({
      page: "0",
      limit: "20",
      sort_order: "desc",
    });

    expect(result2.success).toBe(true);
    if (result2.success) {
      expect(result2.data.page).toBe(1);
    }

    const result3 = GetGenerationsQuerySchema.safeParse({
      page: "10",
      limit: "20",
      sort_order: "desc",
    });

    expect(result3.success).toBe(true);
    if (result3.success) {
      expect(result3.data.page).toBe(10);
    }
  });

  it("should validate limit - default '20'", () => {
    const result = GetGenerationsQuerySchema.safeParse({
      page: "1",
      sort_order: "desc",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(20);
    }
  });

  it("should validate limit - must be number (string with regex)", () => {
    const result1 = GetGenerationsQuerySchema.safeParse({
      page: "1",
      limit: "abc",
      sort_order: "desc",
    });

    expect(result1.success).toBe(false);

    const result2 = GetGenerationsQuerySchema.safeParse({
      page: "1",
      limit: "10",
      sort_order: "desc",
    });

    expect(result2.success).toBe(true);
  });

  it("should transform limit - Math.min(50, Math.max(1, parseInt(val))) - range 1-50", () => {
    const result1 = GetGenerationsQuerySchema.safeParse({
      page: "1",
      limit: "0",
      sort_order: "desc",
    });

    expect(result1.success).toBe(true);
    if (result1.success) {
      expect(result1.data.limit).toBe(1);
    }

    const result2 = GetGenerationsQuerySchema.safeParse({
      page: "1",
      limit: "100",
      sort_order: "desc",
    });

    expect(result2.success).toBe(true);
    if (result2.success) {
      expect(result2.data.limit).toBe(50);
    }

    const result3 = GetGenerationsQuerySchema.safeParse({
      page: "1",
      limit: "25",
      sort_order: "desc",
    });

    expect(result3.success).toBe(true);
    if (result3.success) {
      expect(result3.data.limit).toBe(25);
    }
  });

  it("should validate sort_order - default 'desc'", () => {
    const result = GetGenerationsQuerySchema.safeParse({
      page: "1",
      limit: "20",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sort_order).toBe("desc");
    }
  });

  it("should validate sort_order - enum ('asc', 'desc')", () => {
    const result1 = GetGenerationsQuerySchema.safeParse({
      page: "1",
      limit: "20",
      sort_order: "asc",
    });

    expect(result1.success).toBe(true);
    if (result1.success) {
      expect(result1.data.sort_order).toBe("asc");
    }

    const result2 = GetGenerationsQuerySchema.safeParse({
      page: "1",
      limit: "20",
      sort_order: "desc",
    });

    expect(result2.success).toBe(true);
    if (result2.success) {
      expect(result2.data.sort_order).toBe("desc");
    }

    const result3 = GetGenerationsQuerySchema.safeParse({
      page: "1",
      limit: "20",
      sort_order: "invalid",
    });

    expect(result3.success).toBe(false);
  });

  it("should accept all valid parameters", () => {
    const result = GetGenerationsQuerySchema.safeParse({
      page: "2",
      limit: "30",
      sort_order: "asc",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(30);
      expect(result.data.sort_order).toBe("asc");
    }
  });
});
