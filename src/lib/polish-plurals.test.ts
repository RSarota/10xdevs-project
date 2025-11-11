import { describe, it, expect } from "vitest";
import { pluralize, pluralizeWithCount } from "./polish-plurals";

describe("pluralize", () => {
  it("should return singular form for count 1", () => {
    expect(pluralize(1, "fiszka", "fiszki", "fiszek")).toBe("fiszka");
  });

  it("should return plural form for counts 2-4", () => {
    expect(pluralize(2, "fiszka", "fiszki", "fiszek")).toBe("fiszki");
    expect(pluralize(3, "fiszka", "fiszki", "fiszek")).toBe("fiszki");
    expect(pluralize(4, "fiszka", "fiszki", "fiszek")).toBe("fiszki");
  });

  it("should return pluralMany form for counts 5+", () => {
    expect(pluralize(5, "fiszka", "fiszki", "fiszek")).toBe("fiszek");
    expect(pluralize(6, "fiszka", "fiszki", "fiszek")).toBe("fiszek");
    expect(pluralize(10, "fiszka", "fiszki", "fiszek")).toBe("fiszek");
  });
});

describe("pluralizeWithCount", () => {
  it("should return count with singular form for 1", () => {
    expect(pluralizeWithCount(1, "fiszka", "fiszki", "fiszek")).toBe("1 fiszka");
  });

  it("should return count with plural form for 2-4", () => {
    expect(pluralizeWithCount(2, "fiszka", "fiszki", "fiszek")).toBe("2 fiszki");
    expect(pluralizeWithCount(3, "fiszka", "fiszki", "fiszek")).toBe("3 fiszki");
  });

  it("should return count with pluralMany form for 5+", () => {
    expect(pluralizeWithCount(5, "fiszka", "fiszki", "fiszek")).toBe("5 fiszek");
    expect(pluralizeWithCount(10, "fiszka", "fiszki", "fiszek")).toBe("10 fiszek");
  });
});


