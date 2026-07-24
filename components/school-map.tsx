"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"

type BuildingId =
  | "building1"
  | "building2"
  | "haus2"
  | "haus3"
  | "haus5"
  | "foyer"
  | "essenraum"
  | "haus1"

type Floor = 1 | 2 | 3

interface BuildingInfo {
  id: BuildingId
  name: string
  shortName: string
  description: string
  rooms: string[]
}

const buildings: Record<BuildingId, BuildingInfo> = {
  building1: {
    id: "building1",
    name: "Turnhalle – Sport",
    shortName: "Turnhalle",
    description:
      "Die Turnhalle beherbergt die die große Halle (GH1 / GH2), die Umkleiden und Toiletten.",
    rooms: [
      "Große Halle (gH1 / gH2)",
      "Umkleiden",
      "Toiletten",
      "mehr Umkleiden",
    ],
  },
  building2: {
    id: "building2",
    name: "Feldschule – Gesellschaftswissenschaften",
    shortName: "Feldschule",
    description:
      "In diesem Gebäude befinden sich die Fachräume für die gesellschaftswissenschaftlichen Fächer wie Geschichte, Politische Bildung und Erdkund / Geographie mit den dazugehörigen Fachräumen. Haus 4: (050; 051; 052; 053; 054; 055)",
    rooms: [
      "Geschichte-Fachräume",
      "Politische Bildung-Fachräume",
      "Erdkunde-Fachräume",
      "Toiletten",
    ],
  },
  haus2: {
    id: "haus2",
    name: "Haus 2 - Sprachenunterricht",
    shortName: "Haus 2",
    description: "...",
    rooms: [
      "Aula",
      "kleine Sporthalle",
      "Sekretariat",
      "Toiletten",
    ],
  },
  haus3: {
    id: "haus3",
    name: "Haus 3",
    shortName: "Haus 3",
    description: "...",
    rooms: [],
  },
  haus5: {
    id: "haus5",
    name: "Haus 5",
    shortName: "Haus 5",
    description: "...",
    rooms: [],
  },
  foyer: {
    id: "foyer",
    name: "Foyer",
    shortName: "Foyer",
    description: "...",
    rooms: [],
  },
  essenraum: {
    id: "essenraum",
    name: "Essenraum",
    shortName: "Essenraum",
    description: "...",
    rooms: [],
  },
  haus1: {
    id: "haus1",
    name: "haus1",
    shortName: "haus1",
    description: "...",
    rooms: [],
  },
}

// Buildings available on each floor
const floorBuildings: Record<Floor, BuildingId[]> = {
  1: ["building1", "haus3", "essenraum", "haus1", "foyer"],
  2: ["haus1", "foyer", "building2", "haus2", "haus5"],
  3: ["haus1", "haus2", "haus5"],
}

const MIN_ZOOM = 1
const MAX_ZOOM = 4

