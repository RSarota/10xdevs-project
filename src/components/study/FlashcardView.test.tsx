import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { FlashcardView } from "./FlashcardView";
import type { FlashcardDTO } from "@/types";

const mockFlashcard: FlashcardDTO = {
  id: 1,
  user_id: "user-123",
  front: "What is React?",
  back: "A JavaScript library for building user interfaces",
  type: "manual",
  generation_id: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

const mockFlashcardLong: FlashcardDTO = {
  id: 2,
  user_id: "user-123",
  front: "A".repeat(600),
  back: "B".repeat(600),
  type: "ai-full",
  generation_id: 1,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

describe("FlashcardView", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should display front side when not revealed", () => {
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    // Both sides are rendered but only front is visible
    expect(screen.getByText("What is React?")).toBeInTheDocument();
    expect(screen.getByText("A JavaScript library for building user interfaces")).toBeInTheDocument();
    expect(screen.getByText("PRZÓD")).toBeInTheDocument();
  });

  it("should display back side when revealed", () => {
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={true} onReveal={onReveal} />);

    // Both sides are rendered but only back is visible
    expect(screen.getByText("A JavaScript library for building user interfaces")).toBeInTheDocument();
    expect(screen.getByText("What is React?")).toBeInTheDocument();
    expect(screen.getByText("TYŁ")).toBeInTheDocument();
  });

  it("should call onReveal when clicked", () => {
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    const card = screen.getByRole("button");
    fireEvent.click(card);

    // Advance timers to complete animation
    act(() => {
      vi.runAllTimers();
    });

    expect(onReveal).toHaveBeenCalledTimes(1);
  });

  it("should not call onReveal when already revealed", () => {
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={true} onReveal={onReveal} />);

    // Element nie ma roli button gdy jest revealed
    const card = screen.getByTestId("flashcard-view");
    fireEvent.click(card);

    expect(onReveal).not.toHaveBeenCalled();
  });

  it("should call onReveal on Enter key press", () => {
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    const card = screen.getByRole("button");
    card.focus();
    fireEvent.keyDown(card, { key: "Enter", code: "Enter" });

    // Advance timers to complete animation
    act(() => {
      vi.runAllTimers();
    });

    expect(onReveal).toHaveBeenCalledTimes(1);
  });

  it("should call onReveal on Space key press", () => {
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    const card = screen.getByRole("button");
    card.focus();
    fireEvent.keyDown(card, { key: " ", code: "Space" });

    // Advance timers to complete animation
    act(() => {
      vi.runAllTimers();
    });

    expect(onReveal).toHaveBeenCalledTimes(1);
  });

  it("should display status label", () => {
    const onReveal = vi.fn();
    const { rerender } = render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    expect(screen.getByText("PRZÓD")).toBeInTheDocument();

    rerender(<FlashcardView flashcard={mockFlashcard} isRevealed={true} onReveal={onReveal} />);

    expect(screen.getByText("TYŁ")).toBeInTheDocument();
  });

  it("should show reveal hint when not revealed", () => {
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    expect(screen.getByText("Kliknij aby odsłonić")).toBeInTheDocument();
  });

  it("should show correct hint based on reveal state", () => {
    const onReveal = vi.fn();
    const { rerender } = render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    // When not revealed, should show "Kliknij aby odsłonić"
    expect(screen.getByText("Kliknij aby odsłonić")).toBeInTheDocument();

    rerender(<FlashcardView flashcard={mockFlashcard} isRevealed={true} onReveal={onReveal} />);

    // When revealed, should show "Fiszka odsłonięta"
    expect(screen.getByText("Fiszka odsłonięta")).toBeInTheDocument();
  });

  it("should have correct aria attributes", () => {
    const onReveal = vi.fn();
    const { rerender } = render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    const card = screen.getByRole("button");
    expect(card).toHaveAttribute("aria-pressed", "false");
    expect(card).toHaveAttribute("tabIndex", "0");

    rerender(<FlashcardView flashcard={mockFlashcard} isRevealed={true} onReveal={onReveal} />);

    // Po reveal element nie ma już roli button
    const revealedCard = screen.getByTestId("flashcard-view");
    expect(revealedCard).toHaveAttribute("aria-pressed", "true");
    expect(revealedCard).toHaveAttribute("tabIndex", "-1");
  });

  it("should prevent double-click within 500ms (debounce)", () => {
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    const card = screen.getByRole("button");

    // First click - should trigger animation and then onReveal after 300ms
    fireEvent.click(card);

    // Second click immediately after (should be ignored due to debounce)
    fireEvent.click(card);

    // Advance time to complete animation (300ms)
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // onReveal should only be called once (from first click)
    expect(onReveal).toHaveBeenCalledTimes(1);

    // Wait for debounce period to pass
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Third click after debounce period - should work
    fireEvent.click(card);
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onReveal).toHaveBeenCalledTimes(2);
  });

  it("should not call onReveal during flipping animation", () => {
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    const card = screen.getByRole("button");
    fireEvent.click(card);

    // Try to click again during animation (within 300ms)
    act(() => {
      vi.advanceTimersByTime(100);
    });
    fireEvent.click(card);

    // onReveal should only be called once (after animation completes)
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(onReveal).toHaveBeenCalledTimes(1);
  });

  it("should reset animation state when flashcard changes", () => {
    const onReveal = vi.fn();
    const { rerender } = render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    const newFlashcard: FlashcardDTO = {
      ...mockFlashcard,
      id: 2,
      front: "New question",
    };

    rerender(<FlashcardView flashcard={newFlashcard} isRevealed={false} onReveal={onReveal} />);

    // Should display new flashcard content
    expect(screen.getByText("New question")).toBeInTheDocument();
  });

  it("should display flashcard type badge", () => {
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    // FlashcardTypeBadge should render (checking for badge text - appears on both sides)
    const badges = screen.getAllByText("Ręczne");
    expect(badges.length).toBeGreaterThan(0);
  });

  it("should display different type badges", () => {
    const onReveal = vi.fn();
    const aiFlashcard: FlashcardDTO = {
      ...mockFlashcard,
      type: "ai-full",
    };
    render(<FlashcardView flashcard={aiFlashcard} isRevealed={false} onReveal={onReveal} />);

    // Badge appears on both sides
    const badges = screen.getAllByText("AI");
    expect(badges.length).toBeGreaterThan(0);
  });

  it("should display formatted date", () => {
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    // Date should be formatted in Polish locale (appears on both sides)
    const dateElements = screen.getAllByText(/sty/i);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it("should calculate text size based on content length", () => {
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcardLong} isRevealed={false} onReveal={onReveal} />);

    // Long content should use smaller text size
    const content = screen.getByText(mockFlashcardLong.front);
    expect(content).toBeInTheDocument();
    // The text size is applied via className, so we check the element exists
    expect(content).toHaveClass("text-xs");
  });

  it("should update aria-label based on state", () => {
    const onReveal = vi.fn();
    const { rerender } = render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    const card = screen.getByRole("button");
    expect(card).toHaveAttribute("aria-label");
    const initialLabel = card.getAttribute("aria-label");
    expect(initialLabel).toContain("przód");
    expect(initialLabel).toContain("Kliknij aby odsłonić");

    rerender(<FlashcardView flashcard={mockFlashcard} isRevealed={true} onReveal={onReveal} />);

    const revealedCard = screen.getByTestId("flashcard-view");
    const revealedLabel = revealedCard.getAttribute("aria-label");
    expect(revealedLabel).toContain("tył");
    expect(revealedLabel).toContain("Fiszka odsłonięta");
  });

  it("should handle keyboard navigation correctly", () => {
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    const card = screen.getByRole("button");
    card.focus();

    // Tab should work (tabIndex is 0)
    expect(card).toHaveAttribute("tabIndex", "0");

    // Enter should trigger reveal
    fireEvent.keyDown(card, { key: "Enter", code: "Enter" });
    act(() => {
      vi.runAllTimers();
    });

    expect(onReveal).toHaveBeenCalled();
  });

  it("should not be focusable when revealed", () => {
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={true} onReveal={onReveal} />);

    const card = screen.getByTestId("flashcard-view");
    expect(card).toHaveAttribute("tabIndex", "-1");
  });
});
