import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Tasks from "./index";
import { useTasks } from "~/context/TaskContext";

// Mock the TaskContext
vi.mock("~/context/TaskContext", () => ({
  useTasks: vi.fn(),
}));

// Mock the Header component
vi.mock("~/components/Header", () => ({
  default: () => <div data-testid="mock-header">Header</div>,
}));

describe("Tasks", () => {
  const mockTasks = [
    { id: "1", title: "Task 1", completed: false, dueDate: "2024-03-20" },
    { id: "2", title: "Task 2", completed: true, dueDate: "2024-03-21" },
  ];

  const mockTaskContext = {
    addTask: vi.fn(),
    toggleTask: vi.fn(),
    deleteTask: vi.fn(),
    filterTasks: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockTaskContext.filterTasks.mockReturnValue(mockTasks);
    (useTasks as any).mockReturnValue(mockTaskContext);
  });

  it("renders the tasks page with form and filter buttons", () => {
    render(<Tasks />);

    expect(screen.getByLabelText("Task Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Due Date")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Task" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "All Tasks" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Pending Tasks" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Completed Tasks" })
    ).toBeInTheDocument();
  });

  it("handles task submission", async () => {
    render(<Tasks />);

    const titleInput = screen.getByLabelText("Task Title");
    const dueDateInput = screen.getByLabelText("Due Date");
    const submitButton = screen.getByRole("button", { name: "Add Task" });

    fireEvent.change(titleInput, { target: { value: "New Task" } });
    fireEvent.change(dueDateInput, { target: { value: "2024-03-22" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockTaskContext.addTask).toHaveBeenCalledWith(
        "New Task",
        "2024-03-22"
      );
    });

    // Form should be cleared after submission
    expect(titleInput).toHaveValue("");
    expect(dueDateInput).toHaveValue("");
  });

  it("prevents submission when fields are empty", async () => {
    render(<Tasks />);

    const submitButton = screen.getByRole("button", { name: "Add Task" });
    fireEvent.click(submitButton);

    expect(mockTaskContext.addTask).not.toHaveBeenCalled();
  });

  it("handles filter changes", () => {
    render(<Tasks />);

    const pendingButton = screen.getByRole("button", { name: "Pending Tasks" });
    fireEvent.click(pendingButton);
    expect(mockTaskContext.filterTasks).toHaveBeenCalledWith("pending");

    const completedButton = screen.getByRole("button", {
      name: "Completed Tasks",
    });
    fireEvent.click(completedButton);
    expect(mockTaskContext.filterTasks).toHaveBeenCalledWith("completed");

    const allButton = screen.getByRole("button", { name: "All Tasks" });
    fireEvent.click(allButton);
    expect(mockTaskContext.filterTasks).toHaveBeenCalledWith("all");
  });

  it("displays loading state during task addition", async () => {
    mockTaskContext.addTask.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    render(<Tasks />);

    const titleInput = screen.getByLabelText("Task Title");
    const dueDateInput = screen.getByLabelText("Due Date");

    fireEvent.change(titleInput, { target: { value: "New Task" } });
    fireEvent.change(dueDateInput, { target: { value: "2024-03-22" } });
    fireEvent.click(screen.getByRole("button", { name: "Add Task" }));

    expect(
      screen.getByRole("button", { name: "Adding..." })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adding..." })).toBeDisabled();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add Task" })
      ).toBeInTheDocument();
    });
  });

  it("renders task cards for filtered tasks", () => {
    render(<Tasks />);

    mockTasks.forEach((task) => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });
  });

  it("handles errors during task addition", async () => {
    const error = new Error("Failed to add task");
    mockTaskContext.addTask.mockRejectedValue(error);
    render(<Tasks />);

    const titleInput = screen.getByLabelText("Task Title");
    const dueDateInput = screen.getByLabelText("Due Date");

    fireEvent.change(titleInput, { target: { value: "New Task" } });
    fireEvent.change(dueDateInput, { target: { value: "2024-03-22" } });

    // Click the button and wait for the error to be handled
    fireEvent.click(screen.getByRole("button", { name: "Add Task" }));

    // Wait for the error to be handled and the button to return to its initial state
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Add Task" })).toBeEnabled();
      expect(titleInput).toHaveValue("New Task"); // Form should retain values on error
      expect(dueDateInput).toHaveValue("2024-03-22");
      expect(mockTaskContext.addTask).toHaveBeenCalledTimes(1);
    });
  });
});
