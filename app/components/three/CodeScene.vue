<script setup lang="ts">
/**
 * Full-screen WebGL background for the home page.
 * - Idle: every object slowly spins and floats, so the page never feels static.
 * - Scroll: a scrubbed GSAP timeline moves objects between per-section layouts
 *   (see constants/scene.ts); scroll speed briefly boosts the spin.
 * - Pointer: subtle camera parallax, and objects under the cursor get a spin kick.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import {
  SCENE_ITEMS,
  SCENE_OPACITY,
  SCENE_HOLD,
  SCENE_SCRUB,
  SCENE_SECTIONS,
  sceneLayout,
  type PrimitiveShape,
  type SceneMaterial,
  type Pose,
} from '~/constants/scene'

// Client-only: render it inside <ClientOnly> (WebGL needs the browser).
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

interface LiveItem {
  group: THREE.Group
  mesh: THREE.Mesh | null
  pose: Pose
  scale: number
  /** 0 → 1 entrance progress. */
  intro: number
  spin: THREE.Vector3
  angle: THREE.Vector3
  kick: number
  float: { amp: number, speed: number, phase: number }
}

const CAMERA_Z = 10
const FOV = 35

let renderer: THREE.WebGLRenderer | undefined
let cleanup: (() => void) | undefined

onMounted(() => {
  if (!canvas.value) return
  try {
    cleanup = createScene(canvas.value)
  }
  catch (error) {
    // No WebGL: the CSS background stays, the page still works.
    console.warn('[CodeScene] WebGL unavailable', error)
  }
})

onBeforeUnmount(() => cleanup?.())

