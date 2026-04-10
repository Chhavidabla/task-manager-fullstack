import { useState, useRef, useEffect } from "react";
import { timeAgo } from "../utils/helpers";

function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const [editError, setEditError] = useState("");
  const inputRef = useRef(null);

  // Focus the inline input when entering edit mode
  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const startEdit = () => {
    setEditValue(task.title);
    setEditError("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditError("");
  };

  const commitEdit = async () => {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed.length < 2) {
      setEditError("Title must be at least 2 characters.");
      return;
    }
    if (trimmed === task.title) {
      cancelEdit();
      return;
    }
    await onEdit(task.id, trimmed);
    setEditing(false);
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") cancelEdit();
  };

  return (
    <li className={`task-item ${task.completed ? "task-item--done" : ""} ${task.id.startsWith("temp-") ? "task-item--optimistic" : ""}`}>
      {/* Checkbox */}
      <button
        className={`task-item__check ${task.completed ? "task-item__check--checked" : ""}`}
        onClick={() => onToggle(task.id, !task.completed)}
        aria-label={task.completed ? "Mark as pending" : "Mark as completed"}
      >
        {task.completed && (
          <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
            <path d="M1 4l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Title / inline edit */}
      <div className="task-item__body">
        {editing ? (
          <div className="task-item__edit-wrap">
            <input
              ref={inputRef}
              className={`task-item__edit-input ${editError ? "task-item__edit-input--error" : ""}`}
              value={editValue}
              onChange={(e) => { setEditValue(e.target.value); setEditError(""); }}
              onKeyDown={handleEditKeyDown}
              onBlur={commitEdit}
              maxLength={200}
              aria-label="Edit task title"
            />
            {editError && <span className="task-item__edit-error">{editError}</span>}
          </div>
        ) : (
          <span
            className="task-item__title"
            onDoubleClick={startEdit}
            title="Double-click to edit"
          >
            {task.title}
          </span>
        )}
        <span className="task-item__meta">{timeAgo(task.createdAt)}</span>
      </div>

      {/* Actions */}
      <div className="task-item__actions">
        {!editing && (
          <button
            className="task-item__action task-item__action--edit"
            onClick={startEdit}
            aria-label="Edit task"
            title="Edit"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M9.5 1.5l2 2L4 11H2v-2L9.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <button
          className="task-item__action task-item__action--delete"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
          title="Delete"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 3h9M5 3V2h3v1M4 3v7h5V3H4z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
