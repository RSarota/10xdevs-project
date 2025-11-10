import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("should merge class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    const condition = false;
    const condition2 = true;
    expect(cn("foo", condition && "bar", "baz")).toBe("foo baz");
    expect(cn("foo", condition2 && "bar")).toBe("foo bar");
  });

  it("should merge Tailwind classes with conflicts", () => {
    // twMerge should resolve conflicts, keeping the last one
    const result = cn("px-2", "px-4");
    expect(result).toBe("px-4");
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("", "foo")).toBe("foo");
  });

  it("should handle arrays and objects", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
    expect(cn({ foo: true, bar: false })).toBe("foo");
  });
});
