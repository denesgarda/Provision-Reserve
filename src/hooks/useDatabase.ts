import { useState, useEffect, useCallback } from 'react';
import { DatabaseService } from '../services/database';

interface DatabaseState {
  isConnected: boolean;
  currentPath: string | null;
  isLoading: boolean;
  error: string | null;
}

const DATABASE_PATH_KEY = 'provision_reserve_database_path';

export function useDatabase() {
  const [state, setState] = useState<DatabaseState>({
    isConnected: false,
    currentPath: null,
    isLoading: false,
    error: null
  });

  const connectToDatabase = useCallback(async (dbPath: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await DatabaseService.connectToDatabase(dbPath);

      if (result.success) {
        // Save to localStorage
        localStorage.setItem(DATABASE_PATH_KEY, dbPath);

        setState({
          isConnected: true,
          currentPath: dbPath,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.message
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return false;
    }
  }, []);

  // Load and validate saved database path on mount
  useEffect(() => {
    const loadSavedDatabase = async () => {
      const savedPath = localStorage.getItem(DATABASE_PATH_KEY);
      if (savedPath) {
        setState(prev => ({ ...prev, isLoading: true }));

        try {
          // First validate the database exists and is valid
          const validationResult = await DatabaseService.validateDatabase(savedPath);

          if (validationResult.success) {
            // Database is valid, connect to it
            await connectToDatabase(savedPath);
          } else {
            // Database is invalid, remove from localStorage
            localStorage.removeItem(DATABASE_PATH_KEY);
            setState({
              isConnected: false,
              currentPath: null,
              isLoading: false,
              error: `Previously selected database is no longer valid: ${validationResult.message}`
            });
          }
        } catch (error) {
          // If validation fails, remove from localStorage
          localStorage.removeItem(DATABASE_PATH_KEY);
          setState({
            isConnected: false,
            currentPath: null,
            isLoading: false,
            error: 'Failed to validate previously selected database'
          });
        }
      }
    };

    loadSavedDatabase();
  }, [connectToDatabase]);

  const disconnectDatabase = useCallback(() => {
    localStorage.removeItem(DATABASE_PATH_KEY);
    setState({
      isConnected: false,
      currentPath: null,
      isLoading: false,
      error: null
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    isConnected: state.isConnected,
    currentPath: state.currentPath,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    connectToDatabase,
    disconnectDatabase,
    clearError
  };
}
