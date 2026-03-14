import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

const isLocalhost = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
const isStandaloneApp = typeof window !== 'undefined' && (
  window.matchMedia?.('(display-mode: standalone)').matches ||
  window.navigator.standalone === true
)

if (isLocalhost && isStandaloneApp) {
  const chatStorageVersion = 'chat-storage-version'
  const expectedVersion = '3'
  const currentVersion = window.localStorage.getItem(chatStorageVersion)

  if (currentVersion !== expectedVersion) {
    Object.keys(window.localStorage).forEach((key) => {
      if (
        key.startsWith('lastSeen_') ||
        key.startsWith('lastSeenServer_') ||
        key.startsWith('lastMessageTs_') ||
        key.startsWith('chatBaseline_')
      ) {
        window.localStorage.removeItem(key)
      }
    })

    window.localStorage.setItem(chatStorageVersion, expectedVersion)
  }
}

if (isLocalhost && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister())
  })

  if ('caches' in window) {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key))
    })
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
