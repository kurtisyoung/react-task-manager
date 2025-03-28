import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import TaskCard from "./";
import type { Task } from "~/types";

// Mock task data
const mockTask: Task = {
  id: "1",
  title: "Test Task",
  completed: false,
  dueDate: "2024-03-25",
};

describe("TaskCard", () => {
  test("renders task information correctly", () => {
    const toggleTask = vi.fn();
    const deleteTask = vi.fn();

    render(
      <TaskCard
        task={mockTask}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
      />
    );

    // Check if task title is rendered
    expect(screen.getByText("Test Task")).toBeInTheDocument();

    // Check if due date is rendered
    expect(screen.getByText("Due: 2024-03-25")).toBeInTheDocument();

    // Check if checkbox is unchecked
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  test("renders completed task with correct styling", () => {
    const completedTask: Task = {
      ...mockTask,
      completed: true,
    };

    render(
      <TaskCard
        task={completedTask}
        toggleTask={vi.fn()}
        deleteTask={vi.fn()}
      />
    );

    // Check if checkbox is checked
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();

    // Check if task title has completed styling
    const taskTitle = screen.getByText("Test Task");
    expect(taskTitle).toHaveAttribute("data-completed", "true");
  });

  test("calls toggleTask when checkbox is clicked", () => {
    const toggleTask = vi.fn();
    const deleteTask = vi.fn();

    render(
      <TaskCard
        task={mockTask}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(toggleTask).toHaveBeenCalledWith(mockTask.id);
  });

  test("calls deleteTask when delete button is clicked", () => {
    const toggleTask = vi.fn();
    const deleteTask = vi.fn();

    render(
      <TaskCard
        task={mockTask}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(deleteTask).toHaveBeenCalledWith(mockTask.id);
  });
});
