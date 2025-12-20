export function MainView({
  view,
  isConnected,
  onConnectClick
}: {
  view: string;
  isConnected?: boolean;
  onConnectClick?: () => void;
}) {
  if (!isConnected) {
    return (
      <div className="main-view">
        <div className="connection-required">
          <div className="connection-required-content">
            <div className="connection-required-icon">🔗</div>
            <h2>Database Connection Required</h2>
            <p>Connect to a database to access {view.charAt(0).toUpperCase() + view.slice(1).toLowerCase()} features.</p>
            <button className="connect-button" onClick={onConnectClick}>
              Connect to Database
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-view">
      {view === "dashboard" && <Dashboard />}
      {view !== "dashboard" && (
        <>
          <h1 style={{ fontSize: 20 }}>
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </h1>
          <div style={{ color: "#6b7280", fontSize: 14 }}>
            This view is under construction.
          </div>
        </>
      )}
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
        Overview of your system
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <DashboardCard title="Inventory Items" value="—" />
        <DashboardCard title="Expiring Soon" value="—" />
        <DashboardCard title="Planned Meals" value="—" />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "var(--panel)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-lg)",
      }}
    >
      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
        {title}
      </div>
      <div style={{ fontSize: 24, marginTop: 4 }}>{value}</div>
    </div>
  );
}
