export type BuildingId =
  | "building1"
  | "building2"
  | "haus2"
  | "haus3"
  | "haus5"
  | "foyer"
  | "essenraum"
  | "haus1"
  | "Archiv"
  | "Foyer2"
  | "Bibliothek"
  | "uUukH"
  | "L1oB"
  | "zaub"
  | "Bergs-komp"
  | "nTal"
  | "haus25"

export type Floor = 1 | 2 | 3

/**
 * Darstellung einer Fläche auf einer Etage, sofern sie nicht anklickbar ist:
 * - `visible`  – durchgezogener Umriss (Campus-Silhouette der Etage)
 * - `disabled` – nur angedeutet (gehört nicht zu dieser Etage)
 * - `hidden`   – wird gar nicht gezeichnet
 *
 * Anklickbare Flächen werden immer als interaktiv dargestellt, unabhängig von diesem Wert.
 */
export type VisualState = "visible" | "hidden" | "disabled"

/** Zeichenebene – bestimmt Reihenfolge und Aussehen beim Rendern. */
export type RenderMode = "disabled" | "outline" | "interactive" | "selected"

export interface FloorDetails {
  description: string
  rooms: string[]
}

export interface FloorState {
  visual: VisualState
  clickable: boolean
}

export type ShapeGeometry =
  | { kind: "path"; d: string }
  | { kind: "rect"; width: number; height: number; x: number; y: number; transform?: string }

/** Ankerpunkt der Beschriftung in viewBox-Koordinaten (liegt garantiert innerhalb der Fläche). */
export interface LabelAnchor {
  x: number
  y: number
}

export interface BuildingData {
  id: BuildingId
  name: string
  shortName: string
  description: string
  rooms: string[]
  floorDetails?: Partial<Record<Floor, FloorDetails>>
  geometry: ShapeGeometry
  label?: LabelAnchor
  floors: Record<Floor, FloorState>
}

export type SearchResult = {
  key: string
  id: BuildingId
  floor: Floor
  building: BuildingData
  details: FloorDetails
  matchedRooms: string[]
  matchedIn: string[]
  score: number
}
