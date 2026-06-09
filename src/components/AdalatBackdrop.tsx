/** Decorative animated background — shared on welcome & chat shells */
export function AdalatBackdrop() {
  return (
    <div className="adalat-backdrop" aria-hidden>
      <div className="adalat-backdrop-gradient" />
      <span className="adalat-orb adalat-orb--1" />
      <span className="adalat-orb adalat-orb--2" />
      <span className="adalat-orb adalat-orb--3" />
      <div className="adalat-watermark">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="60"
            cy="60"
            r="48"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.35"
          />
          <path
            d="M60 24v72M36 42h48M38 60h44M40 78h40"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      </div>
      <div className="adalat-backdrop-shine" />
    </div>
  )
}
