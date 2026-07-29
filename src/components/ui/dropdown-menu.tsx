import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const DropdownMenu = (props: MenuPrimitive.Root.Props) => <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
const DropdownMenuTrigger = (props: MenuPrimitive.Trigger.Props) => <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />

const DropdownMenuContent = ({ align = 'start', alignOffset = 0, side = 'bottom', sideOffset = 6, className, ...props }: MenuPrimitive.Popup.Props & Pick<MenuPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>) => (
  <MenuPrimitive.Portal>
    <MenuPrimitive.Positioner role="region" aria-label="Document actions" className="isolate z-50 outline-none" align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset}>
      <MenuPrimitive.Popup
        data-slot="dropdown-menu-content"
        className={cn('no-print relative z-50 max-h-(--available-height) w-(--anchor-width) min-w-52 origin-(--transform-origin) overflow-x-hidden overflow-y-auto overscroll-contain rounded-lg bg-popover/75 p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 outline-none before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95', className)}
        {...props}
      />
    </MenuPrimitive.Positioner>
  </MenuPrimitive.Portal>
)

const DropdownMenuLabel = ({ className, ...props }: ComponentProps<'div'>) => (
  <div data-slot="dropdown-menu-label" aria-hidden="true" className={cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', className)} {...props} />
)

const DropdownMenuItem = ({ className, variant = 'default', ...props }: MenuPrimitive.Item.Props & { variant?: 'default' | 'destructive' }) => (
  <MenuPrimitive.Item
    data-slot="dropdown-menu-item"
    data-variant={variant}
    className={cn('group/dropdown-menu-item relative flex min-h-11 cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none data-highlighted:bg-foreground/8 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0', variant === 'destructive' && 'text-destructive data-highlighted:bg-destructive/10', className)}
    {...props}
  />
)

const DropdownMenuSeparator = ({ className, ...props }: MenuPrimitive.Separator.Props) => (
  <MenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
)

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator }
