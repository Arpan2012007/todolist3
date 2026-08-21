import React from "react";
import Trash2 from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";

function TaskList({ tasks, toggleTask, deleteTask, editTask }) {
  if (!tasks.length) {
    return <div className="no-tasks">No tasks found.</div>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div
          className={`task-row ${task.completed ? "done" : ""}`}
          key={task.id}
        >
          <input
            type="checkbox"
            className="check"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
          />

          <div className="task-info">
            <strong>{task.title}</strong>
            <small>
              Due:{" "}
              {task.due === "No due date"
                ? "No due date"
                : new Date(task.due).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
            </small>
          </div>

          <button
  className="edit"
  onClick={() => editTask(task)}
>
  <Edit sx={{ fontSize: 18 }} />
</button>

<button
  className="delete"
  onClick={() => deleteTask(task.id)}
>
  <Trash2 sx={{ fontSize: 18 }} />
</button>
        </div>
      ))}
    </div>
  );
}

export default TaskList;