import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./";
import { button } from "./Button.css";

describe("Button", () => {
  test("renders with default props", () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByRole("button", { name: "Click me" });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass(button({}).split(" ")[0]);
  });

  test("renders with filter variant", () => {
    render(<Button variant="filter">Filter</Button>);
    const buttonElement = screen.getByRole("button", { name: "Filter" });
    expect(buttonElement).toHaveClass(
      button({ variant: "filter" }).split(" ")[0]
    );
  });

  test("renders with submit variant", () => {
    render(<Button variant="submit">Submit</Button>);
    const buttonElement = screen.getByRole("button", { name: "Submit" });
    expect(buttonElement).toHaveClass(
      button({ variant: "submit" }).split(" ")[0]
    );
  });

  test("renders with delete variant", () => {
    render(<Button variant="delete">Delete</Button>);
    const buttonElement = screen.getByRole("button", { name: "Delete" });
    expect(buttonElement).toHaveClass(
      button({ variant: "delete" }).split(" ")[0]
    );
  });

  test("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const buttonElement = screen.getByRole("button", { name: "Click me" });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("handles disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    const buttonElement = screen.getByRole("button", { name: "Disabled" });
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveClass(button({}).split(" ")[0]);
  });

  test("handles active state", () => {
    render(<Button data-active>Active</Button>);
    const buttonElement = screen.getByRole("button", { name: "Active" });
    expect(buttonElement).toHaveAttribute("data-active", "true");
    expect(buttonElement).toHaveClass(button({}).split(" ")[0]);
  });

  test("renders with button className", () => {
    render(<Button>Custom</Button>);
    const buttonElement = screen.getByRole("button", { name: "Custom" });
    expect(buttonElement).toHaveClass(
      button({ variant: "filter" }).split(" ")[0]
    );
  });

  test("renders with type prop", () => {
    render(<Button type="submit">Submit</Button>);
    const buttonElement = screen.getByRole("button", { name: "Submit" });
    expect(buttonElement).toHaveAttribute("type", "submit");
  });

  test("renders with aria-label", () => {
    render(<Button aria-label="Close dialog">×</Button>);
    const buttonElement = screen.getByRole("button", { name: "Close dialog" });
    expect(buttonElement).toHaveAttribute("aria-label", "Close dialog");
  });
});
