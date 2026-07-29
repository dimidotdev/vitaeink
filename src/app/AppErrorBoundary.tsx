import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RiRestartLine } from '@remixicon/react'
import { Button } from '../components/ui/button'
import { usePreferences } from './usePreferences'

interface Props { children: ReactNode }
interface State { failed: boolean }

const FatalError = () => {
  const { t } = usePreferences()
  return (
    <main className="fatal-error" role="alert">
      <img src="/icons/vitaeink.svg" alt="" width="48" height="48" />
      <h1>{t('error.title')}</h1>
      <p>{t('error.text')}</p>
      <Button type="button" size="lg" onClick={() => { window.location.reload() }}>
        <RiRestartLine aria-hidden="true" /> {t('error.reload')}
      </Button>
    </main>
  )
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[VitaeInk error boundary]', error, info)
  }

  render(): ReactNode {
    if (!this.state.failed) return this.props.children
    return <FatalError />
  }
}
