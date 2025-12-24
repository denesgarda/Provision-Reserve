import "./App.css";
import { MainView } from "./components/MainView";
import { SideBar } from "./components/SideBar";
import { TopBar } from "./components/TopBar";
import { PageId } from "./pages";
import { useState } from "react";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>("dashboard");
  const [databasePath, setDatabasePath] = useState("");

  return (
    <div className="app-root">
      <TopBar currentPage={currentPage} databasePath={databasePath} setDatabasePath={setDatabasePath}/>
      <div className="body">
        <SideBar currentPage={currentPage} onPageChange={setCurrentPage}/>
        <MainView currentPage={currentPage}/>
      </div>
    </div>
  );
}