import type { Floor } from "./types"

export const ALL_FLOORS: Floor[] = [1, 2, 3]

/** Sichtbare Beschriftung der Etagenumschalter (auch für aria-label genutzt). */
export const floorLabels: Record<Floor, string> = {
  1: "Etage 1",
  2: "Etage 2",
  3: "Etage 3",
}

export const MIN_ZOOM = 1
export const MAX_ZOOM = 5
export const ZOOM_STEP = 1.4

/**
 * Muss exakt der viewBox des Plans entsprechen – daraus wird das Seitenverhältnis
 * des Kartenausschnitts und die Größe der Beschriftungen abgeleitet.
 */
export const SVG_VIEWBOX_WIDTH = 155.79399
export const SVG_VIEWBOX_HEIGHT = 88.973282
export const SVG_VIEWBOX = `0 0 ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}`

export const STROKE_WIDTH = 1.2

/** Zielgröße der Gebäudebeschriftung in CSS-Pixeln (unabhängig von Zoom und Bildschirmbreite). */
export const LABEL_TARGET_PX = 12
/**
 * Ab dieser Schriftgröße (in viewBox-Einheiten) überlappen sich die Beschriftungen –
 * dann werden sie ausgeblendet, bis weit genug hineingezoomt wurde.
 */
export const LABEL_MAX_FONT_SIZE = 4.2
