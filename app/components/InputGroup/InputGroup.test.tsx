import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import InputGroup from "./";

describe("InputGroup", () => {
  const defaultProps = {
    id: "test-input",
    type: "text",
    placeholder: "Enter text",
    value: "",
    onChange: vi.fn(),
  };

  test("renders input with required props", () => {
    render(<InputGroup {...defaultProps} />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("id", "test-input");
  });

  test("renders label when provided", () => {
    render(<InputGroup {...defaultProps} label="Test Label" />);
    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "test-input");
  });

  test("handles onChange events", () => {
    const onChange = vi.fn();
    render(<InputGroup {...defaultProps} onChange={onChange} />);

    const input = screen.getByPlaceholderText("Enter text");
    fireEvent.change(input, { target: { value: "test value" } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.any(Object));
  });

  test("displays the provided value", () => {
    render(<InputGroup {...defaultProps} value="test value" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toHaveValue("test value");
  });

  test("sets required attribute when specified", () => {
    render(<InputGroup {...defaultProps} required={true} />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toHaveAttribute("required");
  });

  test("renders different input types correctly", () => {
    render(<InputGroup {...defaultProps} type="password" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toHaveAttribute("type", "password");
  });
});