function createScene(el: HTMLCanvasElement) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60)
  camera.position.set(0, 0, CAMERA_Z)

  // Lighting: soft studio environment for reflections + the brand-coloured key lights.
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envMap
  const lights: [number, number, THREE.Vector3Tuple][] = [
    [0x7c4dff, 3.2, [-6, 4, 5]],
    [0x38c8ff, 2.4, [6, 1, 3]],
    [0xff4f9a, 2.2, [-1, -5, 2]],
  ]
  for (const [color, intensity, position] of lights) {
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(...position)
    scene.add(light)
  }

  const materials: Record<SceneMaterial, THREE.MeshPhysicalMaterial> = {
    violet: new THREE.MeshPhysicalMaterial({ color: 0x6a3dff, metalness: 0.6, roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.12, iridescence: 0.45, iridescenceIOR: 1.3 }),
    pink: new THREE.MeshPhysicalMaterial({ color: 0xff4f9a, metalness: 0.45, roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.1 }),
    cyan: new THREE.MeshPhysicalMaterial({ color: 0x38c8ff, metalness: 0.5, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.1 }),
    chrome: new THREE.MeshPhysicalMaterial({ color: 0xd8d0ff, metalness: 1, roughness: 0.14, flatShading: true }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.06, transmission: 1, thickness: 1.4, ior: 1.45, iridescence: 1, iridescenceIOR: 1.25, envMapIntensity: 1.6 }),
  }

  const primitives: Record<PrimitiveShape, () => THREE.BufferGeometry> = {
    knot: () => new THREE.TorusKnotGeometry(0.55, 0.19, 220, 32),
    ico: () => new THREE.IcosahedronGeometry(0.75, 0),
    ring: () => new THREE.TorusGeometry(1.25, 0.05, 24, 180),
    box: () => new RoundedBoxGeometry(1, 1, 1, 6, 0.18),
  }

  // --- Items -------------------------------------------------------------
  const random = (min: number, max: number) => min + Math.random() * (max - min)
  const items: LiveItem[] = SCENE_ITEMS.map((config) => {
    const group = new THREE.Group()
    scene.add(group)
    return {
      group,
      mesh: null,
      pose: { ...config.hero, rx: 0, ry: 0, rz: 0, s: 1 },
      scale: config.scale,
      intro: reduced ? 1 : 0,
      spin: new THREE.Vector3(random(0.05, 0.22), random(0.08, 0.3), random(-0.06, 0.06)).multiplyScalar(Math.random() > 0.5 ? 1 : -1),
      angle: new THREE.Vector3(random(-0.4, 0.4), random(-0.6, 0.6), random(-0.3, 0.3)),
      kick: 0,
      float: { amp: random(0.08, 0.2), speed: random(0.35, 0.7), phase: random(0, Math.PI * 2) },
    }
  })

  function attach(item: LiveItem, geometry: THREE.BufferGeometry, material: THREE.Material) {
    const mesh = new THREE.Mesh(geometry, material)
    item.mesh = mesh
    item.group.add(mesh)
  }

  SCENE_ITEMS.forEach((config, i) => {
    if (config.shape in primitives) {
      attach(items[i]!, primitives[config.shape as PrimitiveShape](), materials[config.material])
    }
  })

  // Code glyphs come from a Blender export (design/export-glyphs.py).
  new GLTFLoader().load('/models/glyphs.glb', (gltf) => {
    gltf.scene.updateMatrixWorld(true)
    SCENE_ITEMS.forEach((config, i) => {
      const source = gltf.scene.getObjectByName(`glyph_${config.shape}`) as THREE.Mesh | undefined
      if (!source?.isMesh) return
      const geometry = source.geometry.clone().applyMatrix4(source.matrixWorld)
      // Blender text lies flat after the Y-up conversion: stand it up to face the camera.
      geometry.rotateX(Math.PI / 2)
      geometry.center()
      geometry.computeBoundingBox()
      const height = geometry.boundingBox!.max.y - geometry.boundingBox!.min.y
      geometry.scale(1.2 / height, 1.2 / height, 1.2 / height)
      geometry.computeVertexNormals()
      attach(items[i]!, geometry, materials[config.material])
    })
  })

  // --- Dust particles for depth ------------------------------------------
  const dustCount = window.innerWidth < 700 ? 260 : 650
  const dustPositions = new Float32Array(dustCount * 3)
  for (let i = 0; i < dustCount; i++) {
    dustPositions.set([random(-16, 16), random(-10, 10), random(-18, 4)], i * 3)
  }
  const dustGeometry = new THREE.BufferGeometry()
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
  const dustMaterial = new THREE.PointsMaterial({
    size: 0.06,
    map: createDotTexture(),
    transparent: true,
    depthWrite: false,
    color: 0xc9b6ff,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
  })
  const dust = new THREE.Points(dustGeometry, dustMaterial)
  scene.add(dust)

  // --- Viewport helpers ----------------------------------------------------
  const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(FOV / 2))
  let responsiveScale = 1

  function resize() {
    const width = window.innerWidth
    const height = window.innerHeight
    renderer!.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    responsiveScale = THREE.MathUtils.clamp(camera.aspect / 1.5, 0.55, 1)
  }
  resize()

  // --- Entrance --------------------------------------------------------------
  if (!reduced) {
    gsap.to(items, { intro: 1, duration: 2.4, delay: 0.6, ease: 'expo.out', stagger: { each: 0.08, from: 'random' } })
  }

  // --- Scroll choreography -----------------------------------------------
  let timeline: gsap.core.Timeline | undefined
  let spinBoost = 0

  function buildTimeline() {
    timeline?.scrollTrigger?.kill()
    timeline?.kill()

    const maxScroll = ScrollTrigger.maxScroll(window)
    if (maxScroll <= 0) return
    const hero = sceneLayout('hero')
    items.forEach((item, i) => Object.assign(item.pose, hero[i]))
    gsap.set(el, { opacity: SCENE_OPACITY.hero })

    timeline = gsap.timeline({
      scrollTrigger: {
        start: 0,
        end: maxScroll,
        // Seconds the objects take to catch up with the scroll: they trail it and keep drifting after it stops.
        scrub: SCENE_SCRUB,
        onUpdate: (self) => {
          spinBoost = Math.min(Math.abs(self.getVelocity()) / 700, 5)
        },
      },
    })

    // Each section's layout is reached when the section's top is 35% down the viewport.
    // Objects first hold their pose for part of the way (SCENE_HOLD), then glide to the next one.
    let previous = 0
    for (const section of SCENE_SECTIONS.slice(1)) {
      const target = document.querySelector<HTMLElement>(`[data-scene="${section}"]`)
      if (!target) continue
      // A throwaway trigger gives the true scroll position, even with smoothing and pin spacers.
      const probe = ScrollTrigger.create({ trigger: target, start: 'top 35%' })
      const at = Math.min(Math.max(probe.start, previous + 1), maxScroll)
      probe.kill()
      const span = at - previous
      const start = previous + span * SCENE_HOLD
      const duration = span * (1 - SCENE_HOLD)
      const layout = sceneLayout(section)
      items.forEach((item, i) => {
        timeline!.to(item.pose, { ...layout[i], duration, ease: 'power1.inOut' }, start)
      })
      timeline.to(el, { opacity: SCENE_OPACITY[section], duration, ease: 'none' }, start)
      previous = at
    }
    timeline.set({}, {}, maxScroll)
    timeline.scrollTrigger?.update()
  }

  let rebuildTimer: ReturnType<typeof setTimeout> | undefined
  const scheduleRebuild = () => {
    clearTimeout(rebuildTimer)
    rebuildTimer = setTimeout(buildTimeline, 180)
  }
  const pageObserver = new ResizeObserver(scheduleRebuild)
  pageObserver.observe(document.body)

  // --- Pointer -------------------------------------------------------------
  const pointer = new THREE.Vector2(0, 0)
  const parallax = new THREE.Vector2(0, 0)
  const raycaster = new THREE.Raycaster()
  let pointerMoved = false
  function onPointerMove(event: PointerEvent) {
    pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)
    pointerMoved = true
  }

  function onResize() {
    resize()
    scheduleRebuild()
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('resize', onResize)

  // --- Render loop ---------------------------------------------------------
  const timer = new THREE.Timer()
  let elapsed = 0
  let boost = 0

  function tick() {
    timer.update()
    const dt = Math.min(timer.getDelta(), 0.05)
    elapsed += dt
    boost += (spinBoost - boost) * 0.06
    spinBoost *= 0.94

    if (!reduced) {
      parallax.lerp(pointer, 0.04)
      camera.position.x = parallax.x * 0.45
      camera.position.y = parallax.y * 0.3
      camera.lookAt(0, 0, 0)
      dust.rotation.y = elapsed * 0.012
      dust.rotation.x = Math.sin(elapsed * 0.1) * 0.04
    }

    // Spin kick for the object under the cursor.
    if (pointerMoved && !reduced) {
      pointerMoved = false
      raycaster.setFromCamera(pointer, camera)
      const meshes = items.flatMap(item => (item.mesh ? [item.mesh] : []))
      const hit = raycaster.intersectObjects(meshes, false)[0]
      const item = hit && items.find(entry => entry.mesh === hit.object)
      if (item) item.kick = Math.min(item.kick + 0.6, 4)
    }

    for (const item of items) {
      const { pose } = item
      const depth = CAMERA_Z - pose.z
      const halfHeight = tanHalfFov * depth
      const halfWidth = halfHeight * camera.aspect
      const entrance = 1 - item.intro
      const float = reduced ? 0 : Math.sin(elapsed * item.float.speed + item.float.phase) * item.float.amp

      item.group.position.set(
        pose.x * halfWidth,
        pose.y * halfHeight + float,
        pose.z - entrance * 9,
      )

      if (!reduced) {
        const speed = 1 + boost + item.kick
        item.angle.x += item.spin.x * speed * dt
        item.angle.y += item.spin.y * speed * dt
        item.angle.z += item.spin.z * speed * dt
        item.kick *= 0.96
      }
      item.group.rotation.set(pose.rx + item.angle.x, pose.ry + item.angle.y, pose.rz + item.angle.z)
      item.group.scale.setScalar(item.scale * pose.s * responsiveScale * Math.max(item.intro, 0.0001))
    }

    renderer!.render(scene, camera)
  }

  gsap.ticker.add(tick)
  buildTimeline()

  return () => {
    gsap.ticker.remove(tick)
    clearTimeout(rebuildTimer)
    pageObserver.disconnect()
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('resize', onResize)
    timeline?.scrollTrigger?.kill()
    timeline?.kill()
    gsap.killTweensOf(items)
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Points) object.geometry.dispose()
    })
    Object.values(materials).forEach(material => material.dispose())
    dustMaterial.map?.dispose()
    dustMaterial.dispose()
    envMap.dispose()
    pmrem.dispose()
    renderer?.dispose()
    renderer = undefined
  }
}

/** Soft round sprite for the dust particles. */
function createDotTexture() {
  const size = 64
  const dot = document.createElement('canvas')
  dot.width = dot.height = size
  const context = dot.getContext('2d')!
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.35)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(dot)
}
</script>

<template>
  <!-- Teleported: fixed elements must sit outside the smooth-scroll content, which is moved with transforms. -->
  <Teleport to="body">
    <div
      class="scene"
      aria-hidden="true"
    >
      <canvas
        ref="canvas"
        class="scene__canvas"
      />
    </div>
  </Teleport>
</template>

<style scoped>
.scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.scene__canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
