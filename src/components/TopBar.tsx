import arrowIcon from "../assets/arrow.png";

export function TopBar() {
    const handleRedo = () => {
        console.log("Redo clicked");
    }

    const handleUndo = () => {
        console.log("Undo clicked");
    }

    return (
        <div className="top-bar">
            <button className="inline-button" onClick={handleUndo} disabled={true}><img src={arrowIcon} alt="undo" className="rotate-180"/></button>
            <button className="inline-button" onClick={handleRedo} disabled={true}><img src={arrowIcon} alt="redo" /></button>
            <button className="standard-button-compact" style={{ marginLeft: 'auto' }}>No database connected</button>
        </div>
    );
}