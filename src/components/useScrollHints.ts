import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react'

export interface ScrollState {
  canScrollUp: boolean
  canScrollDown: boolean
}

const INITIAL_SCROLL_STATE: ScrollState = { canScrollUp: false, canScrollDown: false }

export const useScrollHints = <T extends HTMLElement>(): { ref: RefObject<T | null>; scrollState: ScrollState } => {
  const ref = useRef<T>(null)
  const [scrollState, setScrollState] = useState(INITIAL_SCROLL_STATE)

  const update = useCallback((): void => {
    const node = ref.current
    if (!node) return
    const maxScrollTop = Math.max(0, node.scrollHeight - node.clientHeight)
    const next = {
      canScrollUp: node.scrollTop > 4,
      canScrollDown: maxScrollTop - node.scrollTop > 4,
    }
    setScrollState((current) => current.canScrollUp === next.canScrollUp && current.canScrollDown === next.canScrollDown ? current : next)
  }, [])

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const frame = window.requestAnimationFrame(update)
    node.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    const resizeObserver = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update)
    resizeObserver?.observe(node)
    const mutationObserver = typeof MutationObserver === 'undefined' ? undefined : new MutationObserver(update)
    mutationObserver?.observe(node, { childList: true, subtree: true, characterData: true, attributes: true })

    return () => {
      window.cancelAnimationFrame(frame)
      node.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()
    }
  }, [update])

  return { ref, scrollState }
}
