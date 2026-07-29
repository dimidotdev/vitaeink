import { RiArrowDownLine, RiArrowUpLine, RiDeleteBinLine } from '@remixicon/react'
import { Button } from '../../components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip'

interface EntryActionsProps {
  label: string
  index: number
  total: number
  onMove: (direction: -1 | 1) => void
  onDelete: () => void
}

export const EntryActions = ({ label, index, total, onMove, onDelete }: EntryActionsProps) => (
  <div className="entry-actions" aria-label={`Actions for ${label}`}>
    <Tooltip>
      <TooltipTrigger render={<Button type="button" variant="ghost" size="icon" disabled={index === 0} aria-label={`Move ${label} up`} onClick={() => { onMove(-1) }} />}>
        <RiArrowUpLine aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent>Move up</TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger render={<Button type="button" variant="ghost" size="icon" disabled={index === total - 1} aria-label={`Move ${label} down`} onClick={() => { onMove(1) }} />}>
        <RiArrowDownLine aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent>Move down</TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger render={<Button type="button" variant="destructive" size="icon" aria-label={`Remove ${label}`} onClick={() => { if (window.confirm(`Remove ${label}?`)) onDelete() }} />}>
        <RiDeleteBinLine aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent>Remove</TooltipContent>
    </Tooltip>
  </div>
)
