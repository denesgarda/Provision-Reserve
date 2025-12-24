import { useState } from "react";
import arrowIcon from "../assets/arrow.png";
import { getPageById, PageId } from "@/pages";

type TopBarProps = {
    currentPage: PageId;
    databasePath: string;
    setDatabasePath: (path: string) => void;
}

export function TopBar({currentPage, databasePath, setDatabasePath}: TopBarProps) {
    const databaseBlank = databasePath === "";
    const [disableUndo, setDisableUndo] = useState(true);
    const [disableRedo, setDiableRedo] = useState(true);

    const handleRedo = () => {
        console.log("Redo clicked");
    }

    const handleUndo = () => {
        console.log("Undo clicked");
    }

    const handleDatabase = () => {
        if (databaseBlank) {
            setDatabasePath("Users/denesgarda/Downloads/test.json");
        } else {
            setDatabasePath("");
        }
    }

    return (
        <div className="top-bar">
            <div>
                <button className="inline-button" onClick={handleUndo} disabled={disableUndo}><img src={arrowIcon} alt="undo" className="rotate-180"/></button>
                <button className="inline-button" onClick={handleRedo} disabled={disableRedo}><img src={arrowIcon} alt="redo" /></button>
            </div>
            <div className="tab-name">
                <h4>{getPageById(currentPage).label}</h4>
            </div>
            <button className={`standard-button compact ${databaseBlank ? 'database-error' : ''}`} onClick={handleDatabase} style={{ marginLeft: 'auto' }}>{databaseBlank ? 'No database connected' : 'Database settings'}</button>
        </div>
    );
}