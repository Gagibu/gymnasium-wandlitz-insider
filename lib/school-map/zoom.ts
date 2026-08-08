import { MAX_ZOOM, MIN_ZOOM } from "./constants"

export const clampZoom = (z: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z))

/** Begrenzt das Verschieben so, dass der Kartenausschnitt nie über den Planrand hinausläuft. */
export const clampPan = (
  px: number,
  py: number,
  z: number,
  containerW: number,
  containerH: number
) => {
  const maxPanX = ((z - 1) * containerW) / 2
  const maxPanY = ((z - 1) * containerH) / 2
  return {
    x: Math.max(-maxPanX, Math.min(maxPanX, px)),
    y: Math.max(-maxPanY, Math.min(maxPanY, py)),
  }
}

export const getTouchDist = (t: TouchList) => {
  const dx = t[0].clientX - t[1].clientX
  const dy = t[0].clientY - t[1].clientY
  return Math.hypot(dx, dy)
}

export const getTouchMid = (t: TouchList) => ({
  x: (t[0].clientX + t[1].clientX) / 2,
  y: (t[0].clientY + t[1].clientY) / 2,
})
