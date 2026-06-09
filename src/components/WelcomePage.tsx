import { ChatInput } from './ChatInput'
import { ExampleQueries } from './ExampleQueries'
import { Logo } from './Logo'

interface WelcomePageProps {
  input: string
  onInputChange: (value: string) => void
  onSubmit: () => void
  onExampleSelect: (query: string) => void
  isLoading: boolean
}

export function WelcomePage({
  input,
  onInputChange,
  onSubmit,
  onExampleSelect,
  isLoading,
}: WelcomePageProps) {
  return (
    <div className="welcome-panel">
      <header className="welcome-header welcome-animate welcome-animate--1">
        <Logo size="lg" compact />
        <div className="welcome-badges">
          {['Constitution 1973', 'PPC', 'CrPC', 'EN · UR · PS'].map((badge) => (
            <span key={badge} className="welcome-badge">
              {badge}
            </span>
          ))}
        </div>
        <p className="welcome-lead">
          Structured legal intelligence on bail, FIR, arrest safeguards, and
          fundamental rights — in the language you ask in.
        </p>
      </header>

      <section
        className="welcome-center welcome-animate welcome-animate--2"
        aria-label="Example questions"
      >
        <ExampleQueries onSelect={onExampleSelect} disabled={isLoading} />
      </section>

      <footer className="welcome-footer welcome-animate welcome-animate--3">
        <ChatInput
          value={input}
          onChange={onInputChange}
          onSubmit={onSubmit}
          disabled={isLoading}
          autoFocus
          variant="welcome"
        />
        <p className="welcome-disclaimer">
          General information only — not formal legal advice. Consult a licensed
          advocate for your matter.
        </p>
      </footer>
    </div>
  )
}
