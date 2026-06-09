const SESSION_KEY = 'adalat-active-session-id'

export function getSessionId(): string {
  const stored = sessionStorage.getItem(SESSION_KEY)
  if (stored) return stored
  const id = crypto.randomUUID()
  sessionStorage.setItem(SESSION_KEY, id)
  return id
}

export function setActiveSessionId(sessionId: string): void {
  sessionStorage.setItem(SESSION_KEY, sessionId)
}

export function clearActiveSessionId(): void {
  sessionStorage.removeItem(SESSION_KEY)
}
