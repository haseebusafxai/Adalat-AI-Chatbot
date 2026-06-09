interface LogoProps {
  size?: 'sm' | 'lg'
  showTagline?: boolean
  compact?: boolean
}

export function Logo({
  size = 'lg',
  showTagline = true,
  compact = false,
}: LogoProps) {
  const iconSize = compact ? 56 : size === 'lg' ? 72 : 48

  return (
    <div
      className={`flex flex-col items-center text-center ${compact ? 'gap-2' : 'gap-3'}`}
    >
      <div
        className="logo-mark relative flex items-center justify-center rounded-2xl bg-adalat-green shadow-md"
        style={{
          width: iconSize + (compact ? 16 : 24),
          height: iconSize + (compact ? 16 : 24),
        }}
        aria-hidden
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="40"
            cy="40"
            r="28"
            stroke="#c9a227"
            strokeWidth="1.5"
            opacity="0.45"
          />
          <path
            d="M40 14v52M22 28h36M24 40h32M26 52h28"
            stroke="#c9a227"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M18 58c6-8 14-12 22-12s16 4 22 12"
            stroke="#f7f3eb"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx="40" cy="14" r="3" fill="#c9a227" />
        </svg>
        <span className="absolute -bottom-1 -right-1 rounded-md bg-adalat-gold px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-adalat-green">
          PK
        </span>
      </div>

      <div>
        <h1
          className={
            compact
              ? 'font-display text-3xl font-bold tracking-tight text-adalat-green sm:text-4xl'
              : size === 'lg'
                ? 'font-display text-4xl font-bold tracking-tight text-adalat-green sm:text-5xl'
                : 'font-display text-2xl font-bold text-adalat-green'
          }
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Adalat <span className="text-adalat-gold">AI</span>
        </h1>
        {showTagline && (
          <p className={compact ? 'logo-tagline logo-tagline--compact' : 'logo-tagline'}>
            The authoritative assistant for Pakistan&apos;s Constitution, Penal
            Code, and Criminal Procedure
          </p>
        )}
      </div>
    </div>
  )
}
