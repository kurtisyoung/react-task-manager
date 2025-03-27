import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useState } from "react";
import { TaskProvider, useTasks } from "./TaskContext";
import { simulateApiCall } from "~/utils/simulateApiCall";
import "@testing-library/jest-dom";

// Mock simulateApiCall
vi.mock("~/utils/simulateApiCall", () => ({
  simulateApiCall: vi.fn(),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Test component that uses the task context
function TestComponent() {
  const { tasks, addTask, toggleTask, deleteTask, filterTasks } = useTasks();
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  return (
    <div>
      <div data-testid="task-count">{tasks.length}</div>
      <button
        onClick={async () => {
          try {
            await addTask("Test Task", "2024-03-25");
          } catch (error) {
            // Do nothing as this is a test
          }
        }}
      >
        Add Task
      </button>
      <button
        onClick={async () => {
          if (tasks.length > 0) {
            try {
              await toggleTask(tasks[0].id);
            } catch (error) {
              // Do nothing as this is a test
            }
          }
        }}
      >
        Toggle First Task
      </button>
      <button
        onClick={async () => {
          if (tasks.length > 0) {
            try {
              await deleteTask(tasks[0].id);
            } catch (error) {
              // Ignore error in test component
            }
          }
        }}
      >
        Delete First Task
      </button>
      <div>
        <button onClick={() => setFilter("all")}>All Tasks</button>
        <button onClick={() => setFilter("pending")}>Pending Tasks</button>
        <button onClick={() => setFilter("completed")}>Completed Tasks</button>
      </div>
      <ul>
        {filterTasks(filter).map((task) => (
          <li key={task.id} data-testid={`task-${task.id}`}>
            {task.title} - {task.completed ? "Completed" : "Pending"}
          </li>
        ))}
      </ul>
    </div>
  );
}

describe("TaskContext", () => {
  const mockTasks = [
    { id: "1", title: "Task 1", completed: false, dueDate: "2024-03-20" },
    { id: "2", title: "Task 2", completed: true, dueDate: "2024-03-21" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    // Reset Date.now to return a consistent value
    vi.spyOn(Date, "now").mockImplementation(() => 1234567890);
  });

  test("provides initial empty state when no tasks in localStorage", () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    expect(screen.getByTestId("task-count")).toHaveTextContent("0");
  });

  test("initializes with tasks from localStorage", () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    expect(screen.getByTestId("task-count")).toHaveTextContent("2");
    expect(screen.getByText("Task 1 - Pending")).toBeInTheDocument();
    expect(screen.getByText("Task 2 - Completed")).toBeInTheDocument();
  });

  test("handles adding a new task", async () => {
    vi.mocked(simulateApiCall).mockResolvedValueOnce(undefined);

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    const addButton = screen.getByText("Add Task");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId("task-count")).toHaveTextContent("1");
      expect(screen.getByText("Test Task - Pending")).toBeInTheDocument();
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "tasks",
      expect.stringContaining("Test Task")
    );
  });

  test("handles toggling a task's completion status", async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
    vi.mocked(simulateApiCall).mockResolvedValueOnce(undefined);

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    const toggleButton = screen.getByText("Toggle First Task");
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText("Task 1 - Completed")).toBeInTheDocument();
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "tasks",
      expect.stringContaining('"completed":true')
    );
  });

  test("handles deleting a task", async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
    vi.mocked(simulateApiCall).mockResolvedValueOnce(undefined);

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    const deleteButton = screen.getByText("Delete First Task");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByTestId("task-count")).toHaveTextContent("1");
      expect(screen.queryByText("Task 1 - Pending")).not.toBeInTheDocument();
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "tasks",
      expect.not.stringContaining("Task 1")
    );
  });

  test("filters tasks correctly", () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    // Test pending filter
    fireEvent.click(screen.getByText("Pending Tasks"));
    expect(screen.getByText("Task 1 - Pending")).toBeInTheDocument();
    expect(screen.queryByText("Task 2 - Completed")).not.toBeInTheDocument();

    // Test completed filter
    fireEvent.click(screen.getByText("Completed Tasks"));
    expect(screen.queryByText("Task 1 - Pending")).not.toBeInTheDocument();
    expect(screen.getByText("Task 2 - Completed")).toBeInTheDocument();

    // Test all tasks filter
    fireEvent.click(screen.getByText("All Tasks"));
    expect(screen.getByText("Task 1 - Pending")).toBeInTheDocument();
    expect(screen.getByText("Task 2 - Completed")).toBeInTheDocument();
  });

  test("throws error when useTasks is used outside of TaskProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      "useTasks must be used within a TaskProvider"
    );

    consoleSpy.mockRestore();
  });

  test("handles API errors during task addition", async () => {
    const apiError = new Error("API Error");
    vi.mocked(simulateApiCall).mockRejectedValueOnce(apiError);

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    const addButton = screen.getByText("Add Task");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId("task-count")).toHaveTextContent("0");
    });
  });

  test("handles API errors during task toggle", async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
    const apiError = new Error("API Error");
    vi.mocked(simulateApiCall).mockRejectedValueOnce(apiError);

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    const toggleButton = screen.getByText("Toggle First Task");
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText("Task 1 - Pending")).toBeInTheDocument();
    });
  });

  test("handles API errors during task deletion", async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
    const apiError = new Error("API Error");
    vi.mocked(simulateApiCall).mockRejectedValueOnce(apiError);

    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );

    const deleteButton = screen.getByText("Delete First Task");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByTestId("task-count")).toHaveTextContent("2");
      expect(screen.getByText("Task 1 - Pending")).toBeInTheDocument();
    });
  });
});
