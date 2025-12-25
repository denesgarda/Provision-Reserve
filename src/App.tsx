import "./App.css";
import { MainView } from "./components/MainView";
import { SideBar } from "./components/SideBar";
import { TopBar } from "./components/TopBar";
import { DatabaseContext } from "./context/DatabaseContext";
import { PageId } from "./pages";
import { useEffect, useState } from "react";
import { DatabaseService } from "./services/databaseService";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>("dashboard");
  const [databasePath, setDatabasePath] = useState<string | undefined>(undefined);
  const [databaseService, setDatabaseService] = useState<DatabaseService | undefined>(undefined);

  useEffect(() => {
    if (databasePath) {
      const service = new DatabaseService();
      service.setDatabasePath(databasePath)
        .then(() => setDatabaseService(service))
        .catch(console.error)
    } else {
      setDatabaseService(undefined);
    }
  }, [databasePath]);

  return (
    <DatabaseContext.Provider value={{ databasePath, setDatabasePath, databaseService }}>
      <div className="app-root">
        <TopBar currentPage={currentPage}/>
        <div className="body">
          <SideBar currentPage={currentPage} onPageChange={setCurrentPage}/>
          <MainView currentPage={currentPage}/>
        </div>
      </div>
    </DatabaseContext.Provider>
  );
}