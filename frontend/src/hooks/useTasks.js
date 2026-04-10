import { useState, useEffect, useCallback } from "react";
import taskApi from "../services/taskApi";

/**
 * Central hook for task state management.
 * Handles fetching, optimistic updates, and error surfacing.
 */
function useTasks(filter) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskApi.getAll(filter);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ── Optimistic mutations ─────────────────────────────────────────────────

  const addTask = async (title) => {
    // Optimistic: add a placeholder immediately
    const tempId = `temp-${Date.now()}`;
    const optimistic = { id: tempId, title, completed: false, createdAt: new Date().toISOString() };
    setTasks((prev) => [optimistic, ...prev]);

    try {
      const created = await taskApi.create(title);
      setTasks((prev) => prev.map((t) => (t.id === tempId ? created : t)));
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      setError(err.message);
    }
  };

  const toggleTask = async (id, completed) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed } : t))
    );
    try {
      await taskApi.toggle(id, completed);
    } catch (err) {
      // Rollback
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t))
      );
      setError(err.message);
    }
  };

  const editTask = async (id, title) => {
    const previous = tasks.find((t) => t.id === id)?.title;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title } : t))
    );
    try {
      await taskApi.update(id, { title });
    } catch (err) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title: previous } : t))
      );
      setError(err.message);
    }
  };

  const removeTask = async (id) => {
    const snapshot = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await taskApi.remove(id);
    } catch (err) {
      setTasks((prev) => [snapshot, ...prev]);
      setError(err.message);
    }
  };

  return { tasks, loading, error, clearError, addTask, toggleTask, editTask, removeTask, refetch: fetchTasks };
}

export default useTasks;
