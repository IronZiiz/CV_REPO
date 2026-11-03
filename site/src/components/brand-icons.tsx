import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

// lucide v1 dropped brand icons, so these are drawn inline in the same stroke style.
function StrokeIcon({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('size-full', className)}
    >
      {children}
    </svg>
  )
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <StrokeIcon className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </StrokeIcon>
  )
}

export function LinkedinIcon({ className }: { className?: string }) {
  return (
    <StrokeIcon className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </StrokeIcon>
  )
}

export function OrcidIcon({ className }: { className?: string }) {
  return (
    <StrokeIcon className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="8.5" x2="8.5" y1="10.5" y2="16.5" />
      <line x1="8.5" x2="8.51" y1="7.5" y2="7.5" />
      <path d="M11.5 10.5h1.75a3 3 0 0 1 0 6H11.5z" />
    </StrokeIcon>
  )
}

export function YoutubeIcon({ className }: { className?: string }) {
  return (
    <StrokeIcon className={className}>
      <path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </StrokeIcon>
  )
}

export function GithubIcon({ className }: { className?: string }) {
  return (
    <StrokeIcon className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </StrokeIcon>
  )
}
