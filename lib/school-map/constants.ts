import type { Floor } from "./types"

export const ALL_FLOORS: Floor[] = [1, 2, 3]
export const floorLabels: Record<Floor, string> = { 1: "Etage 1", 2: "Etage 2", 3: "Etage 3" }

export const MIN_ZOOM = 1
export const MAX_ZOOM = 5

export const SVG_VIEWBOX_WIDTH = 247.73793
export const SVG_VIEWBOX_HEIGHT = 146.58737
export const DEFAULT_VIEWPORT_HEIGHT = 240

export const STROKE_WIDTH = 1.2