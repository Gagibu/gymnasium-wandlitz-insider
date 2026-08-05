import type { BuildingData, Floor, RenderMode, BuildingId } from "./types"
import { cn } from "@/lib/utils"
import { STROKE_WIDTH } from "./constants"

type Args = {
  building: BuildingData
  mode: RenderMode
  floor: Floor
  selected: BuildingId | null
  zoom: number
  onSelect: (id: BuildingId) => void
}

export const getVisualClass = (mode: RenderMode, clickable: boolean) => {
  switch (mode) {
    case "disabled":
      return cn("transition-all duration-200 outline-none", "fill-transparent stroke-muted-foreground/50")
    case "visible":
      return cn("transition-all duration-200 outline-none", "fill-transparent stroke-foreground", clickable ? "hover:fill-primary/10 hover:stroke-primary" : null)
    case "hidden":
      return cn("transition-all duration-200 outline-none", "fill-transparent stroke-transparent", clickable ? "hover:fill-primary/10 hover:stroke-primary" : null)
    case "selected":
      return cn("transition-all duration-200 outline-none", "fill-primary/30 stroke-primary")
  }
}

const shouldRenderShapeInMode = (building: BuildingData, floor: Floor, selected: BuildingId | null, mode: RenderMode) => {
  const state = building.floors[floor]
  if (mode === "selected") return selected === building.id
  if (selected === building.id) return false
  return state.visual === mode
}

export function renderBuildingShape({ building, mode, floor, selected, zoom, onSelect }: Args) {
  if (!shouldRenderShapeInMode(building, floor, selected, mode)) return null

  const state = building.floors[floor]
  const clickable = state.clickable
  if (mode === "hidden" && !clickable) return null

  const isSelected = mode === "selected"
  const strokeWidth = isSelected ? (STROKE_WIDTH * 1.35) / zoom : STROKE_WIDTH / zoom
  const interactive = clickable && mode !== "disabled"
  const visualClass = getVisualClass(mode, clickable)

  const commonProps = {
    id: building.id,
    "aria-label": building.ariaLabel,
    className: cn(visualClass, interactive ? "cursor-pointer pointer-events-auto" : "pointer-events-none"),
    vectorEffect: "non-scaling-stroke" as const,
    style: { strokeWidth },
    role: interactive ? "button" : undefined,
    tabIndex: interactive ? 0 : -1,
    "aria-disabled": !interactive,
    onClick: interactive ? () => onSelect(building.id) : undefined,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (!interactive) return
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onSelect(building.id)
      }
    },
  }

  if (building.geometry.kind === "path") return <path key={`${building.id}-${mode}`} {...commonProps} d={building.geometry.d} />
  return (
    <rect
      key={`${building.id}-${mode}`}
      {...commonProps}
      width={building.geometry.width}
      height={building.geometry.height}
      x={building.geometry.x}
      y={building.geometry.y}
      transform={building.geometry.transform}
    />
  )
}