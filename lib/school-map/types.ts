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
  | "feldschuleRaum050"
  | "feldschuleRaum051"
  | "feldschuleRaum052"
  | "feldschuleRaum053"
  | "feldschuleRaum054"
  | "feldschuleRaum055"
  | "feldschuleLehrerzimmer"
  | "feldschuleVorbereitungsraum"
  | "feldschuleMusikschuleBarnim"
  | "feldschulePutzmittelraum"
  | "feldschuleWcJungen"
  | "feldschuleWcMaedchen"
  | "feldschuleWcLehrer"
  | "feldschuleFeuerloescher1"
  | "feldschuleFeuerloescher2"
  | "feldschuleFeuermelder1"
  | "feldschuleFeuermelder2"

export type Floor = 1 | 2 | 3
export type VisualState = "visible" | "hidden" | "disabled"
export type RenderMode = "disabled" | "visible" | "hidden" | "selected"

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
  | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number; transform?: string }

export interface BuildingData {
  id: BuildingId
  name: string
  shortName: string
  description: string
  rooms: string[]
  floorDetails?: Partial<Record<Floor, FloorDetails>>
  ariaLabel: string
  geometry: ShapeGeometry
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