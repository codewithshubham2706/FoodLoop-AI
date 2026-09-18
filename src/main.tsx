import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import RouterBase from './components/RouterBase'
import { BASE_PATH } from './lib/env'

// Gate all entrance animations behind a JS-detection class (see the Motion
// section of index.css): without JavaScript, content is never hidden.
document.documentElement.classList.add('js')

// GitHub Pages 404 handoff: public/404.html records the intended path in
// sessionStorage before redirecting to the app root — restore it here so the
// router renders the deep-linked route (subpath deploys only).
if (BASE_PATH && typeof sessionStorage !== 'undefined') {
  const handoff = sessionStorage.getItem('fl-redirect')
  if (handoff && handoff.startsWith('/') && handoff !== '/') {
    sessionStorage.removeItem('fl-redirect')
    history.replaceState(null, '', `${BASE_PATH}${handoff}`)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterBase>
      <App />
    </RouterBase>
  </StrictMode>,
)
