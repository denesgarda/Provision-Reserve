import { useToolbarUndoRedo } from '../hooks';

interface ToolbarProps {
  className?: string;
  disabled?: boolean;
}

export function Toolbar({ className = '', disabled = false }: ToolbarProps) {
  const { canUndo, canRedo, undoDescription, redoDescription, handleUndo, handleRedo } = useToolbarUndoRedo();

  return (
    <div className={`toolbar ${className}`}>
      <button
        onClick={handleUndo}
        disabled={disabled || !canUndo}
        title={undoDescription || 'Undo'}
      >
        ↶ Undo
      </button>

      <button
        onClick={handleRedo}
        disabled={disabled || !canRedo}
        title={redoDescription || 'Redo'}
      >
        ↷ Redo
      </button>
    </div>
  );
}
