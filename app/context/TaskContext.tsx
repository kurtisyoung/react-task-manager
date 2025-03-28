import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import { simulateApiCall } from "~/utils/simulateApiCall";
import type { Task } from "~/types";

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, dueDate: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  filterTasks: (status: "all" | "pending" | "completed") => Task[];
}

const TaskContext = createContext<TaskContextType | null>(null);

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Check if localStorage is available
    const savedTasks =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("tasks")
        : null;
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = async (title: string, dueDate: string) => {
    try {
      // Simulate the API call for adding a task
      // POST request to the API
      await simulateApiCall("add", { title, dueDate });
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        dueDate,
        completed: false,
      };
      setTasks((prev) => [...prev, newTask]);
    } catch (error) {
      console.error("Failed to add task:", error);
      throw new Error("Failed to add task. Please try again.");
    }
  };

  const toggleTask = useCallback(async (id: string) => {
    try {
      // Simulate the API call for toggling a task's completion status
      // PATCH request to the API instead of PUT because it's a partial update
      await simulateApiCall("toggle", { id });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      console.error("Failed to toggle task:", error);
      throw new Error("Failed to update task status. Please try again.");
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      // Simulate the API call for deleting a task
      // DELETE request to the API
      await simulateApiCall("delete", { id });
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
      throw new Error("Failed to delete task. Please try again.");
    }
  }, []);

  const filterTasks = useCallback(
    (status: "all" | "pending" | "completed") => {
      switch (status) {
        case "pending":
          return tasks.filter((task) => !task.completed);
        case "completed":
          return tasks.filter((task) => task.completed);
        default:
          return tasks;
      }
    },
    [tasks]
  );

  // Memoize the value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      tasks,
      addTask,
      toggleTask,
      deleteTask,
      filterTasks,
    }),
    [tasks]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
