const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../../data/tasks.json");

// ── Persistence helpers ──────────────────────────────────────────────────────

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadFromFile() {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveToFile(tasks) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf-8");
}

// In-memory store — seeded from file on startup
let tasks = loadFromFile();

// ── Service methods ──────────────────────────────────────────────────────────

/**
 * Returns all tasks, optionally filtered by completion status.
 * @param {string|undefined} filter - "completed" | "pending" | undefined
 */
function getAllTasks(filter) {
  if (filter === "completed") return tasks.filter((t) => t.completed);
  if (filter === "pending") return tasks.filter((t) => !t.completed);
  return [...tasks];
}

function getTaskById(id) {
  return tasks.find((t) => t.id === id) || null;
}

function createTask(title) {
  const task = {
    id: uuidv4(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  saveToFile(tasks);
  return task;
}

function updateTask(id, updates) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  tasks[index] = { ...tasks[index], ...updates };
  saveToFile(tasks);
  return tasks[index];
}

function deleteTask(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  saveToFile(tasks);
  return true;
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
