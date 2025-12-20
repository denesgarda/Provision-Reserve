import { useState } from 'react';
import { TopBar } from "./components/TopBar";
import { Sidebar } from "./components/Sidebar";
import { MainView } from "./components/MainView";
import { DatabaseDialog } from "./components/DatabaseDialog";
import { useDatabase } from './hooks';
import "./App.css";

function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const { isConnected, currentPath, connectToDatabase, disconnectDatabase } = useDatabase();
  const [showDatabaseDialog, setShowDatabaseDialog] = useState(false);

  const handleDatabaseConnected = (path: string) => {
    connectToDatabase(path);
  };

  const handleManageDatabases = () => {
    setShowDatabaseDialog(true);
  };

  return (
    <div className="app-root">
      <TopBar
        databasePath={currentPath}
        onManageDatabases={handleManageDatabases}
      />

      <div className="main-layout">
        <Sidebar activeView={activeView} onSelect={setActiveView} disabled={!isConnected} />
        <MainView view={activeView} isConnected={isConnected} onConnectClick={handleManageDatabases} />
      </div>

      <DatabaseDialog
        isOpen={showDatabaseDialog}
        onClose={() => setShowDatabaseDialog(false)}
        onDatabaseConnected={handleDatabaseConnected}
        onDatabaseDisconnected={disconnectDatabase}
        initialPath={currentPath || ''}
        isConnected={isConnected}
        currentPath={currentPath}
      />
    </div>
  );
}

export default App;
