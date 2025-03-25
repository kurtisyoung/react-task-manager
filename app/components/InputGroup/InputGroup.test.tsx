import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import InputGroup from "./index";

describe("InputGroup", () => {
  const defaultProps = {
    id: "test-input",
    type: "text",
    placeholder: "Enter text",
    value: "",
    onChange: vi.fn(),
  };

  it("renders input with required props", () => {
    render(<InputGroup {...defaultProps} />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("id", "test-input");
  });

  it("renders label when provided", () => {
    render(<InputGroup {...defaultProps} label="Test Label" />);
    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "test-input");
  });

  it("handles onChange events", () => {
    const onChange = vi.fn();
    render(<InputGroup {...defaultProps} onChange={onChange} />);

    const input = screen.getByPlaceholderText("Enter text");
    fireEvent.change(input, { target: { value: "test value" } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it("displays the provided value", () => {
    render(<InputGroup {...defaultProps} value="test value" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toHaveValue("test value");
  });

  it("sets required attribute when specified", () => {
    render(<InputGroup {...defaultProps} required={true} />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toHaveAttribute("required");
  });

  it("renders different input types correctly", () => {
    render(<InputGroup {...defaultProps} type="password" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toHaveAttribute("type", "password");
  });
});
