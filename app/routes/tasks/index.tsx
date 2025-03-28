import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTasks } from "~/context/TaskContext";
import { useAuth } from "~/context/AuthContext";
import TaskCard from "~/components/TaskCard";
import InputGroup from "~/components/InputGroup";
import Header from "~/components/Header";
import Button from "~/components/Button";
import * as styles from "./Tasks.css";

interface TaskFormData {
  title: string;
  dueDate: string;
}

export default function Tasks() {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [isLoading, setIsLoading] = useState(false);
  const { addTask, toggleTask, deleteTask, filterTasks } = useTasks();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit: SubmitHandler<TaskFormData> = async (data) => {
    try {
      setIsLoading(true);
      await addTask(data.title, data.dueDate);
      reset();
    } catch (err) {
      console.error(err);
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
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          aria-label="New task form"
        >
          <InputGroup
            id="title"
            type="text"
            placeholder="Task title"
            label="Task Title"
            error={errors.title?.message}
            {...register("title", {
              required: "Task title is required",
              minLength: {
                value: 3,
                message: "Task title must be at least 3 characters",
              },
            })}
          />
          <InputGroup
            id="dueDate"
            type="date"
            placeholder="Due date"
            label="Due Date"
            error={errors.dueDate?.message}
            {...register("dueDate", {
              required: "Due date is required",
              pattern: {
                value: /^\d{4}-\d{2}-\d{2}$/,
                message: "Invalid date format",
              },
            })}
          />
          <Button
            as="input"
            variant="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            aria-label="Add Task"
          >
            {isLoading ? "Adding..." : "Add Task"}
          </Button>
        </form>
      </section>

      <section aria-label="Task filters">
        <div
          className={styles.filterContainer}
          role="toolbar"
          aria-label="Task filter options"
        >
          <Button
            variant="filter"
            active={filter === "all"}
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
          >
            All Tasks
          </Button>
          <Button
            variant="filter"
            active={filter === "pending"}
            onClick={() => setFilter("pending")}
            aria-pressed={filter === "pending"}
          >
            Pending Tasks
          </Button>
          <Button
            variant="filter"
            active={filter === "completed"}
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
