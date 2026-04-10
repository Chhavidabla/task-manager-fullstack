import TaskItem from "./TaskItem";

function TaskList({ tasks, loading, onToggle, onEdit, onDelete, filter }) {
  if (loading) {
    return (
      <ul className="task-list task-list--loading" aria-label="Loading tasks">
        {[1, 2, 3].map((i) => (
          <li key={i} className="task-skeleton">
            <span className="task-skeleton__check" />
            <span className="task-skeleton__text" style={{ width: `${55 + i * 10}%` }} />
          </li>
        ))}
      </ul>
    );
  }

  if (tasks.length === 0) {
    const messages = {
      all: { icon: "✦", heading: "No tasks yet", sub: "Add your first task above to get started." },
      completed: { icon: "◎", heading: "Nothing completed", sub: "Finish a task and it'll show up here." },
      pending: { icon: "◇", heading: "All caught up", sub: "No pending tasks — nice work!" },
    };
    const msg = messages[filter] || messages.all;

    return (
      <div className="task-empty" role="status">
        <span className="task-empty__icon">{msg.icon}</span>
        <p className="task-empty__heading">{msg.heading}</p>
        <p className="task-empty__sub">{msg.sub}</p>
      </div>
    );
  }

  return (
    <ul className="task-list" role="list" aria-label="Task list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;
