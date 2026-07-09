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
        <linearGradient id="gymapp-g" gradientUnits="userSpaceOnUse" x1="19" y1="19" x2="45" y2="45">
          <stop offset="0%" stopColor="#e2895a" />
          <stop offset="55%" stopColor="#d97a44" />
          <stop offset="100%" stopColor="#a85128" />
        </linearGradient>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="16" fill="#101010" />

      <path
        d="M 41.96 23.64 A 13 13 0 1 0 41.96 40.36"
        fill="none"
        stroke="url(#gymapp-g)"
        strokeWidth="6.4"
        strokeLinecap="round"
      />
      <path d="M 43 32 L 32 32" fill="none" stroke="url(#gymapp-g)" strokeWidth="6.4" strokeLinecap="round" />
    </svg>
  )
}
