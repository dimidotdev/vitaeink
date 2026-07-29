import { useLayoutEffect, useRef, useState } from 'react'
import type { ResumeDocument } from '../../domain/resume'
import { ResumeRenderer } from './ResumeRenderer'

interface PreviewPaneProps {
  document: ResumeDocument
  onPageCountChange: (count: number) => void
}

const PAGE_DIMENSIONS = {
  A4: { width: 794, height: 1123 },
  Letter: { width: 816, height: 1056 },
} as const

export const PreviewPane = ({ document, onPageCountChange }: PreviewPaneProps) => {
  const hostRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLElement>(null)
  const [scale, setScale] = useState(1)
  const [scaledHeight, setScaledHeight] = useState<number>(PAGE_DIMENSIONS[document.settings.pageSize].height)
  const dimensions = PAGE_DIMENSIONS[document.settings.pageSize]

  useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) return undefined
    const updateScale = (): void => { setScale(Math.min(1, Math.max(0.3, (host.clientWidth - 32) / dimensions.width))) }
    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(host)
    return () => { observer.disconnect() }
  }, [dimensions.width])

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const page = pageRef.current
      if (!page) return
      const contentHeight = Math.max(page.scrollHeight, dimensions.height)
      setScaledHeight(contentHeight * scale)
      onPageCountChange(Math.max(1, Math.ceil(contentHeight / dimensions.height)))
    })
    return () => { window.cancelAnimationFrame(frame) }
  }, [document, dimensions.height, onPageCountChange, scale])

  return (
    <section className="preview-shell" aria-label="Live resume preview">
      <div className="preview-toolbar no-print"><span>Live preview</span><span>{document.settings.pageSize} · {Math.round(scale * 100)}%</span></div>
      <div className="preview-host" ref={hostRef}>
        <div className="preview-stage" style={{ width: dimensions.width * scale, height: scaledHeight }}>
          <div className="preview-transform" style={{ transform: `scale(${scale})`, width: dimensions.width }}>
            <ResumeRenderer ref={pageRef} document={document} />
          </div>
        </div>
      </div>
      <style media="print">{`@page { size: ${document.settings.pageSize}; margin: 14mm 16mm 15mm; }`}</style>
    </section>
  )
}
