export function Sidebar({
  activeView,
  onSelect,
  disabled = false,
}: {
  activeView: string;
  onSelect: (view: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="sidebar">
      <div style={{ marginBottom: 8, fontSize: 12, color: "#6b7280" }}>
        VIEWS
      </div>

      <button
        className={`${activeView === "dashboard" ? "active" : ""} ${disabled ? "disabled" : ""}`}
        onClick={() => !disabled && onSelect("dashboard")}
        disabled={disabled}
      >
        Dashboard
      </button>

      <button
        className={`${activeView === "inventory" ? "active" : ""} ${disabled ? "disabled" : ""}`}
        onClick={() => !disabled && onSelect("inventory")}
        disabled={disabled}
      >
        Inventory
      </button>

      <button
        className={`${activeView === "meals" ? "active" : ""} ${disabled ? "disabled" : ""}`}
        onClick={() => !disabled && onSelect("meals")}
        disabled={disabled}
      >
        Meals
      </button>

      <button
        className={`${activeView === "recipes" ? "active" : ""} ${disabled ? "disabled" : ""}`}
        onClick={() => !disabled && onSelect("recipes")}
        disabled={disabled}
      >
        Recipes
      </button>
    </div>
  );
}
