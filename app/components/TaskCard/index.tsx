import { memo, useCallback } from "react";
import Button from "~/components/Button";
import type { Task } from "~/types";
import * as styles from "./TaskCard.css";

type TaskCardProps = {
  task: Task;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
};

function TaskCard({ task, toggleTask, deleteTask }: TaskCardProps) {
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleTask(task.id);
      }
    },
    [task.id, toggleTask]
  );

  const handleToggle = useCallback(() => {
    toggleTask(task.id);
  }, [task.id, toggleTask]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteTask(task.id);
    },
    [task.id, deleteTask]
  );

  return (
    <div
      className={styles.taskCard}
      data-completed={task.completed}
      role="listitem"
      tabIndex={0}
      onKeyDown={handleKeyPress}
      onClick={handleToggle}
    >
      <div className={styles.taskInfo}>
        <label className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            checked={task.completed}
            className={styles.checkbox}
            onChange={handleToggle}
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
      <Button
        variant="delete"
        onClick={handleDelete}
        aria-label={`Delete task: ${task.title}`}
      >
        Delete
      </Button>
    </div>
  );
}

export default memo(TaskCard);
