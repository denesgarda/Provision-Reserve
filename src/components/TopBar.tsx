import { useToolbarUndoRedo } from '../hooks';
import undoIcon from '../assets/undo.png';
import redoIcon from '../assets/redo.png';

export function TopBar({
  databasePath,
  onManageDatabases,
}: {
  databasePath: string | null;
  onManageDatabases: () => void;
}) {
  const { canUndo, canRedo, handleUndo, handleRedo } = useToolbarUndoRedo();

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <button
          className="undo-button"
          onClick={handleUndo}
          disabled={!canUndo}
          title="Undo"
        >
          <img src={undoIcon} alt="Undo" />
        </button>
        <button
          className="redo-button"
          onClick={handleRedo}
          disabled={!canRedo}
          title="Redo"
        >
          <img src={redoIcon} alt="Redo" />
        </button>
      </div>

      <div className="top-bar-right">
        <button
          className="db-button"
          onClick={onManageDatabases}
        >
          {databasePath ? 'Database settings' : 'No database connected'}
        </button>
      </div>
    </div>
  );
}
