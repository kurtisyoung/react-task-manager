import { useState } from "react";
import { useTasks } from "~/context/TaskContext";
import TaskCard from "~/components/TaskCard";
import InputGroup from "~/components/InputGroup";
import Header from "~/components/Header";
import * as styles from "./Tasks.css";

export function meta() {
  return [
    { title: "React Task Manager" },
    { name: "description", content: "Manage your tasks with ease" },
  ];
}

export default function Tasks() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [isLoading, setIsLoading] = useState(false);
  const { addTask, toggleTask, deleteTask, filterTasks } = useTasks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    setIsLoading(true);
    try {
      await addTask(title, dueDate);
      setTitle("");
      setDueDate("");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = filterTasks(filter);

  return (
    <div>
      <Header />

      <form onSubmit={handleSubmit} className={styles.form}>
        <InputGroup
          id="title"
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Task Title"
        />
        <InputGroup
          id="dueDate"
          type="date"
          placeholder="Due date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          label="Due Date"
        />
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Task"}
        </button>
      </form>

      <div className={styles.filterContainer}>
        <button
          className={styles.filterButton}
          data-active={filter === "all"}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={styles.filterButton}
          data-active={filter === "pending"}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={styles.filterButton}
          data-active={filter === "completed"}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className={styles.taskList}>
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    </div>
  );
}
