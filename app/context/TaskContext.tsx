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
    const savedTasks =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("tasks")
        : null;
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback(async (title: string, dueDate: string) => {
    // Simulate the API call for adding a task
    await simulateApiCall("add", { title, dueDate });
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      dueDate,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const toggleTask = useCallback(async (id: string) => {
    // Simulate the API call for toggling a task's completion status
    await simulateApiCall("toggle", { id });
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    // Simulate the API call for deleting a task
    await simulateApiCall("delete", { id });
    setTasks((prev) => prev.filter((task) => task.id !== id));
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

  const value = useMemo(
    () => ({
      tasks,
      addTask,
      toggleTask,
      deleteTask,
      filterTasks,
    }),
    [tasks, addTask, toggleTask, deleteTask, filterTasks]
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
