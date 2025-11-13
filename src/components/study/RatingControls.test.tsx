import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RatingControls } from "./RatingControls";

describe("RatingControls", () => {
  it("should render all rating buttons", () => {
    const onRatingSelect = vi.fn();
    render(<RatingControls onRatingSelect={onRatingSelect} />);

    expect(screen.getByText("1 - Bardzo trudne")).toBeInTheDocument();
    expect(screen.getByText("2 - Trudne")).toBeInTheDocument();
    expect(screen.getByText("3 - Średnie")).toBeInTheDocument();
    expect(screen.getByText("4 - Dobre")).toBeInTheDocument();
    expect(screen.getByText("5 - Łatwe")).toBeInTheDocument();
  });

  it("should call onRatingSelect with correct rating when button is clicked", async () => {
    const user = userEvent.setup();
    const onRatingSelect = vi.fn();
    render(<RatingControls onRatingSelect={onRatingSelect} />);

    const rating1Button = screen.getByText("1 - Bardzo trudne");
    await user.click(rating1Button);

    expect(onRatingSelect).toHaveBeenCalledWith(1);
    expect(onRatingSelect).toHaveBeenCalledTimes(1);
  });

  it("should call onRatingSelect for different ratings", async () => {
    const user = userEvent.setup();
    const onRatingSelect = vi.fn();
    render(<RatingControls onRatingSelect={onRatingSelect} />);

    await user.click(screen.getByText("3 - Średnie"));
    expect(onRatingSelect).toHaveBeenCalledWith(3);

    await user.click(screen.getByText("5 - Łatwe"));
    expect(onRatingSelect).toHaveBeenCalledWith(5);
  });

  it("should disable buttons when disabled prop is true", () => {
    const onRatingSelect = vi.fn();
    render(<RatingControls onRatingSelect={onRatingSelect} disabled={true} />);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("should enable buttons when disabled prop is false", () => {
    const onRatingSelect = vi.fn();
    render(<RatingControls onRatingSelect={onRatingSelect} disabled={false} />);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });

  it("should display instruction text", () => {
    const onRatingSelect = vi.fn();
    render(<RatingControls onRatingSelect={onRatingSelect} />);

    expect(screen.getByText("Jak poszło? Wybierz ocenę")).toBeInTheDocument();
  });

  it("should have correct data-testid attributes", () => {
    const onRatingSelect = vi.fn();
    render(<RatingControls onRatingSelect={onRatingSelect} />);

    expect(screen.getByTestId("rating-controls")).toBeInTheDocument();
    expect(screen.getByTestId("rating-button-1")).toBeInTheDocument();
    expect(screen.getByTestId("rating-button-2")).toBeInTheDocument();
    expect(screen.getByTestId("rating-button-3")).toBeInTheDocument();
    expect(screen.getByTestId("rating-button-4")).toBeInTheDocument();
    expect(screen.getByTestId("rating-button-5")).toBeInTheDocument();
  });

  it("should call onRatingSelect with correct value for each rating", async () => {
    const user = userEvent.setup();
    const onRatingSelect = vi.fn();
    render(<RatingControls onRatingSelect={onRatingSelect} />);

    await user.click(screen.getByTestId("rating-button-1"));
    expect(onRatingSelect).toHaveBeenCalledWith(1);

    await user.click(screen.getByTestId("rating-button-2"));
    expect(onRatingSelect).toHaveBeenCalledWith(2);

    await user.click(screen.getByTestId("rating-button-3"));
    expect(onRatingSelect).toHaveBeenCalledWith(3);

    await user.click(screen.getByTestId("rating-button-4"));
    expect(onRatingSelect).toHaveBeenCalledWith(4);

    await user.click(screen.getByTestId("rating-button-5"));
    expect(onRatingSelect).toHaveBeenCalledWith(5);
  });
});
