import "./App.css";
import { MainView } from "./components/MainView";
import { SideBar } from "./components/SideBar";
import { TopBar } from "./components/TopBar";
import { DatabaseContext } from "./context/DatabaseContext";
import { PageId } from "./pages";
import { useState } from "react";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>("dashboard");
  const [databasePath, setDatabasePath] = useState<string | undefined>(undefined);

  return (
    <DatabaseContext.Provider value={{ databasePath, setDatabasePath }}>
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