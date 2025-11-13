import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFlashcardFlip } from "./useFlashcardFlip";

describe("useFlashcardFlip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("flip() - jednokrotne odwrócenie", () => {
    it("should flip only once", () => {
      const { result } = renderHook(() => useFlashcardFlip());

      expect(result.current.isFlipped).toBe(false);
      expect(result.current.isFlipping).toBe(false);

      act(() => {
        result.current.flip();
      });

      // Should be flipping immediately
      expect(result.current.isFlipping).toBe(true);
      expect(result.current.isFlipped).toBe(false);

      // After duration, should be flipped
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.isFlipped).toBe(true);
      expect(result.current.isFlipping).toBe(false);

      // Attempt to flip again should be blocked
      act(() => {
        result.current.flip();
      });

      expect(result.current.isFlipped).toBe(true); // Still true, not toggle
      expect(result.current.isFlipping).toBe(false); // Should not start flipping
    });

    it("should not flip if already flipped", () => {
      const { result } = renderHook(() => useFlashcardFlip(true));

      expect(result.current.isFlipped).toBe(true);

      act(() => {
        result.current.flip();
      });

      // Should not change state
      expect(result.current.isFlipped).toBe(true);
      expect(result.current.isFlipping).toBe(false);
    });

    it("should not flip if currently flipping", () => {
      const { result } = renderHook(() => useFlashcardFlip());

      act(() => {
        result.current.flip();
      });

      expect(result.current.isFlipping).toBe(true);

      // Try to flip again while flipping
      act(() => {
        result.current.flip();
      });

      // Should still be flipping from first call
      expect(result.current.isFlipping).toBe(true);
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

      expect(result.current.isFlipping).toBe(true);
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(result.current.isFlipped).toBe(true);
      expect(result.current.isFlipping).toBe(false);

      // Second toggle - should return to false
      act(() => {
        result.current.toggle();
      });

      expect(result.current.isFlipping).toBe(true);
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(result.current.isFlipped).toBe(false);
      expect(result.current.isFlipping).toBe(false);

      // Trzeci toggle - znowu true
      act(() => {
        result.current.toggle();
      });

      expect(result.current.isFlipping).toBe(true);
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(result.current.isFlipped).toBe(true);
      expect(result.current.isFlipping).toBe(false);
    });

    it("should not toggle if currently flipping", () => {
      const { result } = renderHook(() => useFlashcardFlip());

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isFlipping).toBe(true);

      // Try to toggle again while flipping
      act(() => {
        result.current.toggle();
      });

      // Should still be flipping from first call
      expect(result.current.isFlipping).toBe(true);
    });
  });

  describe("reset()", () => {
    it("should reset to false", () => {
      const { result } = renderHook(() => useFlashcardFlip());

      act(() => {
        result.current.toggle();
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.isFlipped).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.isFlipping).toBe(true);
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.isFlipped).toBe(false);
      expect(result.current.isFlipping).toBe(false);
    });

    it("should not reset if not flipped", () => {
      const { result } = renderHook(() => useFlashcardFlip(false));

      expect(result.current.isFlipped).toBe(false);

      act(() => {
        result.current.reset();
      });

      // Should not change state
      expect(result.current.isFlipped).toBe(false);
      expect(result.current.isFlipping).toBe(false);
    });

    it("should not reset if currently flipping", () => {
      const { result } = renderHook(() => useFlashcardFlip(true));

      act(() => {
        result.current.reset();
      });

      expect(result.current.isFlipping).toBe(true);

      // Try to reset again while flipping
      act(() => {
        result.current.reset();
      });

      // Should still be flipping from first call
      expect(result.current.isFlipping).toBe(true);
    });
  });

  describe("getCurrentSide()", () => {
    it("should return correct side", () => {
      const { result } = renderHook(() => useFlashcardFlip());

      expect(result.current.getCurrentSide()).toBe("front");

      act(() => {
        result.current.toggle();
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.getCurrentSide()).toBe("back");
    });

    it("should return front when flipped is false", () => {
      const { result } = renderHook(() => useFlashcardFlip(false));

      expect(result.current.getCurrentSide()).toBe("front");
    });

    it("should return back when flipped is true", () => {
      const { result } = renderHook(() => useFlashcardFlip(true));

      expect(result.current.getCurrentSide()).toBe("back");
    });
  });

  describe("initialState parameter", () => {
    it("should initialize with false by default", () => {
      const { result } = renderHook(() => useFlashcardFlip());

      expect(result.current.isFlipped).toBe(false);
      expect(result.current.getCurrentSide()).toBe("front");
    });

    it("should initialize with true when provided", () => {
      const { result } = renderHook(() => useFlashcardFlip(true));

      expect(result.current.isFlipped).toBe(true);
      expect(result.current.getCurrentSide()).toBe("back");
    });
  });

  describe("duration parameter", () => {
    it("should use custom duration", () => {
      const { result } = renderHook(() => useFlashcardFlip(false, 500));

      act(() => {
        result.current.flip();
      });

      expect(result.current.isFlipping).toBe(true);
      expect(result.current.isFlipped).toBe(false);

      // After 300ms, should still be flipping
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.isFlipping).toBe(true);
      expect(result.current.isFlipped).toBe(false);

      // After full 500ms, should be flipped
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(result.current.isFlipped).toBe(true);
      expect(result.current.isFlipping).toBe(false);
    });
  });
});
