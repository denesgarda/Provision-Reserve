import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { getCurrentWindow } from "@tauri-apps/api/window";

async function setWindowSize() {
  const window = getCurrentWindow();

  // Get the primary monitor's size
  const { Monitor } = await import("@tauri-apps/api/window");
  const monitors = await window.availableMonitors();
  const primaryMonitor = monitors[0];

  if (primaryMonitor) {
    const screenWidth = primaryMonitor.size.width;
    const screenHeight = primaryMonitor.size.height;

    // Set window to 80% width and 100% height
    const newWidth = Math.floor(screenWidth * 0.8);
    const newHeight = screenHeight;

    await window.setSize({ width: newWidth, height: newHeight });
    await window.center();
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Set window size after app renders
setWindowSize();
