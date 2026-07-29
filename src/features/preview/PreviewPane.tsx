import { useLayoutEffect, useRef, useState } from 'react'
import { RiAddLine, RiFullscreenLine, RiSubtractLine } from '@remixicon/react'
import { Button } from '../../components/ui/button'
import { ScrollHints } from '../../components/ScrollHint'
import { useScrollHints } from '../../components/useScrollHints'
import { usePreferences } from '../../app/usePreferences'
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
  const { t } = usePreferences()
  const { ref: hostRef, scrollState: hostScrollState } = useScrollHints<HTMLDivElement>()
  const pageRef = useRef<HTMLElement>(null)
  const [fitScale, setFitScale] = useState(1)
  const [manualScale, setManualScale] = useState<number>()
  const scale = manualScale ?? fitScale
  const [scaledHeight, setScaledHeight] = useState<number>(PAGE_DIMENSIONS[document.settings.pageSize].height)
  const dimensions = PAGE_DIMENSIONS[document.settings.pageSize]

  useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) return undefined
    const updateScale = (): void => { setFitScale(Math.min(1, Math.max(0.3, (host.clientWidth - 32) / dimensions.width))) }
    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(host)
    return () => { observer.disconnect() }
  }, [dimensions.width, hostRef])

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

  const changeZoom = (delta: number): void => {
    setManualScale(Math.min(1.25, Math.max(0.3, Number((scale + delta).toFixed(2)))))
  }

  return (
    <section className="preview-shell" aria-label={t('preview.aria')}>
      <div className="preview-toolbar no-print">
        <div className="preview-title"><span className="live-dot" aria-hidden="true" /> <span>{t('preview.live')}</span><small>{document.settings.pageSize}</small></div>
        <div className="preview-zoom" role="group" aria-label={t('preview.zoomGroup')}>
          <Button type="button" variant="ghost" size="icon-sm" aria-label={t('preview.zoomOut')} disabled={scale <= 0.3} onClick={() => { changeZoom(-0.1) }}><RiSubtractLine aria-hidden="true" /></Button>
          <button type="button" className="zoom-value" aria-label={t('preview.zoomValue', { percent: Math.round(scale * 100) })} onClick={() => { setManualScale(undefined) }}>{Math.round(scale * 100)}%</button>
          <Button type="button" variant="ghost" size="icon-sm" aria-label={t('preview.zoomIn')} disabled={scale >= 1.25} onClick={() => { changeZoom(0.1) }}><RiAddLine aria-hidden="true" /></Button>
          <Button type="button" variant="ghost" size="icon-sm" aria-label={t('preview.fit')} onClick={() => { setManualScale(undefined) }}><RiFullscreenLine aria-hidden="true" /></Button>
        </div>
      </div>
      <div className="preview-host" ref={hostRef} tabIndex={0}>
        <div className="preview-stage" style={{ width: dimensions.width * scale, height: scaledHeight }}>
          <div className="preview-transform" style={{ transform: `scale(${scale})`, width: dimensions.width }}>
            <ResumeRenderer
              ref={pageRef}
              document={document}
              ariaLabel={t('preview.documentLabel', { name: document.basics.name || t('preview.untitled') })}
              emptyNameLabel={t('preview.yourName')}
            />
          </div>
        </div>
      </div>
      <ScrollHints {...hostScrollState} />
      <style media="print">{`@page { size: ${document.settings.pageSize}; margin: 14mm 16mm 15mm; }`}</style>
    </section>
  )
}
