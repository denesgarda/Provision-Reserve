import { useDatabase } from "@/context/DatabaseContext";
import { PageId, PAGES } from "@/pages";
import { useState } from "react";

type sideBarProps = {
    currentPage: PageId;
    onPageChange: (page: PageId) => void;
}

export function SideBar({currentPage, onPageChange}: sideBarProps) {
    const databasePath = useDatabase().databasePath;
    return (
        <div className="side-bar">
            <nav className="side-bar-nav">
            {PAGES.map((page) => (
          <button
            key={page.id}
            className={`side-bar-item ${currentPage === page.id ? "active" : ""}`}
            onClick={() =>  onPageChange(page.id)}
            disabled={databasePath === undefined ? true : false}
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