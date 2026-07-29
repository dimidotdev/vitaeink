import { RiArrowDownSLine, RiArrowUpSLine } from '@remixicon/react'
import type { ScrollState } from './useScrollHints'

export const ScrollHints = ({ canScrollUp, canScrollDown }: ScrollState) => (
  <div className="scroll-hints no-print" aria-hidden="true">
    <span className="scroll-hint scroll-hint-top" data-visible={canScrollUp || undefined}><RiArrowUpSLine /></span>
    <span className="scroll-hint scroll-hint-bottom" data-visible={canScrollDown || undefined}><RiArrowDownSLine /></span>
  </div>
)
