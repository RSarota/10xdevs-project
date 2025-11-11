import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudySessionHeader } from "./StudySessionHeader";

describe("StudySessionHeader", () => {
  it("should display flashcard count and current index", () => {
    const onEndSession = vi.fn();
    render(<StudySessionHeader flashcardsCount={10} currentIndex={3} onEndSession={onEndSession} />);

    expect(screen.getByText("Fiszka 4 z 10")).toBeInTheDocument();
  });

  it("should display average rating when provided", () => {
    const onEndSession = vi.fn();
    render(
      <StudySessionHeader flashcardsCount={10} currentIndex={5} onEndSession={onEndSession} averageRating={4.25} />
    );

    expect(screen.getByText("Średnia 4.25")).toBeInTheDocument();
  });

  it("should not display average rating when null", () => {
    const onEndSession = vi.fn();
    render(
      <StudySessionHeader flashcardsCount={10} currentIndex={5} onEndSession={onEndSession} averageRating={null} />
    );

    expect(screen.queryByText(/Średnia/)).not.toBeInTheDocument();
  });

  it("should call onEndSession when end session button is clicked", async () => {
    const user = userEvent.setup();
    const onEndSession = vi.fn();
    render(<StudySessionHeader flashcardsCount={10} currentIndex={3} onEndSession={onEndSession} />);

    const endButton = screen.getByRole("button", { name: /zakończ sesję/i });
    await user.click(endButton);

    expect(onEndSession).toHaveBeenCalledTimes(1);
  });

  it("should not show end session button when showEndSessionAction is false", () => {
    const onEndSession = vi.fn();
    render(
      <StudySessionHeader
        flashcardsCount={10}
        currentIndex={3}
        onEndSession={onEndSession}
        showEndSessionAction={false}
      />
    );

    expect(screen.queryByRole("button", { name: /zakończ sesję/i })).not.toBeInTheDocument();
  });

  it("should display correct index when at last flashcard", () => {
    const onEndSession = vi.fn();
    render(<StudySessionHeader flashcardsCount={10} currentIndex={9} onEndSession={onEndSession} />);

    expect(screen.getByText("Fiszka 10 z 10")).toBeInTheDocument();
  });

  it("should handle index beyond count gracefully", () => {
    const onEndSession = vi.fn();
    render(<StudySessionHeader flashcardsCount={10} currentIndex={15} onEndSession={onEndSession} />);

    // Should cap at flashcardsCount
    expect(screen.getByText("Fiszka 10 z 10")).toBeInTheDocument();
  });
});
