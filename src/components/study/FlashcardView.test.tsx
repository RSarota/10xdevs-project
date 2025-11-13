import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

describe("FlashcardView", () => {
  it("should display front side when not revealed", () => {
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    expect(screen.getByText("What is React?")).toBeInTheDocument();
    expect(screen.queryByText("A JavaScript library for building user interfaces")).not.toBeInTheDocument();
  });

  it("should display back side when revealed", () => {
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={true} onReveal={onReveal} />);

    expect(screen.getByText("A JavaScript library for building user interfaces")).toBeInTheDocument();
    expect(screen.queryByText("What is React?")).not.toBeInTheDocument();
  });

  it("should call onReveal when clicked", async () => {
    const user = userEvent.setup();
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    const card = screen.getByRole("button");
    await user.click(card);

    expect(onReveal).toHaveBeenCalledTimes(1);
  });

  it("should not call onReveal when already revealed", async () => {
    const user = userEvent.setup();
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={true} onReveal={onReveal} />);

    // Element nie ma roli button gdy jest revealed
    const card = screen.getByTestId("flashcard-view");
    await user.click(card);

    expect(onReveal).not.toHaveBeenCalled();
  });

  it("should call onReveal on Enter key press", async () => {
    const user = userEvent.setup();
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    const card = screen.getByRole("button");
    card.focus();
    await user.keyboard("{Enter}");

    expect(onReveal).toHaveBeenCalledTimes(1);
  });

  it("should call onReveal on Space key press", async () => {
    const user = userEvent.setup();
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={false} onReveal={onReveal} />);

    const card = screen.getByRole("button");
    card.focus();
    await user.keyboard(" ");

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

  it("should not show reveal hint when revealed", () => {
    const onReveal = vi.fn();
    render(<FlashcardView flashcard={mockFlashcard} isRevealed={true} onReveal={onReveal} />);

    expect(screen.queryByText("Kliknij aby odsłonić")).not.toBeInTheDocument();
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
});
