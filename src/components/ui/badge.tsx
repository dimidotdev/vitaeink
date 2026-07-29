import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive/10 text-destructive',
        outline: 'border-border text-foreground',
        ghost: 'text-muted-foreground hover:bg-muted',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

const Badge = ({ className, variant = 'default', render, ...props }: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) => useRender({
  defaultTagName: 'span',
  props: mergeProps<'span'>({ className: cn(badgeVariants({ variant }), className) }, props),
  render,
  state: { slot: 'badge', variant },
})

export { Badge }
