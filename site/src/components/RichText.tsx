import { Fragment } from 'react'

// **bold** and [label](https://…) markers from pt.json/en.json, so emphasis and
// links stay in the text files. Links open in a new tab, and a link inside a
// bold run still renders as a link (the bold content is parsed again).
const TOKEN = /\*\*(.+?)\*\*|\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g

export function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  let last = 0

  for (const match of text.matchAll(TOKEN)) {
    const [token, bold, label, href] = match
    const start = match.index
    if (start > last) parts.push(text.slice(last, start))

    parts.push(
      bold === undefined ? (
        <a
          key={start}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand underline underline-offset-2 transition-colors hover:text-foreground"
        >
          {label}
        </a>
      ) : (
        <strong key={start} className="font-semibold text-foreground">
          <RichText text={bold} />
        </strong>
      ),
    )
    last = start + token.length
  }

  if (last < text.length) parts.push(text.slice(last))

  return parts.map((part, index) => <Fragment key={index}>{part}</Fragment>)
}
