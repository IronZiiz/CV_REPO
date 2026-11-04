import portrait from '@/assets/img/portrait.jpg'
import { GlowCard } from '@/components/ui/glow-card'

// Photo in a frame like the Stack cards (surface, thin border, cursor light),
// with a static 1px brand-coloured ring around its edge (.portrait-ring in index.css)
// and half their drop shadow (.portrait-card).
export function PortraitFrame({ alt }: { alt: string }) {
  return (
    <GlowCard
      backdrop={<span aria-hidden="true" className="portrait-ring" />}
      className="portrait-card w-[clamp(104px,11vw,176px)] shrink-0 rounded-[clamp(10px,1vw,16px)] border-brand/30 p-[clamp(5px,0.5vw,8px)]"
    >
      <img
        src={portrait}
        alt={alt}
        width={540}
        height={500}
        className="aspect-square w-full rounded-[clamp(6px,0.7vw,11px)] object-cover"
      />
    </GlowCard>
  )
}
