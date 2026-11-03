import { useEffect, useRef } from 'react'

import { PLASMA_FRAGMENT_SHADER } from '@/components/plasma-shader'
import { PLASMA_TIME_SCALE } from '@/lib/motion'

/*
 * Animated "Plasma" background from BACKGROUND.md: plain WebGL1, one fullscreen
 * triangle, the exact fragment shader and its packed uniforms. Only the four
 * colours (and the post-processing that would fight them) follow the site:
 * green in Sobre, blue in Projetos, light/dark per theme. See DECISIONS.md.
 */

type Rgb = [number, number, number]
type Palette = [Rgb, Rgb, Rgb, Rgb]
type Mode = 'light' | 'dark'
type Section = 'about' | 'projects'

const hex = (value: string): Rgb => {
  const n = parseInt(value.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

// Low → high, built from PALLET (#278C67, #4D67B6, #E1E7F7).
const PALETTES: Record<Mode, Record<Section, Palette>> = {
  light: {
    about: [hex('#ffffff'), hex('#eef2fb'), hex('#cfe9dd'), hex('#8fcbb2')],
    projects: [hex('#ffffff'), hex('#eef2fb'), hex('#d3dcf3'), hex('#9eb0e0')],
  },
  dark: {
    about: [hex('#0e1320'), hex('#0f2119'), hex('#164a37'), hex('#1f6f52')],
    projects: [hex('#0e1320'), hex('#121a33'), hex('#22305f'), hex('#33478a')],
  },
}

// Header values from BACKGROUND.md. Hue and brightness are neutralised because they
// were tuned for the original orange palette (hue 174° would turn green/blue into
// other colours, brightness -0.5 would make the light theme grey); the vignette is
// softened in the light theme so the screen corners don't go grey behind the header.
const SHAPE = [1.5, 0.48, 0.5, 0.0] // scale, intensity, paramA, warp
const SURFACE = [2.4, 0.92, 0.0, 1.0] // detail, contrast, brightness (was -0.50), saturation
const FINISH: Record<Mode, number[]> = {
  light: [0.0, 0.25, 0.016, 0.35], // hue (was 3.04), vignette (was 0.61), blur, grain
  dark: [0.0, 0.61, 0.016, 0.35],
}
const TRANSFORM = [7.0, 0.0, 0.16, 0.0] // seed, rotation, drift, OKLab off
const SPACE = [0, 0, 0, 0] // offset.xy, pointer.xy (cursor off)
const CURSOR = [0, 4.0, 0.65, 0.3] // presence 0 = cursor off
const COLOR_COUNT = 4
const MAX_DPR = 2
const BLEND_MS = 600 // same as the --brand transition in index.css

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  // Some WebGL1 drivers reject non-ASCII characters even inside comments.
  gl.shaderSource(shader, source.replace(/[\u0080-￿]/g, ''))
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (import.meta.env.DEV) console.warn('[PlasmaBackground]', gl.getShaderInfoLog(shader))
    return null
  }
  return shader
}

function readTarget(): { mode: Mode; palette: Palette } {
  const root = document.documentElement
  const mode: Mode = root.classList.contains('dark') ? 'dark' : 'light'
  const section: Section = root.dataset.section === 'projects' ? 'projects' : 'about'
  return { mode, palette: PALETTES[mode][section] }
}

export function PlasmaBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl', { antialias: false, alpha: false })
    if (!canvas || !gl) return // No WebGL: the plain page background stays.

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fs = compile(gl, gl.FRAGMENT_SHADER, PLASMA_FRAGMENT_SHADER)
    const program = gl.createProgram()
    if (!vs || !fs || !program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    // One triangle that covers the whole clip space.
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const loc = (name: string) => gl.getUniformLocation(program, name)
    const u = {
      colors: loc('u_colors'),
      scene: loc('u_scene'),
      shape: loc('u_shape'),
      surface: loc('u_surface'),
      finish: loc('u_finish'),
      transform: loc('u_transform'),
      space: loc('u_space'),
      cursor: loc('u_cursor'),
    }
    gl.uniform4fv(u.shape, SHAPE)
    gl.uniform4fv(u.surface, SURFACE)
    gl.uniform4fv(u.transform, TRANSFORM)
    gl.uniform4fv(u.space, SPACE)
    gl.uniform4fv(u.cursor, CURSOR)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Colour blending between palettes (theme or section change).
    let target = readTarget()
    let from = target.palette
    let blendStart = -Infinity
    const colors = new Float32Array(8 * 3)

    function currentPalette(now: number): Palette {
      const t = Math.min(1, (now - blendStart) / BLEND_MS)
      const eased = t * (2 - t)
      return target.palette.map((to, i) => to.map((c, k) => from[i][k] + (c - from[i][k]) * eased)) as Palette
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const width = Math.round(window.innerWidth * dpr)
      const height = Math.round(window.innerHeight * dpr)
      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width
        canvas!.height = height
      }
      gl!.viewport(0, 0, width, height)
    }

    let frame = 0
    function draw(now: number) {
      const palette = currentPalette(now)
      palette.forEach((rgb, i) => colors.set(rgb, i * 3))
      gl!.uniform3fv(u.colors, colors)
      // A still frame (fixed time) when the visitor prefers reduced motion.
      const seconds = reducedMotion.matches ? 12 : now / 1000
      gl!.uniform4f(u.scene, canvas!.width, canvas!.height, seconds * PLASMA_TIME_SCALE, COLOR_COUNT)
      gl!.uniform4fv(u.finish, FINISH[target.mode])
      gl!.drawArrays(gl!.TRIANGLES, 0, 3)
    }

    function loop(now: number) {
      draw(now)
      const blending = now - blendStart < BLEND_MS
      frame = !document.hidden && (!reducedMotion.matches || blending) ? requestAnimationFrame(loop) : 0
    }
    const start = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(loop)
    }

    // Follow theme (class="dark") and section (data-section) set elsewhere.
    const observer = new MutationObserver(() => {
      const next = readTarget()
      if (next.palette === target.palette) return
      from = currentPalette(performance.now())
      target = next
      blendStart = performance.now()
      start()
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-section'] })

    const onResize = () => {
      resize()
      start()
    }
    // Pause the RAF loop while the tab is hidden.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
      } else start()
    }

    resize()
    start()
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    reducedMotion.addEventListener('change', start)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      reducedMotion.removeEventListener('change', start)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buffer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-[var(--plasma-opacity)] transition-opacity duration-500"
    />
  )
}
