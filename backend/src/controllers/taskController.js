const taskService = require("../services/taskService");
const { validateTitle } = require("../utils/validators");

// ── Consistent response shaping ──────────────────────────────────────────────

const ok = (res, data, status = 200) => res.status(status).json({ success: true, data });
const fail = (res, error, status = 400) => res.status(status).json({ success: false, error });

// ── Controllers ──────────────────────────────────────────────────────────────

function getTasks(req, res) {
  const { filter } = req.query; // "all" | "completed" | "pending"
  const tasks = taskService.getAllTasks(filter);
  ok(res, tasks);
}

function createTask(req, res) {
  const { title } = req.body;
  const validationError = validateTitle(title);
  if (validationError) return fail(res, validationError, 422);

  const task = taskService.createTask(title);
  ok(res, task, 201);
}

function updateTask(req, res) {
  const { id } = req.params;
  const { title, completed } = req.body;

  // At least one field must be present
  if (title === undefined && completed === undefined) {
    return fail(res, "Provide at least one field to update: title or completed.");
  }

  // If title is being updated, validate it
  if (title !== undefined) {
    const validationError = validateTitle(title);
    if (validationError) return fail(res, validationError, 422);
  }

  const updates = {};
  if (title !== undefined) updates.title = title.trim();
  if (completed !== undefined) updates.completed = Boolean(completed);

  const updated = taskService.updateTask(id, updates);
  if (!updated) return fail(res, "Task not found.", 404);

  ok(res, updated);
}

function deleteTask(req, res) {
  const { id } = req.params;
  const deleted = taskService.deleteTask(id);
  if (!deleted) return fail(res, "Task not found.", 404);

  ok(res, { id });
}

module.exports = { getTasks, createTask, updateTask, deleteTask };
