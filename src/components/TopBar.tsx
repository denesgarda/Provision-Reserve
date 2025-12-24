import { useContext, useState } from "react";
import arrowIcon from "../assets/arrow.png";
import { getPageById, PageId } from "@/pages";
import { DatabaseContext, useDatabase } from "@/context/DatabaseContext";

type TopBarProps = {
    currentPage: PageId;
}

export function TopBar({currentPage}: TopBarProps) {
    const { databasePath, setDatabasePath } = useDatabase();
    const [disableUndo, setDisableUndo] = useState(true);
    const [disableRedo, setDiableRedo] = useState(true);

    const handleRedo = () => {
        console.log("Redo clicked");
    }

    const handleUndo = () => {
        console.log("Undo clicked");
    }

    const handleDatabase = () => {
        if (databasePath !== undefined) {
            setDatabasePath(undefined);
        } else {
            setDatabasePath("Users/denesgarda/Downloads/test.json");
        }
    }

    return (
        <div className="top-bar">
            <div>
                <button className="inline-button" onClick={handleUndo} disabled={disableUndo}><img src={arrowIcon} alt="undo" className="rotate-180"/></button>
                <button className="inline-button" onClick={handleRedo} disabled={disableRedo}><img src={arrowIcon} alt="redo" /></button>
            </div>
            {databasePath !== undefined && (
                <div className="tab-name">
                    <h4>{getPageById(currentPage).label}</h4>
                </div>
            )}
            <button className={`standard-button compact ${databasePath === undefined ? 'database-error' : ''}`} onClick={handleDatabase} style={{ marginLeft: 'auto' }}>{databasePath === undefined ? 'No database connected' : 'Database settings'}</button>
        </div>
    );
}