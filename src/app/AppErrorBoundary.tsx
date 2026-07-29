import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { failed: boolean }

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
    return (
      <main className="fatal-error" role="alert">
        <img src="/icons/vitaeink.svg" alt="" width="48" height="48" />
        <h1>VitaeInk needs a fresh start</h1>
        <p>Your saved resume remains in this browser. Reload the page to try again.</p>
        <button type="button" className="button button-primary" onClick={() => { window.location.reload() }}>
          Reload VitaeInk
        </button>
      </main>
    )
  }
}