export function SchoolMap() {
  const [selected, setSelected] = useState<BuildingId | null>(null)
  const [floor, setFloor] = useState<Floor>(1)

  // Zoom & pan state
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const isPinchingRef = useRef(false)
  const lastPinchDistRef = useRef(0)
  const lastPinchMidRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const lastMousePosRef = useRef({ x: 0, y: 0 })
  // Single-finger touch pan
  const isTouchPanningRef = useRef(false)
  const lastTouchPosRef = useRef({ x: 0, y: 0 })

  // Auto-clear selection when building becomes unavailable on floor switch
  const handleFloorChange = (newFloor: Floor) => {
    setFloor(newFloor)
    if (selected && !floorBuildings[newFloor].includes(selected)) {
      setSelected(null)
    }
  }

  const handleSelect = (id: BuildingId) => {
    if (!floorBuildings[floor].includes(id)) return
    setSelected((prev) => (prev === id ? null : id))
  }

  // Clamp pan so we never pan beyond what zoom allows
  const clampPan = useCallback(
    (px: number, py: number, z: number, containerW: number, containerH: number) => {
      const maxPanX = ((z - 1) * containerW) / 2
      const maxPanY = ((z - 1) * containerH) / 2
      return {
        x: Math.max(-maxPanX, Math.min(maxPanX, px)),
        y: Math.max(-maxPanY, Math.min(maxPanY, py)),
      }
    },
    []
  )

  // Zoom towards a point (in container-relative coords)
  const zoomTowards = useCallback(
    (newZoom: number, clientX: number, clientY: number) => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const cw = rect.width
      const ch = rect.height
      // Point relative to container center
      const px = clientX - rect.left - cw / 2
      const py = clientY - rect.top - ch / 2

      setZoom((prevZoom) => {
        const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom))
        setPan((prevPan) => {
          // Adjust pan so the point under cursor stays fixed
          const scale = clamped / prevZoom
          const newPanX = scale * (prevPan.x - px) + px
          const newPanY = scale * (prevPan.y - py) + py
          return clampPan(newPanX, newPanY, clamped, cw, ch)
        })
        return clamped
      })
    },
    [clampPan]
  )

  const resetZoom = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  // Mouse wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      const delta = -e.deltaY * 0.001
      setZoom((prev) => {
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta * prev))
        zoomTowards(newZoom, e.clientX, e.clientY)
        return prev // actual update happens inside zoomTowards
      })
    },
    [zoomTowards]
  )

  // Mouse drag pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return
    isDraggingRef.current = true
    lastMousePosRef.current = { x: e.clientX, y: e.clientY }
  }, [zoom])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingRef.current) return
      const dx = e.clientX - lastMousePosRef.current.x
      const dy = e.clientY - lastMousePosRef.current.y
      lastMousePosRef.current = { x: e.clientX, y: e.clientY }
      const container = containerRef.current
      if (!container) return
      const { width: cw, height: ch } = container.getBoundingClientRect()
      setPan((prev) => clampPan(prev.x + dx, prev.y + dy, zoom, cw, ch))
    },
    [zoom, clampPan]
  )

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false
  }, [])

  // Pinch-to-zoom (touch)
  const getTouchDist = (t: TouchList) => {
    const dx = t[0].clientX - t[1].clientX
    const dy = t[0].clientY - t[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }
  const getTouchMid = (t: TouchList) => ({
    x: (t[0].clientX + t[1].clientX) / 2,
    y: (t[0].clientY + t[1].clientY) / 2,
  })

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      isPinchingRef.current = true
      isTouchPanningRef.current = false
      lastPinchDistRef.current = getTouchDist(e.touches)
      lastPinchMidRef.current = getTouchMid(e.touches)
    } else if (e.touches.length === 1) {
      // Single-finger pan only when zoomed in
      if (zoom > 1) {
        isTouchPanningRef.current = true
        lastTouchPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }
  }, [zoom])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 2 && isPinchingRef.current) {
        e.preventDefault()
        const dist = getTouchDist(e.touches)
        const mid = getTouchMid(e.touches)
        const scale = dist / lastPinchDistRef.current
        setZoom((prev) => {
          const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev * scale))
          zoomTowards(newZoom, mid.x, mid.y)
          return prev
        })
        lastPinchDistRef.current = dist
        lastPinchMidRef.current = mid
      } else if (e.touches.length === 1 && isTouchPanningRef.current) {
        e.preventDefault()
        const touch = e.touches[0]
        const dx = touch.clientX - lastTouchPosRef.current.x
        const dy = touch.clientY - lastTouchPosRef.current.y
        lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY }
        const container = containerRef.current
        if (!container) return
        const { width: cw, height: ch } = container.getBoundingClientRect()
        setPan((prev) => clampPan(prev.x + dx, prev.y + dy, zoom, cw, ch))
      }
    },
    [zoomTowards, clampPan, zoom]
  )

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length < 2) isPinchingRef.current = false
    if (e.touches.length === 0) isTouchPanningRef.current = false
  }, [])

  // Attach wheel and touch listeners (passive: false to allow preventDefault)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener("wheel", handleWheel, { passive: false })
    el.addEventListener("touchstart", handleTouchStart, { passive: true })
    el.addEventListener("touchmove", handleTouchMove, { passive: false })
    el.addEventListener("touchend", handleTouchEnd, { passive: true })
    return () => {
      el.removeEventListener("wheel", handleWheel)
      el.removeEventListener("touchstart", handleTouchStart)
      el.removeEventListener("touchmove", handleTouchMove)
      el.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd])

  const isOnFloor = (id: BuildingId) => floorBuildings[floor].includes(id)

  const buildingClass = (id: BuildingId, invisible = false) => {
    const onFloor = isOnFloor(id)

    if (!onFloor) {
      return cn(
        "transition-all duration-200 outline-none",
        "fill-muted/40 stroke-muted-foreground/30 opacity-40 cursor-default pointer-events-none"
      )
    }

    return cn(
      "cursor-pointer transition-all duration-200 outline-none",
      selected === id
        ? "fill-primary/30 stroke-primary"
        : invisible
        ? "fill-transparent stroke-transparent hover:fill-primary/10 hover:stroke-primary"
        : "fill-transparent stroke-foreground hover:fill-primary/10 hover:stroke-primary"
    )
  }

  const floorLabels: Record<Floor, string> = {
    1: "Etage 1",
    2: "Etage 2",
    3: "Etage 3",
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Floor plan */}
      <div className="bg-card border border-border rounded-xl p-1 md:p-6 relative">
        {/* Zoom + pan container */}
        <div
          ref={containerRef}
          className={cn(
            "overflow-hidden select-none rounded-lg",
            zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center center",
              transition: isDraggingRef.current ? "none" : "transform 0.05s linear",
              willChange: "transform",
            }}
          >
            <svg
              viewBox="0 0 239.73793 138.58737"
              className="w-full h-auto"
              role="group"
              aria-label="Interaktiver Schulplan mit anklickbaren Gebäuden und Bereichen"
            >
              <path
                id="building1"
                role={isOnFloor("building1") ? "button" : undefined}
                tabIndex={isOnFloor("building1") ? 0 : -1}
                aria-label="Gebäude A – Hauptgebäude"
                aria-disabled={!isOnFloor("building1")}
                onClick={() => handleSelect("building1")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleSelect("building1")
                  }
                }}
                className={buildingClass("building1")}
                style={{ strokeWidth: 1.2 }}
                d="M 46.616900,36.349588 42.957494,39.258407 30.851822,24.028987 0.185879,48.404949 33.664183,90.521989 64.330135,66.146029 52.010628,50.647609 l 3.659392,-2.90881 z"
              />
              <rect
                id="building2"
                role={isOnFloor("building2") ? "button" : undefined}
                tabIndex={isOnFloor("building2") ? 0 : -1}
                aria-label="Gebäude B – Naturwissenschaften"
                aria-disabled={!isOnFloor("building2")}
                onClick={() => handleSelect("building2")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleSelect("building2")
                  }
                }}
                className={buildingClass("building2")}
                style={{ strokeWidth: 1.2 }}
                width="41.79221"
                height="23.180557"
                x="146.257235"
                y="-32.859800"
                transform="rotate(50.254519)"
              />
              <path
                style={{
                  strokeWidth: 1.2,
                  fill: "none",
                  stroke: "currentColor",
                }}
                d="m 218.368035,40.095009 -3.05336,2.39381 -12.58914,-15.623807 -2.88773,2.327007 -3.60797,-4.477221 -39.39364,31.742681 -1.93484,-2.49389 -1.88945,1.46622 -10.42507,-13.436369 1.9934,-1.5464 -1.30539,-1.682627 14.00585,-10.86626 -10.64526,-13.72143 -15.92326,12.353753 -4.38255,-5.649471 1.79551,-1.392565 9.6e-4,0.0012 12.19171,-9.459754 -7.58435,-9.775326 -12.191628,9.459025 4.724204,6.08947 -1.795596,1.393293 -0.0016,-0.002 -2.779521,2.156805 7.243011,9.335735 -0.0748,0.05794 -9.952509,-12.82779 2.002742,-1.553722 L 110.816421,2.646473 87.906699,20.420446 83.112434,14.240784 63.382293,29.548247 77.269042,47.447819 96.999190,32.140351 l -0.0016,-0.002 17.795726,-13.807306 9.952426,12.828518 -2.239161,1.737105 -1.827892,-2.35579 -9.553045,7.411403 1.827886,2.355795 -17.164037,13.317323 10.645659,13.7211 27.338603,-21.21072 13.79965,17.78596 -5.77862,4.65584 10.08009,12.50975 2.81029,-2.26498 17.25782,21.41799 -13.3128,10.72675 9.8641,12.24178 24.84258,-20.0182 -9.86378,-12.24137 -1.58502,1.27746 -17.25822,-21.41768 40.75551,-32.839924 6.07642,7.540364 -7.02703,5.50916 11.23609,14.33183 -11.69207,9.16652 9.89253,12.61809 25.61192,-20.07964 -5.79005,-7.38532 0.0134,-0.0104 z"
              />
              <path
                id="haus3"
                role={isOnFloor("haus3") ? "button" : undefined}
                tabIndex={isOnFloor("haus3") ? 0 : -1}
                aria-label="Haus 3"
                aria-disabled={!isOnFloor("haus3")}
                onClick={() => handleSelect("haus3")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleSelect("haus3")
                  }
                }}
                className={buildingClass("haus3", true)}
                style={{ strokeWidth: 1.2 }}
                d="m 63.382291,29.548247 19.730141,-15.307463 4.794265,6.179662 22.909723,-17.773973 9.09134,11.716843 -2.00274,1.553722 9.9525,12.827791 -3.11178,2.414733 -9.95243,-12.828517 -37.52427,29.116775 z"
              />
              <path
                id="essenraum"
                role={isOnFloor("essenraum") ? "button" : undefined}
                tabIndex={isOnFloor("essenraum") ? 0 : -1}
                aria-label="Essenraum"
                aria-disabled={!isOnFloor("essenraum")}
                onClick={() => handleSelect("essenraum")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleSelect("essenraum")
                  }
                }}
                className={buildingClass("essenraum", true)}
                style={{ strokeWidth: 1.2 }}
                d="m 130.712170,26.530475 -4.38255,-5.64947 13.98818,-10.851119 -7.58435,-9.775326 -12.19162,9.4590248 4.7242,6.0894702 -4.57672,3.548098 7.24301,9.335735 z"
              />
              <path
                id="haus1"
                role={isOnFloor("haus1") ? "button" : undefined}
                tabIndex={isOnFloor("haus1") ? 0 : -1}
                aria-label="Haus 1"
                aria-disabled={!isOnFloor("haus1")}
                onClick={() => handleSelect("haus1")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleSelect("haus1")
                  }
                }}
                className={buildingClass("haus1", true)}
                style={{ strokeWidth: 1.2 }}
                d="m 143.274840,38.764412 14.00585,-10.86626 -10.64526,-13.721429 -24.12885,18.719945 -1.82789,-2.355789 -9.55305,7.411402 1.82789,2.355794 -17.164038,13.317323 10.645658,13.721101 27.3386,-21.210722 z"
              />
              <path
                id="foyer"
                role={isOnFloor("foyer") ? "button" : undefined}
                tabIndex={isOnFloor("foyer") ? 0 : -1}
                aria-label="Foyer"
                aria-disabled={!isOnFloor("foyer")}
                onClick={() => handleSelect("foyer")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleSelect("foyer")
                  }
                }}
                className={buildingClass("foyer", true)}
                style={{ strokeWidth: 1.2 }}
                d="m 133.773750,46.135777 13.79965,17.785961 9.26279,-7.464261 -1.93484,-2.493888 -1.88945,1.46622 -10.42507,-13.43637 1.9934,-1.546399 -1.30539,-1.682628 z"
              />
              <path
                id="haus2"
                role={isOnFloor("haus2") ? "button" : undefined}
                tabIndex={isOnFloor("haus2") ? 0 : -1}
                aria-label="Haus 2"
                aria-disabled={!isOnFloor("haus2")}
                onClick={() => handleSelect("haus2")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleSelect("haus2")
                  }
                }}
                className={buildingClass("haus2", true)}
                style={{ strokeWidth: 1.2 }}
                d="m 151.874870,81.087328 2.81029,-2.264979 17.25782,21.417992 -13.3128,10.72675 9.8641,12.24178 24.84258,-20.0182 -9.86378,-12.241373 -1.58502,1.277459 -17.25822,-21.417679 41.68043,-33.58521 -10.08044,-12.50907 -54.43505,43.862781 z"
              />
              <path
                id="haus5"
                role={isOnFloor("haus5") ? "button" : undefined}
                tabIndex={isOnFloor("haus5") ? 0 : -1}
                aria-label="Haus 5"
                aria-disabled={!isOnFloor("haus5")}
                onClick={() => handleSelect("haus5")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleSelect("haus5")
                  }
                }}
                className={buildingClass("haus5", true)}
                style={{ strokeWidth: 1.2 }}
                d="m 213.871290,87.135118 25.61192,-20.079639 -21.11518,-26.96047 -3.05336,2.39381 -12.58914,-15.623807 -3.812638,3.072323 12.548878,15.572184 -7.02703,5.509159 11.23609,14.331831 -11.69207,9.166519 z"
              />
            </svg>
          </div>
        </div>

        {/* Hint text – mb-14 reserves space so it never overlaps the corner controls */}
        <p className="text-center text-sm text-muted-foreground mt-4 mb-14">
          Klicke auf ein Gebäude oder einen Bereich, um mehr zu erfahren.
        </p>

        {/* Bottom-left: Floor selector */}
        <div
          className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex gap-1 bg-card border border-border rounded-lg p-1 shadow-sm"
          role="group"
          aria-label="Etagenauswahl"
        >
          {([1, 2, 3] as Floor[]).map((f) => (
            <button
              key={f}
              onClick={() => handleFloorChange(f)}
              className={cn(
                "w-9 h-9 rounded-md text-sm font-medium transition-all duration-200",
                floor === f
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
              aria-pressed={floor === f}
              aria-label={floorLabels[f]}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Bottom-right: Reset Zoom button – only visible when zoomed in */}
        {zoom > 1 && (
          <button
            onClick={resetZoom}
            className={cn(
              "absolute bottom-4 right-4 md:bottom-6 md:right-6",
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200",
              "bg-card border-border text-foreground hover:bg-secondary hover:text-foreground",
              "animate-in fade-in slide-in-from-bottom-1 duration-200"
            )}
          >
            Zoom zurücksetzen
          </button>
        )}
      </div>

      {/* Building details */}
      <div aria-live="polite">
        {selected ? (
          <div className="bg-card border border-border rounded-xl p-6 animate-in fade-in duration-300">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-3">
              {buildings[selected].name}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              {buildings[selected].description}
            </p>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
              Räume & Bereiche
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {buildings[selected].rooms.map((room) => (
                <li
                  key={room}
                  className="flex items-center gap-2 text-foreground bg-secondary rounded-lg px-3 py-2 text-sm"
                >
                  <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  {room}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-card/50 border border-dashed border-border rounded-xl p-6 text-center">
            <p className="text-muted-foreground">
              Noch kein Gebäude oder Bereich ausgewählt. Wähle ein Gebäude im Plan aus, um Details anzuzeigen.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
