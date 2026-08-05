import { ALL_FLOORS } from "./constants"
import { buildings } from "./data"
import type { BuildingData, Floor, FloorDetails, SearchResult } from "./types"

export const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .trim()

export const getFloorDetails = (building: BuildingData, targetFloor: Floor): FloorDetails =>
  building.floorDetails?.[targetFloor] ?? { description: building.description, rooms: building.rooms }

export const searchBuildings = (rawQuery: string): SearchResult[] => {
  const query = normalize(rawQuery)
  if (!query) return []

  const results: SearchResult[] = []

  for (const building of buildings) {
    const clickableFloors = ALL_FLOORS.filter((f) => building.floors[f].clickable)
    if (clickableFloors.length === 0) continue

    const name = normalize(building.name)
    const shortName = normalize(building.shortName)
    const id = normalize(building.id)

    const baseMatchedIn: string[] = []
    let baseScore = Number.POSITIVE_INFINITY

    if (shortName.startsWith(query) || name.startsWith(query)) {
      baseMatchedIn.push("Name")
      baseScore = Math.min(baseScore, 0)
    } else if (shortName.includes(query) || name.includes(query)) {
      baseMatchedIn.push("Name")
      baseScore = Math.min(baseScore, 1)
    }

    if (id.includes(query)) {
      if (!baseMatchedIn.includes("Name")) baseMatchedIn.push("Kennung")
      baseScore = Math.min(baseScore, 2)
    }

    for (const f of clickableFloors) {
      const details = getFloorDetails(building, f)
      const matchedIn = [...baseMatchedIn]
      let score = baseScore

      const matchedRooms = details.rooms.filter((room) => normalize(room).includes(query))
      if (matchedRooms.length > 0) {
        matchedIn.push("Raum")
        score = Math.min(score, 3)
      }

      if (normalize(details.description).includes(query)) {
        matchedIn.push("Beschreibung")
        score = Math.min(score, 4)
      }

      if (matchedIn.length === 0) continue

      results.push({
        key: `${building.id}-${f}`,
        id: building.id,
        floor: f,
        building,
        details,
        matchedRooms,
        matchedIn,
        score,
      })
    }
  }

  return results.sort(
    (a, b) => a.score - b.score || a.building.name.localeCompare(b.building.name) || a.floor - b.floor
  )
}