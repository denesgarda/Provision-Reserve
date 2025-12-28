import { useContext, useState } from "react";
import arrowIcon from "../assets/arrow.png";
import { getPageById, PageId } from "@/pages";
import { DatabaseContext, useDatabase } from "@/context/DatabaseContext";

type TopBarProps = {
    currentPage: PageId;
}

export function TopBar({currentPage}: TopBarProps) {
    const { appController, isConnected, canUndo, canRedo } = useDatabase();
    const [isConnecting, setIsConnecting] = useState(false);

    const handleDatabase = async () => {
        if (isConnected) {
            appController.disconnect();
        } else {
            setIsConnecting(true);
            try {
                const hardcodedPath = "Downloads/provision-reserve-databas.json";
                appController.connect(hardcodedPath);
            } catch (error) {
                console.error("Failed to register database:", error);
            } finally {
                setIsConnecting(false);
            }
        }
    }

    return (
        <div className="top-bar">
            <div>
                <button className="inline-button" onClick={() => {appController.undo()}} disabled={!canUndo}><img src={arrowIcon} alt="undo" className="rotate-180"/></button>
                <button className="inline-button" onClick={() => {appController.redo()}} disabled={!canRedo}><img src={arrowIcon} alt="redo" /></button>
            </div>
            <button className={`standard-button compact ${!isConnected ? 'database-error' : ''}`} onClick={handleDatabase} disabled={isConnecting} style={{ marginLeft: 'auto' }}>{isConnecting ? 'Connecting...' : !isConnected ? 'No database connected' : 'Database settings' }</button>
        </div>
        /*
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
            <button className={`standard-button compact ${databasePath === undefined ? 'database-error' : ''}`} onClick={handleDatabase} disabled={isConnecting} style={{ marginLeft: 'auto' }}>{isConnecting ? 'Connecting...' : databasePath === undefined ? 'No database connected' : 'Database settings' }</button>
        </div>
        */
    );
}