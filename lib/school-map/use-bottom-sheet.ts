"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"

/** Höhe, die im eingeklappten Zustand sichtbar bleibt (Griff + Titelzeile). */
const SHEET_PEEK_HEIGHT = 116

/** Ganz aufgezogen bleibt oben ein Streifen Karte sichtbar. */
const SHEET_FULL_RATIO = 0.9
/** Höhe, auf die ein neu ausgewähltes Gebäude das Sheet mindestens aufzieht. */
const SHEET_REVEAL_RATIO = 0.45

/** px/ms – ab diesem Tempo entscheidet die Wischrichtung statt der Position. */
const FLING_VELOCITY = 0.5
/** Nur so nah an den beiden Enden rastet das Sheet ein, dazwischen bleibt es frei. */
const EDGE_SNAP = 56

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

interface UseBottomSheetOptions {
  /** Nur im Vollbildmodus ist das Ziehen aktiv. */
  enabled: boolean
  viewportHeight: number
}

/**
 * Frei ziehbares Bottom-Sheet: die Höhe folgt stufenlos dem Finger und bleibt
 * beim Loslassen stehen. Eingerastet wird nur an den beiden Enden – entweder
 * weil man dort loslässt oder weil man in eine Richtung wischt.
 *
 * Bewegung und Loslassen hängen bewusst am window statt am Griff selbst – so
 * bleibt das Sheet nicht auf halber Strecke stehen, wenn der Zeiger den Griff
 * verlässt oder die Geste abgebrochen wird.
 */
export function useBottomSheet({ enabled, viewportHeight }: UseBottomSheetOptions) {
  const height = viewportHeight > 0 ? Math.round(viewportHeight * SHEET_FULL_RATIO) : 0
  const minVisible = Math.min(SHEET_PEEK_HEIGHT, height)

  const [requestedVisible, setRequestedVisible] = useState(SHEET_PEEK_HEIGHT)
  const [isDragging, setIsDragging] = useState(false)

  const visibleHeight = height > 0 ? clamp(requestedVisible, minVisible, height) : 0
  const isExpanded = visibleHeight > minVisible + 8

  const collapse = useCallback(() => setRequestedVisible(SHEET_PEEK_HEIGHT), [])
  const expand = useCallback(() => setRequestedVisible(height), [height])

  /** Zieht das Sheet auf, ohne ein bereits weiter geöffnetes wieder zu verkleinern. */
  const revealDetails = useCallback(() => {
    const target = clamp(Math.round(viewportHeight * SHEET_REVEAL_RATIO), minVisible, height)
    setRequestedVisible((prev) => Math.max(prev, target))
  }, [height, minVisible, viewportHeight])

  /** Beendet eine laufende Ziehgeste – auch bei Moduswechsel oder Unmount. */
  const stopDragRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (enabled) return
    stopDragRef.current?.()
    setIsDragging(false)
    setRequestedVisible(SHEET_PEEK_HEIGHT)
  }, [enabled])

  useEffect(() => () => stopDragRef.current?.(), [])

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || height === 0) return
      if (e.pointerType === "mouse" && e.button !== 0) return

      stopDragRef.current?.()

      const pointerId = e.pointerId
      const startY = e.clientY
      const startVisible = visibleHeight
      let lastY = startY
      let lastTime = performance.now()
      let velocity = 0

      // Nach oben ziehen (kleineres clientY) vergrößert die sichtbare Höhe.
      const visibleAt = (clientY: number) => clamp(startVisible + (startY - clientY), minVisible, height)

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
        setRequestedVisible(visibleAt(ev.clientY))
      }

      const handleEnd = (ev: PointerEvent) => {
        if (ev.pointerId !== pointerId) return
        stopDrag()
        setIsDragging(false)

        const released = visibleAt(lastY)
        if (Math.abs(velocity) > FLING_VELOCITY) {
          // Wischen zieht bis ans jeweilige Ende durch.
          setRequestedVisible(velocity > 0 ? SHEET_PEEK_HEIGHT : height)
        } else if (released - minVisible < EDGE_SNAP) {
          setRequestedVisible(SHEET_PEEK_HEIGHT)
        } else if (height - released < EDGE_SNAP) {
          setRequestedVisible(height)
        } else {
          // Dazwischen bleibt das Sheet exakt dort stehen, wo es losgelassen wurde.
          setRequestedVisible(released)
        }
      }

      window.addEventListener("pointermove", handleMove)
      window.addEventListener("pointerup", handleEnd)
      window.addEventListener("pointercancel", handleEnd)
      stopDragRef.current = stopDrag

      setIsDragging(true)
    },
    [enabled, height, minVisible, visibleHeight]
  )

  return {
    height,
    visibleHeight,
    isDragging,
    isExpanded,
    collapse,
    expand,
    revealDetails,
    dragHandlers: { onPointerDown },
  }
}
