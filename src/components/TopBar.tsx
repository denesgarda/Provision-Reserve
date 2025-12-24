import { useState } from "react";
import arrowIcon from "../assets/arrow.png";

export function TopBar() {
    const [showDatabaseError, setShowDatabaseError] = useState(true);
    const [disableUndo, setDisableUndo] = useState(true);
    const [disableRedo, setDiableRedo] = useState(true);
    const [currentTab, setCurrentTab] = useState("Dashboard");

    const handleRedo = () => {
        console.log("Redo clicked");
    }

    const handleUndo = () => {
        console.log("Undo clicked");
    }

    return (
        <div className="top-bar">
            <div>
                <button className="inline-button" onClick={handleUndo} disabled={disableUndo}><img src={arrowIcon} alt="undo" className="rotate-180"/></button>
                <button className="inline-button" onClick={handleRedo} disabled={disableRedo}><img src={arrowIcon} alt="redo" /></button>
            </div>
            <div className="tab-name">
                <h4>{currentTab}</h4>
            </div>
            <button className={`standard-button compact ${showDatabaseError ? 'database-error' : ''}`} style={{ marginLeft: 'auto' }}>{showDatabaseError ? 'No database connected' : 'Database settings'}</button>
        </div>
    );
}