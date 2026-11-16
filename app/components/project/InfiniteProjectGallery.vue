<script setup lang="ts">
import type { ProjectPreview } from '#shared/types/project'

const props = defineProps<{ projects: ProjectPreview[] }>()
const viewport = useTemplateRef<HTMLElement>('viewport')
const plane = useTemplateRef<HTMLElement>('plane')
const tiles = useTemplateRef<HTMLElement>('tiles')
const size = reactive({ width: 0, height: 0 })
const tileWidth = 340
const tileHeight = 232
const periodX = tileWidth * Math.max(1, props.projects.length)
// The tile pattern repeats every PATTERN_ROWS rows (even, so the sideways row offset lines up).
const PATTERN_ROWS = 4
const periodY = tileHeight * PATTERN_ROWS
const pattern = computed(() => createTilePattern(props.projects.length, PATTERN_ROWS))
const rows = computed(() => Math.ceil((size.height + size.width * 0.16) / tileHeight) + PATTERN_ROWS + 4)
const columns = computed(() => Math.ceil((size.width + size.height * 0.16) / tileWidth) + props.projects.length + 3)

// ---- motion (ported from PixiFinalV3) ----
// Wheel and drag only move a target; the gallery eases toward it every frame,
// so it starts softly and glides to a stop instead of moving stiffly.
const EASING = 0.02 // share of the remaining distance covered per 60fps frame
const MAX_SPEED = 30 // px, cap per wheel event
const WHEEL_FACTOR = 0.5
const DRAG_FACTOR = 2
const CLICK_THRESHOLD = 6 // px of movement after which a press counts as a drag
const INITIAL_SCROLL_Y = -500 // intro glide on mount
const PLANE_ROTATION = 4 // deg, matches the tilted layout

// ---- drag zoom (ported from PixiFinalV3) ----
// While dragging, the whole plane zooms in slightly around its centre, like a sheet
// being lifted. Zoom never goes below 1, so the edges always stay covered.
const DRAG_ZOOM = 1.2
const ZOOM_IN_TIME = 820 // ms to lift
const ZOOM_OUT_TIME = 1080 // ms to settle back

const reduced = import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const target = { x: 0, y: 0 }
const current = { x: 0, y: reduced ? 0 : INITIAL_SCROLL_Y }
let zoom = 1
let frame = 0
let lastTime = 0
let observer: ResizeObserver | undefined
let gesture: { id: number, x: number, y: number, startX: number, startY: number } | undefined
let dragged = false

function wrap(value: number, period: number) {
  return ((value % period) + period) % period
}

function clampSpeed(value: number) {
  return Math.abs(value) > MAX_SPEED ? MAX_SPEED * Math.sign(value) : value
}

/** Writes the current position and zoom straight to the DOM (no Vue re-render per frame). */
function render() {
  const x = wrap(-current.x, periodX) - periodX - 40
  const y = wrap(-current.y, periodY) - periodY - 40
  if (tiles.value) tiles.value.style.transform = `translate3d(${x}px, ${y}px, 0)`
  if (plane.value) plane.value.style.transform = `rotate(${PLANE_ROTATION}deg) scale(${zoom})`
}

function tick(time: number) {
  const dt = lastTime ? Math.min(time - lastTime, 64) : 16.67
  lastTime = time

  // Frame-rate independent version of `current += (target - current) * EASING`.
  const ease = reduced ? 1 : 1 - (1 - EASING) ** (dt / 16.67)
  current.x += (target.x - current.x) * ease
  current.y += (target.y - current.y) * ease

  const zoomTarget = gesture && dragged && !reduced ? DRAG_ZOOM : 1
  if (zoom !== zoomTarget) {
    const duration = zoomTarget > zoom ? ZOOM_IN_TIME : ZOOM_OUT_TIME
    zoom += (zoomTarget - zoom) * (1 - Math.exp(-dt / (duration / 3)))
    if (Math.abs(zoomTarget - zoom) < 0.0002) zoom = zoomTarget
  }

  render()

  const settled = Math.abs(target.x - current.x) < 0.05 && Math.abs(target.y - current.y) < 0.05 && zoom === zoomTarget
  if (settled && !gesture) {
    current.x = target.x
    current.y = target.y
    render()
    frame = 0
    lastTime = 0
    return
  }
  frame = requestAnimationFrame(tick)
}

/** Starts the loop if it is not running; it stops by itself once everything settles. */
function kick() {
  if (!frame) frame = requestAnimationFrame(tick)
}

