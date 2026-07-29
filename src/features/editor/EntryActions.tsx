import { RiArrowDownLine, RiArrowUpLine, RiDeleteBinLine } from '@remixicon/react'
import { usePreferences } from '../../app/usePreferences'
import { Button } from '../../components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip'

interface EntryActionsProps {
  label: string
  index: number
  total: number
  onMove: (direction: -1 | 1) => void
  onDelete: () => void
}

export const EntryActions = ({ label, index, total, onMove, onDelete }: EntryActionsProps) => {
  const { t } = usePreferences()

  return (
    <div className="entry-actions" aria-label={t('actions.for', { label })}>
      <Tooltip>
        <TooltipTrigger render={<Button type="button" variant="ghost" size="icon" disabled={index === 0} aria-label={t('actions.moveUp', { label })} onClick={() => { onMove(-1) }} />}>
          <RiArrowUpLine aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent>{t('actions.moveUpShort')}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button type="button" variant="ghost" size="icon" disabled={index === total - 1} aria-label={t('actions.moveDown', { label })} onClick={() => { onMove(1) }} />}>
          <RiArrowDownLine aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent>{t('actions.moveDownShort')}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button type="button" variant="destructive" size="icon" aria-label={t('actions.remove', { label })} onClick={() => { if (window.confirm(t('actions.removeConfirm', { label }))) onDelete() }} />}>
          <RiDeleteBinLine aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent>{t('actions.removeShort')}</TooltipContent>
      </Tooltip>
    </div>
  )
}
