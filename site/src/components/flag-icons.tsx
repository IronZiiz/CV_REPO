import { cn } from '@/lib/utils'

// Flags drawn inline (filled shapes, unlike the stroked brand-icons), so they look
// the same on every system — emoji flags fall back to two letters on Windows.
// Both use a 3:2 field with a rounded border, as in the education logos' tiles.
function Flag({
  className,
  title,
  children,
}: {
  className?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <svg
      viewBox="0 0 60 42"
      role="img"
      aria-label={title}
      className={cn('h-auto w-12 rounded-md ring-1 ring-black/10 sm:w-14 dark:ring-white/15', className)}
    >
      {children}
    </svg>
  )
}

export function BrazilFlag({ className, title }: { className?: string; title: string }) {
  return (
    <Flag className={className} title={title}>
      <rect width="60" height="42" fill="#009b3a" />
      <path d="M30 4 56 21 30 38 4 21Z" fill="#fedf00" />
      <circle cx="30" cy="21" r="9.5" fill="#002776" />
      {/* The band across the globe, clipped to the circle. */}
      <clipPath id="flag-br-globe">
        <circle cx="30" cy="21" r="9.5" />
      </clipPath>
      <path
        d="M20 23.4c6.4-2.1 13.4-1.6 19.6 1.3"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        clipPath="url(#flag-br-globe)"
      />
    </Flag>
  )
}

export function UsaFlag({ className, title }: { className?: string; title: string }) {
  // 13 stripes, red first; the canton covers the top 7.
  const stripes = Array.from({ length: 13 }, (_, i) => i)
  return (
    <Flag className={className} title={title}>
      <rect width="60" height="42" fill="#fff" />
      {stripes.map((i) =>
        i % 2 === 0 ? (
          <rect key={i} y={(i * 42) / 13} width="60" height={42 / 13} fill="#b22234" />
        ) : null,
      )}
      <rect width="24" height={(42 / 13) * 7} fill="#3c3b6e" />
      {/* Stars as a simple 5×4 grid: at this size, exact 50-star rows read as noise. */}
      {Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={2.8 + col * 4.6}
            cy={2.6 + row * 5.2}
            r="1.15"
            fill="#fff"
          />
        )),
      )}
    </Flag>
  )
}