function wheel(event: WheelEvent) {
  if (event.ctrlKey || event.metaKey) return
  event.preventDefault()
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? size.height : 1
  target.x += clampSpeed(event.deltaX * unit * WHEEL_FACTOR)
  target.y += clampSpeed(event.deltaY * unit * WHEEL_FACTOR)
  kick()
}

function start(event: PointerEvent) {
  if (!event.isPrimary || event.button !== 0) return
  dragged = false
  gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY }
}

function move(event: PointerEvent) {
  if (!gesture || gesture.id !== event.pointerId) return
  if (!dragged && Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY) < CLICK_THRESHOLD) return
  if (!dragged) viewport.value?.setPointerCapture(event.pointerId)
  dragged = true
  target.x -= (event.clientX - gesture.x) * DRAG_FACTOR
  target.y -= (event.clientY - gesture.y) * DRAG_FACTOR
  gesture.x = event.clientX
  gesture.y = event.clientY
  kick()
}

function stop() {
  gesture = undefined
  kick() // let the zoom settle back
}

function open(event: MouseEvent, slug: string) {
  if (!dragged) return navigateTo(`/projects/${slug}`)
  event.preventDefault()
}

/** Project shown at a grid cell; neighbours never repeat (see utils/tile-pattern.ts). */
function projectAt(column: number, row: number) {
  const n = props.projects.length
  const index = pattern.value[row % PATTERN_ROWS]?.[column % n] ?? column % n
  return props.projects[index]!
}

// The plane only renders once the size is known; draw it and start the intro glide.
watch(tiles, (el) => {
  if (el) {
    render()
    kick()
  }
}, { flush: 'post' })

onMounted(() => {
  if (!viewport.value) return
  observer = new ResizeObserver(([entry]) => {
    if (!entry) return
    size.width = entry.contentRect.width
    size.height = entry.contentRect.height
  })
  observer.observe(viewport.value)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
})
</script>

<template>
  <div
    ref="viewport"
    class="gallery"
    aria-hidden="true"
    @wheel="wheel"
    @pointerdown="start"
    @pointermove="move"
    @pointerup="stop"
    @pointercancel="stop"
    @lostpointercapture="stop"
    @dragstart.prevent
  >
    <div
      v-if="size.width && projects.length"
      ref="plane"
      class="gallery__plane"
      :style="{ '--gallery-width': `${size.width}px`, '--gallery-height': `${size.height}px` }"
    >
      <div
        ref="tiles"
        class="gallery__tiles"
      >
        <div
          v-for="row in rows"
          :key="row"
          class="gallery__row"
          :class="{ 'gallery__row--offset': row % 2 === 0 }"
        >
          <button
            v-for="column in columns"
            :key="column"
            type="button"
            tabindex="-1"
            class="gallery__tile"
            :class="`gallery__tile--${projectAt(column, row).slug}`"
            @click="open($event, projectAt(column, row).slug)"
          >
            <img
              v-if="projectAt(column, row).cover"
              :src="projectAt(column, row).cover"
              alt=""
              draggable="false"
            >
            <span v-else>{{ projectAt(column, row).title }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery { position: absolute; inset: 0; overflow: hidden; cursor: grab; touch-action: none; user-select: none; }
.gallery:active { cursor: grabbing; }
.gallery__plane { position: absolute; inset: calc(var(--gallery-width, 0px) * -.08) calc(var(--gallery-height, 0px) * -.08); transform: rotate(4deg); will-change: transform; }
.gallery__tiles { position: absolute; top: 0; left: 0; will-change: transform; }
.gallery__row { display: flex; width: max-content; gap: 12px; height: 232px; }
.gallery__row--offset { margin-left: 108px; }
.gallery__tile {
  display: grid; place-items: end start; flex: 0 0 328px; height: 220px; overflow: hidden;
  border: 1px solid #ffffff30; border-radius: .85rem; background: linear-gradient(145deg, #2d2855, #141227);
  padding: 0; color: #fff; text-align: left; font: inherit; cursor: inherit;
}
.gallery__tile:hover { border-color: #d6b3ff; }
.gallery__tile span { padding: 1.2rem; font-size: 1.3rem; font-weight: 650; }
.gallery__tile img { width: 100%; height: 100%; object-fit: contain; background: #10161b; }
.gallery__tile--interactive-site-plan { background: linear-gradient(145deg, #163547, #161b40); }
.gallery__tile--risk-analysis-dashboards { background: linear-gradient(145deg, #4b2250, #21182f); }
</style>
