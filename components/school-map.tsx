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
const MAX_ZOOM = 5

const SVG_VIEWBOX_WIDTH = 247.73793
const SVG_VIEWBOX_HEIGHT = 146.58737
const DEFAULT_VIEWPORT_HEIGHT = 240


export function SchoolMap() {
  const [selected, setSelected] = useState<BuildingId | null>(null)
  const [floor, setFloor] = useState<Floor>(1)

  // Zoom & pan state
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const isPinchingRef = useRef(false)
  const lastPinchDistRef = useRef(0)
  const lastPinchMidRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const lastMousePosRef = useRef({ x: 0, y: 0 })
  // Single-finger touch pan
  const isTouchPanningRef = useRef(false)
  const lastTouchPosRef = useRef({ x: 0, y: 0 })
  const zoomRef = useRef(1)

  const [viewportWidth, setViewportWidth] = useState(0)

  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof ResizeObserver === "undefined") return

    const updateWidth = () => {
      const next = el.getBoundingClientRect().width
      setViewportWidth((prev) => (Math.abs(prev - next) > 0.5 ? next : prev))
    }

    updateWidth()

    const observer = new ResizeObserver(() => {
      updateWidth()
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const baseViewportHeight =
    viewportWidth > 0
      ? (viewportWidth * SVG_VIEWBOX_HEIGHT) / SVG_VIEWBOX_WIDTH
      : DEFAULT_VIEWPORT_HEIGHT

  const viewportZoomFactor = Math.min(zoom, 2)
  const mapViewportHeight = baseViewportHeight * viewportZoomFactor

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
      const prevZoom = zoomRef.current
      const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom))

      // Point relative to container center
      const px = clientX - rect.left - cw / 2
      const py = clientY - rect.top - ch / 2

      const scale = clamped / prevZoom

      setPan((prevPan) => {
        // Adjust pan so the point under cursor stays fixed
        const newPanX = scale * (prevPan.x - px) + px
        const newPanY = scale * (prevPan.y - py) + py
        return clampPan(newPanX, newPanY, clamped, cw, ch)
      })

      zoomRef.current = clamped
      setZoom(clamped)
    },
    [clampPan]
  )

  const resetZoom = () => {
    zoomRef.current = 1
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  // Mouse wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      const delta = -e.deltaY * 0.0015
      const targetZoom = zoomRef.current + delta * zoomRef.current
      zoomTowards(targetZoom, e.clientX, e.clientY)
    },
    [zoomTowards]
  )

  // Mouse drag pan
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoomRef.current <= 1) return
      isDraggingRef.current = true
      lastMousePosRef.current = { x: e.clientX, y: e.clientY }
    },
    []
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingRef.current) return
      const dx = e.clientX - lastMousePosRef.current.x
      const dy = e.clientY - lastMousePosRef.current.y
      lastMousePosRef.current = { x: e.clientX, y: e.clientY }
      const container = containerRef.current
      if (!container) return
      const { width: cw, height: ch } = container.getBoundingClientRect()
      setPan((prev) => clampPan(prev.x + dx, prev.y + dy, zoomRef.current, cw, ch))
    },
    [clampPan]
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

  const isEventInsideCard = (target: EventTarget | null) => {
    if (!(target instanceof Node)) return false
    return Boolean(cardRef.current?.contains(target))
  }

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault()
        isPinchingRef.current = true
        isTouchPanningRef.current = false
        lastPinchDistRef.current = getTouchDist(e.touches)
        lastPinchMidRef.current = getTouchMid(e.touches)
        return
      }

      if (e.touches.length === 1 && zoomRef.current > 1 && isEventInsideCard(e.target)) {
        isTouchPanningRef.current = true
        lastTouchPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    },
    []
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 2 && isPinchingRef.current) {
        e.preventDefault()
        const dist = getTouchDist(e.touches)
        const mid = getTouchMid(e.touches)
        const scale = dist / Math.max(lastPinchDistRef.current, 1)
        const targetZoom = zoomRef.current * scale
        zoomTowards(targetZoom, mid.x, mid.y)
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
        setPan((prev) => clampPan(prev.x + dx, prev.y + dy, zoomRef.current, cw, ch))
      }
    },
    [zoomTowards, clampPan]
  )

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length < 2) isPinchingRef.current = false
    if (e.touches.length === 0) isTouchPanningRef.current = false
  }, [])

  // Attach wheel to map viewport and touch listeners to the entire page
  useEffect(() => {
    const wheelEl = containerRef.current
    if (wheelEl) {
      wheelEl.addEventListener("wheel", handleWheel, { passive: false })
    }
    window.addEventListener("touchstart", handleTouchStart, { passive: false })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("touchend", handleTouchEnd, { passive: true })
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true })

    return () => {
      if (wheelEl) {
        wheelEl.removeEventListener("wheel", handleWheel)
      }
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
      window.removeEventListener("touchcancel", handleTouchEnd)
    }
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd])

  const isOnFloor = (id: BuildingId) => floorBuildings[floor].includes(id)

  const buildingClass = (id: BuildingId, invisible = false) => {
    const onFloor = isOnFloor(id)

    // 4. Fall
    if (!onFloor) {
      return cn(
        "transition-all duration-200 outline-none",
        invisible
          ? "fill-transparent stroke-transparent pointer-events-none"
          : "fill-transparent stroke-muted-foreground/50 pointer-events-none"
      )
    }

    // 1. Fall
    if (selected === id) {
      return cn(
        "cursor-pointer transition-all duration-200 outline-none",
        "fill-primary/30 stroke-primary"
      )
    }

    // 2. Fall
    if (invisible) {
      return cn(
        "cursor-pointer transition-all duration-200 outline-none",
        "fill-transparent stroke-transparent hover:fill-primary/10 hover:stroke-primary"
      )
    }

    // 3. Fall
    return cn(
      "cursor-pointer transition-all duration-200 outline-none",
      "fill-transparent stroke-foreground hover:fill-primary/10 hover:stroke-primary"
    )
  }

  const floorLabels: Record<Floor, string> = {
    1: "Etage 1",
    2: "Etage 2",
    3: "Etage 3",
  }

  const STROKE_WIDTH = 1.2

  const sharedStrokeStyle = {
    strokeWidth: STROKE_WIDTH / zoom,
  }

  const outlineStrokeStyle = {
    strokeWidth: STROKE_WIDTH / zoom,
    fill: "none",
    stroke: "currentColor",
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Floor plan */}
      <div ref={cardRef} className="bg-card border border-border rounded-xl p-1 md:p-6 relative">
        <div className="relative w-full">
          {/* Zoom + pan container */}
          <div
            ref={containerRef}
            className={cn(
              "overflow-hidden select-none rounded-lg touch-none",
              zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
            )}
            style={{ height: mapViewportHeight }}
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
                viewBox="-4 -4 163.79399 96.973282"
                className="w-full h-auto block"
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
                  vectorEffect="non-scaling-stroke"
                  style={sharedStrokeStyle}
                  d="m 20.758603,14.902796 8.333045,10.131956 2.187088,-1.79046 6.076279,7.422309 -2.187088,1.790461 8.017415,9.840493 -20.61788,16.878842 -22.426739,-27.39476 z"
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
                  vectorEffect="non-scaling-stroke"
                  style={sharedStrokeStyle}
                  width="26.458336"
                  height="14.552083"
                  x="95.044033"
                  y="-22.734944"
                  transform="rotate(50.694505)"
                />
                <path
                  vectorEffect="non-scaling-stroke"
                  style={outlineStrokeStyle}
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
                  vectorEffect="non-scaling-stroke"
                  style={sharedStrokeStyle}
                  d="m 72.634817,1.240357 5.92951,7.243026 -1.68526,1.379636 7.10362,8.67723 -2.18719,1.790646 -7.103671,-8.677288 -23.55778,19.285593 -9.745532,-11.904383 13.195222,-10.802278 3.816023,4.661358 z"
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
                  vectorEffect="non-scaling-stroke"
                  style={sharedStrokeStyle}
                  d="m 85.739717,17.101957 -1.75703,1.438292 -4.90281,-5.988508 2.99211,-2.449495 -3.00303,-3.709023 7.63757,-6.2525 4.75544,5.808876 -8.89199,7.280459 z"
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
                  vectorEffect="non-scaling-stroke"
                  style={sharedStrokeStyle}
                  d="m 95.922977,8.765417 6.54595,7.996014 -32.557782,26.65342 -6.545929,-7.995997 11.007967,-9.01168 -1.52641,-1.864544 6.346614,-5.195658 1.52641,1.864544 z"
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
                  vectorEffect="non-scaling-stroke"
                  style={sharedStrokeStyle}
                  d="m 93.038647,24.481535 1.23287,1.505975 -1.50501,1.23207 8.39266,10.257969 -4.40928,3.609657 -9.62854,-11.761473 z"
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
                  vectorEffect="non-scaling-stroke"
                  style={sharedStrokeStyle}
                  d="m 127.043077,16.287670 6.2809,7.672263 -25.80861,21.194663 11.31566,13.903363 0.65775,-0.47475 6.35513,7.762942 -15.81274,12.945112 -6.35514,-7.76294 8.58765,-7.030281 -11.42733,-13.958734 -1.60485,1.330484 -6.28089,-7.672248 z"
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
                  vectorEffect="non-scaling-stroke"
                  style={sharedStrokeStyle}
                  d="m 131.861447,16.945308 -2.56258,2.09786 8.38633,10.24409 -4.48684,3.673151 7.36895,9.001338 -8.01148,6.558608 6.51667,7.960264 16.58077,-13.573856 -13.88512,-16.962021 -1.52037,1.244655 z"
                />
              </svg>
            </div>
          </div>

          <div
            className="absolute bottom-1 left-1 md:bottom-5 md:left-5 z-20 flex gap-1 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-1 shadow-md"
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

          {/* Reset Zoom – floats over map, bottom-right; only visible when zoomed in */}
          {zoom > 1 && (
            <button
              onClick={resetZoom}
              className={cn(
                "absolute bottom-1 right-1 md:bottom-5 md:right-5 z-20",
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200",
                "bg-card/90 backdrop-blur-sm border-border text-foreground hover:bg-secondary",
                "animate-in fade-in slide-in-from-bottom-1 duration-200 shadow-md"
              )}
            >
              Zoom zurücksetzen
            </button>
          )}
        </div>

        {/* Hint text */}
        <p className="text-center text-sm md:text-base leading-relaxed text-muted-foreground text-balance">
          Klicke auf ein Gebäude oder einen Bereich, um mehr zu erfahren.
        </p>
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
