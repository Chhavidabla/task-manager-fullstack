import { useState } from "react";

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    setTitle(e.target.value);
    if (validationError) setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      setValidationError("Task title can't be empty.");
      return;
    }
    if (trimmed.length < 2) {
      setValidationError("Title must be at least 2 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await onAdd(trimmed);
      setTitle("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form__inner">
        <input
          className={`task-form__input ${validationError ? "task-form__input--error" : ""}`}
          type="text"
          value={title}
          onChange={handleChange}
          placeholder="Add a new task…"
          disabled={submitting}
          maxLength={200}
          aria-label="New task title"
        />
        <button
          className="task-form__btn"
          type="submit"
          disabled={submitting || !title.trim()}
          aria-label="Add task"
        >
          {submitting ? (
            <span className="spinner" aria-hidden="true" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>
      {validationError && (
        <p className="task-form__error" role="alert">{validationError}</p>
      )}
    </form>
  );
}

export default TaskForm;
