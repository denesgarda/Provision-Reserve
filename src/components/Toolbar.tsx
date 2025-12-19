import { useToolbarUndoRedo } from '../hooks';

interface ToolbarProps {
  className?: string;
}

export function Toolbar({ className = '' }: ToolbarProps) {
  const { canUndo, canRedo, undoDescription, redoDescription, handleUndo, handleRedo } = useToolbarUndoRedo();

  return (
    <div className={`toolbar ${className}`}>
      <button
        onClick={handleUndo}
        disabled={!canUndo}
        title={undoDescription || 'Undo'}
      >
        ↶ Undo
      </button>

      <button
        onClick={handleRedo}
        disabled={!canRedo}
        title={redoDescription || 'Redo'}
      >
        ↷ Redo
      </button>
    </div>
  );
}
