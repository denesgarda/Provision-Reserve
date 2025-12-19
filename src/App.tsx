import { useState } from 'react';
import { Toolbar, EventExample, DatabaseDialog } from "./components";
import { useDatabase } from './hooks';
import "./App.css";

function App() {
  const { isConnected, currentPath, connectToDatabase, disconnectDatabase, clearError, error } = useDatabase();
  const [showDatabaseDialog, setShowDatabaseDialog] = useState(false);

  const handleDatabaseConnected = (path: string) => {
    connectToDatabase(path);
  };

  const handleDisconnect = () => {
    disconnectDatabase();
    clearError();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Provision Reserve</h1>
        <div className="header-actions">
          {isConnected && currentPath && (
            <div className="database-info">
              <span className="database-path">{currentPath}</span>
              <button
                className="disconnect-button"
                onClick={handleDisconnect}
                title="Disconnect from database"
              >
                ✕
              </button>
            </div>
          )}
          <button
            className="database-button"
            onClick={() => setShowDatabaseDialog(true)}
          >
            {isConnected ? 'Change Database' : 'Select Database'}
          </button>
          {isConnected && <Toolbar />}
        </div>
      </header>

      <main className="app-main">
        {isConnected ? (
          <EventExample />
        ) : (
          <div className="welcome-screen">
            <h2>Welcome to Provision Reserve</h2>
            <p>To get started, please select or create a database.</p>

            {error && (
              <div className="welcome-error">
                <p><strong>Database Error:</strong> {error}</p>
                <button
                  className="clear-error-button"
                  onClick={clearError}
                >
                  Dismiss
                </button>
              </div>
            )}

            <button
              className="primary-button"
              onClick={() => setShowDatabaseDialog(true)}
            >
              Select Database
            </button>
          </div>
        )}
      </main>

      <DatabaseDialog
        isOpen={showDatabaseDialog}
        onClose={() => setShowDatabaseDialog(false)}
        onDatabaseConnected={handleDatabaseConnected}
        initialPath={currentPath || ''}
      />
    </div>
  );
}

export default App;
