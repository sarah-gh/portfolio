/**
 * Configuration for the home page WebGL scene.
 * Positions are normalised: x and y go from -1 to 1 across the visible viewport
 * at the object's depth (z), so layouts stay responsive on any screen size.
 */

export type GlyphShape = 'brace_open' | 'brace_close' | 'chevron_left' | 'chevron_right' | 'slash' | 'hash' | 'semicolon' | 'at'
export type PrimitiveShape = 'knot' | 'ico' | 'ring' | 'box'
export type SceneShape = GlyphShape | PrimitiveShape
export type SceneMaterial = 'violet' | 'pink' | 'cyan' | 'chrome' | 'glass'

export interface Pose {
  x: number
  y: number
  z: number
  rx: number
  ry: number
  rz: number
  /** Size multiplier for this section. */
  s: number
}

export interface SceneItem {
  shape: SceneShape
  material: SceneMaterial
  scale: number
  /** Position on first load, around the name. */
  hero: Pick<Pose, 'x' | 'y' | 'z'>
}

/** Sections that drive the scene, matched by `data-scene="<id>"` in the page. */
export const SCENE_SECTIONS = ['hero', 'intro', 'skills', 'experience', 'work', 'contact'] as const
export type SceneSection = typeof SCENE_SECTIONS[number]

/**
 * Seconds the objects need to catch up with the scroll position.
 * Higher = they trail the page more and keep gliding longer after scrolling stops.
 */
export const SCENE_SCRUB = 2.4

/** Share (0–1) of each section-to-section scroll distance during which objects hold still before moving. */
export const SCENE_HOLD = 0.3

/** Object size per section: smaller where there is more text. */
export const SCENE_SCALE: Record<SceneSection, number> = {
  hero: 1,
  intro: 0.8,
  skills: 0.6,
  experience: 0.7,
  work: 0.65,
  contact: 0.75,
}

/** Canvas opacity per section, so text stays readable over busy areas. */
export const SCENE_OPACITY: Record<SceneSection, number> = {
  hero: 1,
  intro: 0.9,
  skills: 0.55,
  experience: 0.5,
  work: 0.4,
  contact: 0.95,
}

export const SCENE_ITEMS: SceneItem[] = [
  { shape: 'brace_open', material: 'violet', scale: 1.6, hero: { x: -0.8, y: 0.58, z: 0 } },
  { shape: 'at', material: 'violet', scale: 0.9, hero: { x: -0.3, y: 0.84, z: -3.5 } },
  { shape: 'slash', material: 'cyan', scale: 1.25, hero: { x: 0.24, y: 0.8, z: -1.5 } },
  { shape: 'knot', material: 'glass', scale: 0.8, hero: { x: 0.74, y: 0.6, z: -1.5 } },
  { shape: 'semicolon', material: 'pink', scale: 1.05, hero: { x: 0.95, y: 0.05, z: -3 } },
  { shape: 'brace_close', material: 'violet', scale: 1.6, hero: { x: 0.78, y: -0.52, z: 0.3 } },
  { shape: 'chevron_right', material: 'cyan', scale: 1, hero: { x: 0.3, y: -0.84, z: -2 } },
  { shape: 'ico', material: 'chrome', scale: 0.8, hero: { x: -0.36, y: -0.8, z: -2.5 } },
  { shape: 'chevron_left', material: 'pink', scale: 1.15, hero: { x: -0.76, y: -0.56, z: 1 } },
  { shape: 'hash', material: 'chrome', scale: 1.1, hero: { x: -0.96, y: 0, z: -2.5 } },
  { shape: 'ring', material: 'chrome', scale: 1.5, hero: { x: 0.6, y: -0.62, z: -9 } },
  { shape: 'box', material: 'violet', scale: 0.9, hero: { x: -0.56, y: 0.5, z: -8 } },
]

/** Small deterministic PRNG so layouts look random but never change between renders. */
function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6D2B79F5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type LayoutFn = (index: number, count: number, random: () => number) => Pick<Pose, 'x' | 'y' | 'z'>

const LAYOUTS: Record<SceneSection, LayoutFn> = {
  hero: i => SCENE_ITEMS[i]!.hero,
  // Drift into a loose cluster on the right, next to the intro statement.
  intro: (i, n, r) => ({ x: 0.62 + r() * 0.36, y: -0.8 + (i / (n - 1)) * 1.6 + (r() - 0.5) * 0.2, z: -1 - r() * 4 }),
  // Orbit ring around the skills grid, pushed back.
  skills: (i, n) => {
    const angle = (i / n) * Math.PI * 2 + 0.3
    return { x: Math.cos(angle) * 0.92, y: Math.sin(angle) * 0.86, z: -6 - (i % 3) * 1.5 }
  },
  // Two columns on the page edges, beside the timeline.
  experience: (i, n, r) => ({ x: i % 2 ? 0.92 : -0.92, y: -0.85 + (Math.floor(i / 2) / (n / 2 - 1)) * 1.7, z: -2 - r() * 2 }),
  // Scatter deep into the background behind the project cards.
  work: (_i, _n, r) => ({ x: r() * 2 - 1, y: r() * 2 - 1, z: -7 - r() * 6 }),
  // Gather into a ring around the contact call-to-action.
  contact: (i, n, r) => {
    const angle = (i / n) * Math.PI * 2
    return { x: Math.cos(angle) * 0.9, y: Math.sin(angle) * 0.84, z: -2.5 - r() * 2.5 }
  },
}

/** Target pose of every item for one section, including its scroll-driven rotation. */
export function sceneLayout(section: SceneSection): Pose[] {
  const step = SCENE_SECTIONS.indexOf(section)
  const random = seeded(step * 97 + 13)
  return SCENE_ITEMS.map((_, i) => {
    const position = LAYOUTS[section](i, SCENE_ITEMS.length, random)
    const direction = i % 2 ? 1 : -1
    // Each section adds a little more rotation, so objects keep turning as the page scrolls.
    return {
      ...position,
      rx: step * Math.PI * (0.35 + random() * 0.4) * direction,
      ry: step * Math.PI * (0.5 + random() * 0.6),
      rz: step * Math.PI * 0.15 * -direction,
      s: SCENE_SCALE[section],
    }
  })
}
