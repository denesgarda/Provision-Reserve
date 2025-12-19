import { Toolbar, EventExample } from "./components";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Provision Reserve</h1>
        <Toolbar />
      </header>

      <main className="app-main">
        <EventExample />
      </main>
    </div>
  );
}

export default App;
