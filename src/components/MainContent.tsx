import { ViewType, VIEW_CONFIG } from '../types';

interface MainContentProps {
  currentView: ViewType;
  isConnected: boolean;
  error?: string | null;
  onConnectClick: () => void;
}

function ViewPlaceholder({ view }: { view: ViewType }) {
  const config = VIEW_CONFIG[view];

  return (
    <div className="view-placeholder">
      <div className="view-placeholder-icon">
        {config.icon}
      </div>
      <h2 className="view-placeholder-title">{config.label}</h2>
      <p className="view-placeholder-description">{config.description}</p>
      <div className="view-placeholder-content">
        <p>This view is coming soon!</p>
        <p>The {config.label.toLowerCase()} functionality will be implemented here.</p>
      </div>
    </div>
  );
}

export function MainContent({ currentView, isConnected, error, onConnectClick }: MainContentProps) {
  return (
    <main className="main-content">
      {isConnected ? (
        <ViewPlaceholder view={currentView} />
      ) : (
        <div className="connection-required">
          <div className="connection-required-content">
            <div className="connection-required-icon">🔗</div>
            <h2>Database Connection Required</h2>
            <p>Connect to a database to access {VIEW_CONFIG[currentView].label.toLowerCase()} features.</p>

            {error && (
              <div className="connection-error">
                <p><strong>Connection Error:</strong> {error}</p>
              </div>
            )}

            <button className="connect-button" onClick={onConnectClick}>
              Connect to Database
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
