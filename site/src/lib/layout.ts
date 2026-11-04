// Page grid shared by the header, the hero and the Sobre panels: 12 columns,
// centred with margin auto, 32px gutter (gap-x-8).
export const PAGE_GRID = 'mx-auto grid w-full max-w-7xl grid-cols-12 gap-x-8 px-4 sm:px-8'

// The Sobre sections, in header order. Each one is shown as its own panel.
export const ABOUT_PANELS = ['whoAmI', 'stack', 'education', 'languages', 'contact'] as const

export type AboutPanel = (typeof ABOUT_PANELS)[number]
