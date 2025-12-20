import React, { useState, useEffect } from 'react';
import { DatabaseService } from '../services/database';

interface DatabaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDatabaseConnected: (path: string) => void;
  onDatabaseDisconnected?: () => void;
  initialPath?: string;
  isConnected?: boolean;
  currentPath?: string | null;
}

export function DatabaseDialog({
  isOpen,
  onClose,
  onDatabaseConnected,
  onDatabaseDisconnected,
  initialPath = '',
  isConnected = false,
  currentPath = null
}: DatabaseDialogProps) {
  const [dbPath, setDbPath] = useState(initialPath);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Load suggestions on mount
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const appDataDir = await DatabaseService.getAppDataDir();
        const defaultDb = `${appDataDir}/provision_reserve.db`;
        setSuggestions([defaultDb]);
      } catch (error) {
        console.warn('Could not load app data directory for suggestions:', error);
      }
    };

    if (isOpen) {
      loadSuggestions();
    }
  }, [isOpen]);

  const handleConnect = async () => {
    if (!dbPath.trim()) {
      setError('Please enter a database path');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const result = await DatabaseService.connectToDatabase(dbPath.trim());

      if (result.success) {
        onDatabaseConnected(dbPath.trim());
        onClose();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isConnecting) {
      handleConnect();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setDbPath(suggestion);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className={`dialog-content ${!isConnected ? 'auto-height' : ''}`}>
        <div className="dialog-header">
          <h2>{isConnected ? 'Database Settings' : 'Connect to Database'}</h2>
          <button
            className="dialog-close"
            onClick={onClose}
            disabled={isConnecting}
          >
            ×
          </button>
        </div>

        <div className="dialog-body">
          {isConnected ? (
            <>
              <div className="connection-status">
                <div className="status-indicator connected">
                  <span className="status-dot">●</span>
                  Connected
                </div>
                <div className="current-database">
                  <code>{currentPath}</code>
                </div>
              </div>

              <div className="database-actions">
                <h3>Database Actions</h3>
                <button
                  className="action-button danger disconnect"
                  onClick={() => {
                    onDatabaseDisconnected?.();
                    onClose();
                  }}
                >
                  Disconnect
                </button>
              </div>
            </>
          ) : (
            <>
              <p>
                Enter the path to your Provision Reserve database file. If the file doesn't exist,
                it will be created. If it does exist, it will be validated and connected.
              </p>

          <div className="input-group">
            <label htmlFor="db-path">Database Path:</label>
            <input
              id="db-path"
              type="text"
              value={dbPath}
              onChange={(e) => {
                setDbPath(e.target.value);
                setError(null);
              }}
              onKeyPress={handleKeyPress}
              placeholder="e.g., /path/to/my/database.db"
              disabled={isConnecting}
              autoFocus
            />
          </div>

          {suggestions.length > 0 && (
            <div className="suggestions">
              <p>Suggested locations:</p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isConnecting}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
            </>
          )}
        </div>

        {!isConnected && (
          <div className="dialog-footer">
            <button
              onClick={onClose}
              disabled={isConnecting}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              onClick={handleConnect}
              disabled={isConnecting || !dbPath.trim()}
              className="connect-button"
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
