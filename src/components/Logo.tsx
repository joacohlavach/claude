interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 44, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="GymApp"
    >
      <defs>
        <linearGradient id="gymapp-badge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="gymapp-g" gradientUnits="userSpaceOnUse" x1="32" y1="12" x2="32" y2="38">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="100%" stopColor="#f4f4f5" />
        </linearGradient>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="18" fill="url(#gymapp-badge)" />
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="18"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
      />
      <rect x="4" y="4" width="56" height="20" rx="16" fill="rgba(255,255,255,0.15)" />

      <path
        d="M 39.96 16.64 A 13 13 0 1 0 39.96 33.36"
        fill="none"
        stroke="url(#gymapp-g)"
        strokeWidth="6.2"
        strokeLinecap="round"
      />
      <path d="M 41 25 L 30 25" fill="none" stroke="url(#gymapp-g)" strokeWidth="6.2" strokeLinecap="round" />
    </svg>
  )
}
