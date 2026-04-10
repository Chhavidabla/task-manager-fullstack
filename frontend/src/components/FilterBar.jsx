const FILTERS = ["all", "pending", "completed"];

function FilterBar({ active, onChange, counts }) {
  return (
    <nav className="filter-bar" aria-label="Task filter">
      {FILTERS.map((f) => (
        <button
          key={f}
          className={`filter-bar__btn ${active === f ? "filter-bar__btn--active" : ""}`}
          onClick={() => onChange(f)}
          aria-current={active === f ? "true" : undefined}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
          <span className="filter-bar__count">{counts[f] ?? 0}</span>
        </button>
      ))}
    </nav>
  );
}

export default FilterBar;
