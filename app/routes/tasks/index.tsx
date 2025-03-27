import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTasks } from "~/context/TaskContext";
import { useAuth } from "~/context/AuthContext";
import TaskCard from "~/components/TaskCard";
import InputGroup from "~/components/InputGroup";
import Header from "~/components/Header";
import Button from "~/components/Button";
import { errorMessage } from "~/styles/global.css";
import * as styles from "./Tasks.css";

export function meta() {
  return [
    { title: "Tasks | React Task Manager" },
    {
      name: "description",
      content:
        "Manage and organize your tasks efficiently. Create, track, and complete tasks with our intuitive task management interface.",
    },
  ];
}

export default function Tasks() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addTask, toggleTask, deleteTask, filterTasks } = useTasks();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) {
      setError("Please fill in all required fields");
      return;
    }
    try {
      setError(null);
      setIsLoading(true);
      await addTask(title, dueDate);
      setTitle("");
      setDueDate("");
    } catch (err) {
      setError("Failed to add task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = filterTasks(filter);

  return (
    <main>
      <Header />
      <section aria-label="Add new task">
        <form
          onSubmit={handleSubmit}
          className={styles.form}
          aria-label="New task form"
        >
          <InputGroup
            id="title"
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            label="Task Title"
            required
          />
          <InputGroup
            id="dueDate"
            type="date"
            placeholder="Due date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            label="Due Date"
            required
          />
          <Button
            type="submit"
            variant="submit"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? "Adding..." : "Add Task"}
          </Button>
        </form>
        {error && (
          <div role="alert" className={errorMessage}>
            {error}
          </div>
        )}
      </section>

      <section aria-label="Task filters">
        <div
          className={styles.filterContainer}
          role="toolbar"
          aria-label="Task filter options"
        >
          <Button
            data-active={filter === "all"}
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
          >
            All Tasks
          </Button>
          <Button
            data-active={filter === "pending"}
            onClick={() => setFilter("pending")}
            aria-pressed={filter === "pending"}
          >
            Pending Tasks
          </Button>
          <Button
            data-active={filter === "completed"}
            onClick={() => setFilter("completed")}
            aria-pressed={filter === "completed"}
          >
            Completed Tasks
          </Button>
        </div>
      </section>

      <section aria-label="Task list">
        <div
          className={styles.taskList}
          role="list"
          aria-label={`${filter} tasks`}
        >
          {filteredTasks.length === 0 ? (
            <p role="status">No tasks found.</p>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
