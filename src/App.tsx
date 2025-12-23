import "./App.css";
import { TopBar } from "./components/TopBar";

export default function App() {
  return (
    <div>
      <TopBar/>
      <div style={{ paddingTop: '60px' }}>
        {/* Your main content goes here */}
      </div>
    </div>
  );
}