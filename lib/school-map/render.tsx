import type { BuildingData, BuildingId, Floor, RenderMode } from "./types"
import { cn } from "@/lib/utils"
import { STROKE_WIDTH } from "./constants"

type ShapeProps = {
  building: BuildingData
  mode: RenderMode
  floor: Floor
  zoom: number
  onSelect: (id: BuildingId) => void
}

const modeClasses: Record<RenderMode, string> = {
  // Fläche gehört nicht zu dieser Etage – nur angedeutet.
  disabled: "fill-transparent stroke-muted-foreground/30",
  // Umriss der Etage, nicht anklickbar.
  outline: "fill-transparent stroke-foreground/60",
  // Anklickbar: schon im Ruhezustand sichtbar, damit sie auch ohne Hover (Touch) auffindbar ist.
  interactive: cn(
    "fill-primary/5 stroke-primary/40",
    "hover:fill-primary/20 hover:stroke-primary",
    "focus-visible:fill-primary/20 focus-visible:stroke-primary",
    "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  ),
  selected: "fill-primary/30 stroke-primary",
}

/**
 * Ermittelt die Zeichenebene einer Fläche auf einer Etage.
 * Anklickbare Flächen sind immer interaktiv – unabhängig vom `visual`-Wert.
 * `null` bedeutet: auf dieser Etage nicht darstellen.
 */
export function getRenderMode(
  building: BuildingData,
  floor: Floor,
  selected: BuildingId | null
): RenderMode | null {
  if (selected === building.id) return "selected"

  const { visual, clickable } = building.floors[floor]
  if (clickable) return "interactive"
  if (visual === "visible") return "outline"
  if (visual === "disabled") return "disabled"
  return null
}

export function BuildingShape({ building, mode, floor, zoom, onSelect }: ShapeProps) {
  const interactive = building.floors[floor].clickable
  const isSelected = mode === "selected"
  // Strichstärke bleibt beim Zoomen optisch konstant.
  const strokeWidth = (isSelected ? STROKE_WIDTH * 1.35 : STROKE_WIDTH) / zoom

  const commonProps = {
    className: cn(
      "transition-colors duration-200",
      modeClasses[mode],
      interactive ? "cursor-pointer" : "pointer-events-none"
    ),
    vectorEffect: "non-scaling-stroke" as const,
    style: { strokeWidth },
    ...(interactive
      ? {
          role: "button" as const,
          tabIndex: 0,
          "aria-label": `${building.name}, Etage ${floor}`,
          "aria-pressed": isSelected,
          onClick: () => onSelect(building.id),
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              onSelect(building.id)
            }
          },
        }
      : // Reine Umriss-/Hintergrundflächen sollen von Screenreadern ignoriert werden.
        { "aria-hidden": true as const }),
  }

  if (building.geometry.kind === "path") {
    return <path {...commonProps} d={building.geometry.d} />
  }

  return (
    <rect
      {...commonProps}
      width={building.geometry.width}
      height={building.geometry.height}
      x={building.geometry.x}
      y={building.geometry.y}
      transform={building.geometry.transform}
    />
  )
}

/**
 * Beschriftung eines Gebäudes. Liegt über allen Flächen, ist aber nie klickbar,
 * damit sie die darunterliegende Fläche nicht blockiert. Die Kontur in Hintergrundfarbe
 * (`paint-order: stroke`) hält den Text auch über Gebäudelinien lesbar.
 */
export function BuildingLabel({
  building,
  fontSize,
  isSelected,
}: {
  building: BuildingData
  fontSize: number
  isSelected: boolean
}) {
  if (!building.label) return null

  return (
    <text
      x={building.label.x}
      y={building.label.y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={fontSize}
      aria-hidden="true"
      className={cn(
        "pointer-events-none select-none font-medium stroke-background",
        isSelected ? "fill-primary" : "fill-foreground"
      )}
      style={{ strokeWidth: fontSize * 0.28, paintOrder: "stroke" }}
    >
      {building.shortName}
    </text>
  )
}
