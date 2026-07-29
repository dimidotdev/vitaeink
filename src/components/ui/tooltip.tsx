import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import { cn } from '@/lib/utils'

const TooltipProvider = ({ delay = 350, ...props }: TooltipPrimitive.Provider.Props) => <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />
const Tooltip = (props: TooltipPrimitive.Root.Props) => <TooltipPrimitive.Root data-slot="tooltip" {...props} />
const TooltipTrigger = (props: TooltipPrimitive.Trigger.Props) => <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />

const TooltipContent = ({ className, side = 'top', sideOffset = 6, align = 'center', alignOffset = 0, children, ...props }: TooltipPrimitive.Popup.Props & Pick<TooltipPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Positioner align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset} className="isolate z-50">
      <TooltipPrimitive.Popup data-slot="tooltip-content" className={cn('no-print z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95', className)} {...props}>
        {children}
        <TooltipPrimitive.Arrow className="z-50 size-2.5 rotate-45 rounded-[2px] bg-foreground fill-foreground" />
      </TooltipPrimitive.Popup>
    </TooltipPrimitive.Positioner>
  </TooltipPrimitive.Portal>
)

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
