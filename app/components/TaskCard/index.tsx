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
  return (
    <div
      className={styles.taskCard}
      onClick={() => toggleTask(task.id)}
      data-completed={task.completed}
    >
      <div className={styles.taskInfo}>
        <span className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            checked={task.completed}
            className={styles.checkbox}
            onChange={() => toggleTask(task.id)}
          />
          <span className={styles.checkboxCustom} />
        </span>
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
        onClick={() => deleteTask(task.id)}
        className={styles.deleteButton}
        aria-label="Delete task"
      >
        Delete
      </button>
    </div>
  );
}
