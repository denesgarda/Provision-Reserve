import { useState } from "react";

type PageId = "dashboard" | "inventory" | "shopping" | "recipes" | "settings";

const PAGES: { id: PageId; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "./assets/icons/dashboard.png" },
  { id: "inventory", label: "Inventory", icon: "./assets/icons/inventory.png" },
  { id: "shopping", label: "Shopping", icon: "./assets/icons/shopping.png" },
  { id: "recipes", label: "Recipes", icon: "./assets/icons/recipes.png" },
  { id: "settings", label: "Settings", icon: "./assets/icons/settings.png" },
];

export function SideBar() {
    const [activePage, setActivePage] = useState<PageId>("dashboard");

    return (
        <div className="side-bar">
            <nav className="side-bar-nav">
            {PAGES.map((page) => (
          <button
            key={page.id}
            className={`side-bar-item ${activePage === page.id ? "active" : ""}`}
            onClick={() => setActivePage(page.id)}
          >
            <span className="side-bar-item-label">{page.label}</span>
          </button>
        ))}
            </nav>
        </div>
        /*
        <div className="side-bar">
            <nav className="side-bar-nav">
            {PAGES.map((page) => (
          <button
            key={page.id}
            className={`side-bar-item ${activePage === page.id ? "active" : ""}`}
            onClick={() => setActivePage(page.id)}
          >
            <img src={page.icon} alt="" className="side-bar-item-icon" />
            <span className="side-bar-item-label">{page.label}</span>
          </button>
        ))}
            </nav>
        </div>
        */
    );
}