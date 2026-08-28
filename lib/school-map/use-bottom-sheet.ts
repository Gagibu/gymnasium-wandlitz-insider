"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"

export type SheetSnap = "peek" | "half" | "full"

/** Höhe, die im eingeklappten Zustand sichtbar bleibt (Griff + Titelzeile). */
const SHEET_PEEK_HEIGHT = 116

const SHEET_FULL_RATIO = 0.9
const SHEET_HALF_RATIO = 0.45
/** px/ms – ab diesem Tempo entscheidet die Wischrichtung statt der Nähe. */
const FLING_VELOCITY = 0.5

/** Von weit offen bis eingeklappt – ein Wisch springt genau einen Schritt. */
const SNAP_ORDER: SheetSnap[] = ["full", "half", "peek"]

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

interface UseBottomSheetOptions {
  /** Nur im Vollbildmodus ist das Ziehen aktiv. */
  enabled: boolean
  viewportHeight: number
}

/**
 * Ziehbares Bottom-Sheet nach Google-Maps-Vorbild: drei Rastpunkte, Maus- und
 * Touch-Bedienung über Pointer-Events, Wisch-Geschwindigkeit wird ausgewertet.
 *
 * Bewegung und Loslassen hängen bewusst am window statt am Griff selbst – so
 * bleibt das Sheet nicht auf halber Strecke stehen, wenn der Zeiger den Griff
 * verlässt oder die Geste abgebrochen wird.
 */
export function useBottomSheet({ enabled, viewportHeight }: UseBottomSheetOptions) {
  const [snap, setSnap] = useState<SheetSnap>("peek")
  const [dragTranslate, setDragTranslate] = useState<number | null>(null)

  const height = viewportHeight > 0 ? Math.round(viewportHeight * SHEET_FULL_RATIO) : 0
  const peekTranslate = Math.max(0, height - SHEET_PEEK_HEIGHT)
  const halfTranslate = clamp(
    height - Math.round(viewportHeight * SHEET_HALF_RATIO),
    0,
    peekTranslate
  )

  const snapTranslate = useCallback(
    (target: SheetSnap) => {
      if (target === "full") return 0
      if (target === "half") return halfTranslate
      return peekTranslate
    },
    [halfTranslate, peekTranslate]
  )

  const nearestSnap = useCallback(
    (value: number) =>
      SNAP_ORDER.reduce((best, candidate) =>
        Math.abs(snapTranslate(candidate) - value) < Math.abs(snapTranslate(best) - value)
          ? candidate
          : best
      ),
    [snapTranslate]
  )

  const translate = dragTranslate ?? snapTranslate(snap)
  const visibleHeight = Math.max(0, height - translate)
  const isDragging = dragTranslate !== null

  /** Beendet eine laufende Ziehgeste – auch bei Moduswechsel oder Unmount. */
  const stopDragRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (enabled) return
    stopDragRef.current?.()
    setDragTranslate(null)
    setSnap("peek")
  }, [enabled])

  useEffect(() => () => stopDragRef.current?.(), [])

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || height === 0) return
      if (e.pointerType === "mouse" && e.button !== 0) return

      stopDragRef.current?.()

      const pointerId = e.pointerId
      const startY = e.clientY
      const startTranslate = snapTranslate(snap)
      let lastY = startY
      let lastTime = performance.now()
      let velocity = 0

      const stopDrag = () => {
        window.removeEventListener("pointermove", handleMove)
        window.removeEventListener("pointerup", handleEnd)
        window.removeEventListener("pointercancel", handleEnd)
        stopDragRef.current = null
      }

      const handleMove = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId) return
        const now = performance.now()
        const elapsed = now - lastTime
        if (elapsed > 0) velocity = (ev.clientY - lastY) / elapsed
        lastY = ev.clientY
        lastTime = now
        setDragTranslate(clamp(startTranslate + (ev.clientY - startY), 0, peekTranslate))
      }

      const handleEnd = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId) return
        stopDrag()

        let next: SheetSnap
        if (Math.abs(velocity) > FLING_VELOCITY) {
          // Nach unten wischen klappt einen Rastpunkt weiter ein, nach oben weiter auf.
          const step = velocity > 0 ? 1 : -1
          const from = SNAP_ORDER.indexOf(nearestSnap(startTranslate))
          next = SNAP_ORDER[clamp(from + step, 0, SNAP_ORDER.length - 1)]
        } else {
          next = nearestSnap(clamp(startTranslate + (lastY - startY), 0, peekTranslate))
        }

        setSnap(next)
        setDragTranslate(null)
      }

      window.addEventListener("pointermove", handleMove)
      window.addEventListener("pointerup", handleEnd)
      window.addEventListener("pointercancel", handleEnd)
      stopDragRef.current = stopDrag

      setDragTranslate(startTranslate)
    },
    [enabled, height, nearestSnap, peekTranslate, snap, snapTranslate]
  )

  return {
    snap,
    setSnap,
    height,
    translate,
    visibleHeight,
    isDragging,
    dragHandlers: { onPointerDown },
  }
}
