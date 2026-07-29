import '@fontsource-variable/ibm-plex-sans'
import '@fontsource-variable/inter'
import '@fontsource-variable/source-serif-4'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { AppErrorBoundary } from './app/AppErrorBoundary'
import { TooltipProvider } from './components/ui/tooltip'
import './styles/shadcn.css'
import './styles/tokens.css'
import './styles/global.css'
import './styles/layout.css'
import './styles/editor.css'
import './styles/resume.css'
import './styles/print.css'

const root = window.document.getElementById('root')
if (!root) throw new Error('Application root was not found.')

createRoot(root).render(
  <StrictMode>
    <AppErrorBoundary>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </AppErrorBoundary>
  </StrictMode>,
)
