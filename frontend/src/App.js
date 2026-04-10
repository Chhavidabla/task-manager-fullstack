import { useState, useMemo } from "react";
import useTasks from "./hooks/useTasks";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterBar from "./components/FilterBar";
import ErrorBanner from "./components/ErrorBanner";
import "./App.css";

function App() {
  const [filter, setFilter] = useState("all");
  const { tasks, loading, error, clearError, addTask, toggleTask, editTask, removeTask } = useTasks(filter);

  // Counts are derived from the full unfiltered list — we keep a separate "all" fetch
  // for badge numbers. For simplicity here we compute from current tasks + adjust.
  const counts = useMemo(() => {
    // We always fetch filtered, so when filter=all we have full picture
    if (filter === "all") {
      return {
        all: tasks.length,
        completed: tasks.filter((t) => t.completed).length,
        pending: tasks.filter((t) => !t.completed).length,
      };
    }
    // For partial views, we only know the current count exactly
    return {
      all: "·",
      completed: filter === "completed" ? tasks.length : "·",
      pending: filter === "pending" ? tasks.length : "·",
    };
  }, [tasks, filter]);

  return (
    <div className="app">
      <div className="app__bg" aria-hidden="true" />

      <main className="app__card">
        {/* Header */}
        <header className="app__header">
          <div className="app__logo">
            <span className="app__logo-mark">✦</span>
          </div>
          <div>
            <h1 className="app__title">TaskFlow</h1>
            <p className="app__subtitle">Stay focused. Ship things.</p>
          </div>
        </header>

        {/* Add task */}
        <TaskForm onAdd={addTask} />

        {/* Error */}
        <ErrorBanner message={error} onDismiss={clearError} />

        {/* Filters */}
        <FilterBar active={filter} onChange={setFilter} counts={counts} />

        {/* Task list */}
        <TaskList
          tasks={tasks}
          loading={loading}
          onToggle={toggleTask}
          onEdit={editTask}
          onDelete={removeTask}
          filter={filter}
        />

        {/* Footer */}
        {!loading && tasks.length > 0 && (
          <footer className="app__footer">
            {tasks.filter((t) => !t.completed).length} task
            {tasks.filter((t) => !t.completed).length !== 1 ? "s" : ""} remaining
          </footer>
        )}
      </main>
    </div>
  );
}

export default App;
