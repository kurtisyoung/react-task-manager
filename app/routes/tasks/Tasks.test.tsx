import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Tasks from "./";
import { useTasks } from "~/context/TaskContext";
import { useAuth } from "~/context/AuthContext";

// Mock the TaskContext
vi.mock("~/context/TaskContext", () => ({
  useTasks: vi.fn(),
}));

// Mock the AuthContext
vi.mock("~/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock the Header component
vi.mock("~/components/Header", () => ({
  default: () => <div data-testid="mock-header">Header</div>,
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
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
    (useAuth as any).mockReturnValue({ isAuthenticated: true });
  });

  test("redirects to home when not authenticated", async () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: false });
    render(<Tasks />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  test("renders the tasks page with form and filter buttons when authenticated", () => {
    render(<Tasks />);

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
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

  test("handles task submission", async () => {
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

  test("does not add task with empty fields", async () => {
    render(<Tasks />);

    const submitButton = screen.getByRole("button", { name: "Add Task" });
    fireEvent.click(submitButton);

    expect(mockTaskContext.addTask).not.toHaveBeenCalled();
  });

  test("handles filter changes", () => {
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

  test("renders task cards for filtered tasks", () => {
    render(<Tasks />);

    mockTasks.forEach((task) => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });
  });

  test("shows no tasks message when filter returns empty array", () => {
    mockTaskContext.filterTasks.mockReturnValue([]);
    render(<Tasks />);

    expect(screen.getByText("No tasks found.")).toBeInTheDocument();
  });

  test("handles errors during task addition", async () => {
    const error = new Error("Failed to add task");
    mockTaskContext.addTask.mockRejectedValue(error);
    render(<Tasks />);

    const titleInput = screen.getByLabelText("Task Title");
    const dueDateInput = screen.getByLabelText("Due Date");

    fireEvent.change(titleInput, { target: { value: "New Task" } });
    fireEvent.change(dueDateInput, { target: { value: "2024-03-22" } });
    fireEvent.click(screen.getByRole("button", { name: "Add Task" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Add Task" })).toBeEnabled();
      expect(titleInput).toHaveValue("New Task"); // Form should retain values on error
      expect(dueDateInput).toHaveValue("2024-03-22");
      expect(mockTaskContext.addTask).toHaveBeenCalledTimes(1);
    });
  });
});
