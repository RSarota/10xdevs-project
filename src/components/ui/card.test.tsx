import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";

describe("Card", () => {
  it("should render card with children", () => {
    render(
      <Card>
        <div>Test content</div>
      </Card>
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(<Card className="custom-class" />);
    const card = container.querySelector('[data-slot="card"]');

    expect(card).toHaveClass("custom-class");
  });

  it("should render CardHeader with CardTitle and CardDescription", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
      </Card>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("should render CardContent", () => {
    render(
      <Card>
        <CardContent>Content text</CardContent>
      </Card>
    );

    expect(screen.getByText("Content text")).toBeInTheDocument();
  });

  it("should render CardFooter", () => {
    render(
      <Card>
        <CardFooter>Footer content</CardFooter>
      </Card>
    );

    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });
});


