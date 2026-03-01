"use client"

import { useEffect, useRef } from "react"

const FRAME_COUNT = 30
const FRAME_DURATION = 72
const BG_SRC = "/images/hero/hero-bg.png"
const VALVES_SRC = "/images/hero/hero-valves.png"
const ANIM_SRCS = Array.from(
  { length: FRAME_COUNT },
  (_, i) => `/images/hero/anim-${String(i).padStart(2, "0")}.png`
)

const SRC_W = 1280
const SRC_H = 1000

// DT brand blue for color grading
const TINT_R = 0
const TINT_G = 48
const TINT_B = 100

export function HeroCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let destroyed = false

    // Load all images
    const bgImg = new window.Image()
    const valvesImg = new window.Image()
    const animImgs: HTMLImageElement[] = []

    let loadedCount = 0
    const totalToLoad = 2 + FRAME_COUNT

    function onLoad() {
      loadedCount++
      if (loadedCount >= totalToLoad && !destroyed) {
        startAnimation()
      }
    }

    bgImg.onload = onLoad
    bgImg.src = BG_SRC

    valvesImg.onload = onLoad
    valvesImg.src = VALVES_SRC

    for (const src of ANIM_SRCS) {
      const img = new window.Image()
      img.onload = onLoad
      img.src = src
      animImgs.push(img)
    }

    let frameIndex = 0
    let direction = 1
    let lastFrameTime = 0
    let fadeOpacity = 1 // starts dark, fades to 0
    let fadeStart = 0

    function draw() {
      if (!canvas || !ctx) return

      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      const pw = Math.round(w * dpr)
      const ph = Math.round(h * dpr)

      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw
        canvas.height = ph
      }

      ctx.clearRect(0, 0, pw, ph)
      ctx.save()
      ctx.scale(dpr, dpr)

      // Cover calculation
      const scale = Math.max(w / SRC_W, h / SRC_H)
      const dw = SRC_W * scale
      const dh = SRC_H * scale
      const dx = (w - dw) / 2
      const dy = (h - dh) / 2

      // Layer 1: background texture
      ctx.drawImage(bgImg, dx, dy, dw, dh)

      // Layer 2: valves (static)
      ctx.drawImage(valvesImg, dx, dy, dw, dh)

      // Layer 3: animation frame
      const animFrame = animImgs[frameIndex]
      if (animFrame) {
        ctx.drawImage(animFrame, dx, dy, dw, dh)
      }

      // Blue color grading — multiply-like tint
      // Dark blue overlay with "multiply" blend gives metallic blue look
      ctx.globalCompositeOperation = "multiply"
      ctx.fillStyle = `rgb(${TINT_R + 40}, ${TINT_G + 60}, ${TINT_B + 60})`
      ctx.fillRect(0, 0, w, h)

      // Reset composite
      ctx.globalCompositeOperation = "source-over"

      // Darken base to deepen shadows
      ctx.fillStyle = "rgba(0,10,30,0.4)"
      ctx.fillRect(0, 0, w, h)

      // Radial light from upper-right — spotlight on valves
      const lightX = w * 0.75
      const lightY = h * 0.2
      const lightR = Math.max(w, h) * 0.8
      const radial = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, lightR)
      radial.addColorStop(0, "rgba(120,160,220,0.25)")
      radial.addColorStop(0.4, "rgba(60,100,160,0.1)")
      radial.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = radial
      ctx.fillRect(0, 0, w, h)

      // Left-side darkening for text readability
      const textGuard = ctx.createLinearGradient(0, 0, w * 0.6, 0)
      textGuard.addColorStop(0, "rgba(0,20,50,0.6)")
      textGuard.addColorStop(0.7, "rgba(0,20,50,0.2)")
      textGuard.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = textGuard
      ctx.fillRect(0, 0, w, h)

      // Fade-in from black on load
      if (fadeOpacity > 0) {
        ctx.fillStyle = `rgba(0,15,40,${fadeOpacity})`
        ctx.fillRect(0, 0, w, h)
      }

      ctx.restore()
    }

    function startAnimation() {
      fadeStart = performance.now()
      lastFrameTime = fadeStart

      function tick(now: number) {
        if (destroyed) return

        // Fade-in over 1.2s
        const fadeElapsed = now - fadeStart
        fadeOpacity = Math.max(0, 1 - fadeElapsed / 1200)

        const elapsed = now - lastFrameTime
        if (elapsed >= FRAME_DURATION) {
          frameIndex += direction
          if (frameIndex >= FRAME_COUNT - 1) { frameIndex = FRAME_COUNT - 1; direction = -1 }
          else if (frameIndex <= 0) { frameIndex = 0; direction = 1 }

          lastFrameTime = now
        }

        draw()
        animId = requestAnimationFrame(tick)
      }

      draw()
      animId = requestAnimationFrame(tick)
    }

    const ro = new ResizeObserver(() => {
      if (!destroyed) draw()
    })
    ro.observe(canvas)

    return () => {
      destroyed = true
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  )
}
