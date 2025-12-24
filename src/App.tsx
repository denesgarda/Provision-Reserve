import "./App.css";
import { MainView } from "./components/MainView";
import { SideBar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";

export default function App() {
  return (
    <div>
      <TopBar/>
      <div className="app-content">
        <SideBar/>
        <MainView/>
      </div>
    </div>
  );
}