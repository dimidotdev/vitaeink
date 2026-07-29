interface EntryActionsProps {
  label: string
  index: number
  total: number
  onMove: (direction: -1 | 1) => void
  onDelete: () => void
}

export const EntryActions = ({ label, index, total, onMove, onDelete }: EntryActionsProps) => (
  <div className="entry-actions" aria-label={`Actions for ${label}`}>
    <button type="button" className="button button-quiet" disabled={index === 0} onClick={() => { onMove(-1) }}>
      <span aria-hidden="true">↑</span><span className="sr-only">Move {label} up</span>
    </button>
    <button type="button" className="button button-quiet" disabled={index === total - 1} onClick={() => { onMove(1) }}>
      <span aria-hidden="true">↓</span><span className="sr-only">Move {label} down</span>
    </button>
    <button
      type="button"
      className="button button-danger-quiet"
      onClick={() => { if (window.confirm(`Remove ${label}?`)) onDelete() }}
    >
      Remove
    </button>
  </div>
)
