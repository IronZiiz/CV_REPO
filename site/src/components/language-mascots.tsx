import { cn } from '@/lib/utils'

// Decorative heads that peek out from behind the Línguas cards on hover: a toco
// toucan for Portuguese (facing left) and a bald eagle for English (facing right).
// Drawn inline, filled like flag-icons; the neck end of each sits behind the card.
function Mascot({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 120 80" aria-hidden="true" className={cn('h-[72px] w-auto overflow-visible', className)}>
      {children}
    </svg>
  )
}

export function ToucanHead({ className }: { className?: string }) {
  return (
    <Mascot className={className}>
      <defs>
        <linearGradient id="toucan-beak" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#f59e0b" />
          <stop offset="0.55" stopColor="#f97316" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      {/* Head and neck, black; a faint rim keeps it visible on the dark theme. */}
      <path
        d="M120 8 L94 10 C72 10 60 26 61 42 C62 58 76 71 96 71 L120 73 Z"
        fill="#111827"
        className="stroke-transparent dark:stroke-white/30"
        strokeWidth="1.2"
      />
      {/* White throat bib. */}
      <path d="M63 50 C64 62 76 70 90 68 C81 62 74 54 71 45 Z" fill="#fef9c3" />
      {/* The big beak, with the seam and the black tip. */}
      <path d="M64 23 C40 16 15 22 6 37 C4 41 6 45 10 45 C30 47 47 50 64 55 Z" fill="url(#toucan-beak)" />
      <path d="M63 40 C45 38 26 39 9 42" fill="none" stroke="#9a3412" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <path d="M6 37 C4 41 6 45 10 45 L19 45.6 C16 40 16 33 19 28 C13 30 8 33 6 37 Z" fill="#111827" />
      <path d="M64 23 C55 21 48 21 40 22" fill="none" stroke="#fde68a" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      {/* Orange eye skin, blue ring, pupil and a catch-light. */}
      <ellipse cx="75" cy="33" rx="8" ry="6.5" fill="#fb923c" />
      <circle cx="75" cy="33" r="4" fill="#111827" stroke="#2563eb" strokeWidth="1.6" />
      <circle cx="76.4" cy="31.8" r="1.1" fill="#fff" />
    </Mascot>
  )
}

export function EagleHead({ className }: { className?: string }) {
  return (
    <Mascot className={className}>
      {/* Brown neck, behind the white head. */}
      <path d="M0 10 L30 12 C36 36 36 58 28 76 L0 78 Z" fill="#5b3a1e" />
      {/* White head with a feathered lower edge. */}
      <path
        d="M22 14 C38 3 66 7 77 23 C81 31 81 42 75 50 C67 60 51 66 37 70 L31 64 L35 60 L26 58 L31 52 L22 50 C17 36 15 22 22 14 Z"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="1"
      />
      {/* Hooked yellow beak, with the mouth line and nostril. */}
      <path d="M72 25 C85 21 97 26 101 36 C103 42 101 48 96 51 C96 46 94 43 90 42 C84 44 78 46 71 46 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
      <path d="M71 41 C78 41 85 40 91 41" fill="none" stroke="#b45309" strokeWidth="1.1" strokeLinecap="round" />
      <ellipse cx="82" cy="31" rx="2" ry="1.2" fill="#92400e" />
      {/* Stern brow over a pale yellow eye. */}
      <circle cx="62" cy="30" r="3.6" fill="#fde047" />
      <circle cx="62.6" cy="30.2" r="1.7" fill="#111827" />
      <path d="M52 28 C58 22 67 22 74 27" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" />
    </Mascot>
  )
}
