import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFlashcardFlip } from "./useFlashcardFlip";

describe("useFlashcardFlip", () => {
  describe("flip() - jednokrotne odwrócenie", () => {
    it("should flip only once", () => {
      const { result } = renderHook(() => useFlashcardFlip());

      expect(result.current.isFlipped).toBe(false);

      act(() => {
        result.current.flip();
      });

      expect(result.current.isFlipped).toBe(true);

      // Próba ponownego flip() powinna być zablokowana
      act(() => {
        result.current.flip();
      });

      expect(result.current.isFlipped).toBe(true); // Nadal true, nie toggle
    });
  });

  describe("toggle() - wielokrotne przełączanie", () => {
    it("should allow multiple toggles", () => {
      const { result } = renderHook(() => useFlashcardFlip());

      expect(result.current.isFlipped).toBe(false);

      // Pierwszy toggle
      act(() => {
        result.current.toggle();
      });

      expect(result.current.isFlipped).toBe(true);

      // Drugi toggle - powinien wrócić do false
      act(() => {
        result.current.toggle();
      });

      expect(result.current.isFlipped).toBe(false);

      // Trzeci toggle - znowu true
      act(() => {
        result.current.toggle();
      });

      expect(result.current.isFlipped).toBe(true);
    });
  });

  describe("reset()", () => {
    it("should reset to false", () => {
      const { result } = renderHook(() => useFlashcardFlip());

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isFlipped).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.isFlipped).toBe(false);
    });
  });

  describe("getCurrentSide()", () => {
    it("should return correct side", () => {
      const { result } = renderHook(() => useFlashcardFlip());

      expect(result.current.getCurrentSide()).toBe("front");

      act(() => {
        result.current.toggle();
      });

      expect(result.current.getCurrentSide()).toBe("back");
    });
  });
});
