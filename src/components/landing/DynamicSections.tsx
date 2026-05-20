'use client'

/**
 * Thin Client Component that holds `ssr: false` dynamic imports.
 * Server Components cannot use `ssr: false` directly — this wrapper bridges the gap.
 * Each export can be placed individually in the Server Component page.
 */
import dynamic from 'next/dynamic'

/* Splash screen + custom cursor */
const ClientEffectsLazy = dynamic(
  () => import('./ClientEffects'),
  { ssr: false },
)

/* ContainerScroll 3D (framer-motion useScroll) */
const ContainerScrollLazy = dynamic(
  () => import('./ContainerScrollSection'),
  {
    ssr: false,
    loading: () => <div style={{ minHeight: '820px' }} aria-hidden="true" />,
  },
)

/* Tilt testimonial cards (framer-motion useMotionValue) */
const TiltCardsLazy = dynamic(
  () => import('./TiltCardsSection'),
  {
    ssr: false,
    loading: () => <div style={{ minHeight: '360px' }} aria-hidden="true" />,
  },
)

export function LazyClientEffects()   { return <ClientEffectsLazy /> }
export function LazyContainerScroll() { return <ContainerScrollLazy /> }
export function LazyTiltCards()       { return <TiltCardsLazy /> }
