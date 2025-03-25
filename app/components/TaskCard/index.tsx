import type { Task } from "~/types";
import * as styles from "./TaskCard.css";

type TaskCardProps = {
  task: Task;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
};

export default function TaskCard({
  task,
  toggleTask,
  deleteTask,
}: TaskCardProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleTask(task.id);
    }
  };
  return (
    <div
      className={styles.taskCard}
      data-completed={task.completed}
      role="listitem"
      tabIndex={0}
      onKeyDown={handleKeyPress}
      onClick={() => toggleTask(task.id)}
    >
      <div className={styles.taskInfo}>
        <label className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            checked={task.completed}
            className={styles.checkbox}
            onChange={() => toggleTask(task.id)}
            aria-label={`Mark "${task.title}" as ${
              task.completed ? "incomplete" : "complete"
            }`}
          />
          <span className={styles.checkboxCustom} role="presentation" />
        </label>
        <div>
          <div className={styles.taskTitle} data-completed={task.completed}>
            {task.title}
          </div>
          <div className={styles.taskDate} data-completed={task.completed}>
            Due: {task.dueDate}
          </div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteTask(task.id);
        }}
        className={styles.deleteButton}
        aria-label={`Delete task: ${task.title}`}
      >
        Delete
      </button>
    </div>
  );
}
