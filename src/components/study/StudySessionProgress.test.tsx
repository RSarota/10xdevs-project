import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StudySessionProgress } from "./StudySessionProgress";

describe("StudySessionProgress", () => {
  it("should display progress label", () => {
    render(<StudySessionProgress current={3} total={10} />);

    expect(screen.getByText("Postęp")).toBeInTheDocument();
    expect(screen.getByText("4/10")).toBeInTheDocument();
  });

  it("should calculate progress correctly", () => {
    render(<StudySessionProgress current={5} total={10} />);

    expect(screen.getByText("6/10")).toBeInTheDocument();
  });

  it("should handle zero total gracefully", () => {
    render(<StudySessionProgress current={0} total={0} />);

    expect(screen.getByText("0/0")).toBeInTheDocument();
  });

  it("should cap progress at total", () => {
    render(<StudySessionProgress current={15} total={10} />);

    expect(screen.getByText("10/10")).toBeInTheDocument();
  });

  it("should display correct progress for first flashcard", () => {
    render(<StudySessionProgress current={0} total={10} />);

    expect(screen.getByText("1/10")).toBeInTheDocument();
  });

  it("should display correct progress for last flashcard", () => {
    render(<StudySessionProgress current={9} total={10} />);

    expect(screen.getByText("10/10")).toBeInTheDocument();
  });
});
