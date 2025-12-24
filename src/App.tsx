import "./App.css";
import { MainView } from "./components/MainView";
import { SideBar } from "./components/SideBar";
import { TopBar } from "./components/TopBar";

export default function App() {
  return (
    <div className="app-root">
      <TopBar/>
      <div className="body">
        <SideBar/>
        <MainView/>
      </div>
    </div>
  );
}