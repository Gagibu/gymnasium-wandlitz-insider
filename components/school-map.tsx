"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Minus, Plus, RotateCcw, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  ALL_FLOORS,
  LABEL_MAX_FONT_SIZE,
  LABEL_TARGET_PX,
  MAX_ZOOM,
  MIN_ZOOM,
  SVG_VIEWBOX,
  SVG_VIEWBOX_HEIGHT,
  SVG_VIEWBOX_WIDTH,
  ZOOM_STEP,
  floorLabels,
} from "@/lib/school-map/constants"
import { buildings, buildingsById } from "@/lib/school-map/data"
import { getFloorDetails, searchBuildings } from "@/lib/school-map/search"
import type { BuildingData, BuildingId, Floor, RenderMode, SearchResult } from "@/lib/school-map/types"
import { clampPan, clampZoom, getTouchDist, getTouchMid } from "@/lib/school-map/zoom"
import { BuildingLabel, BuildingShape, getRenderMode } from "@/lib/school-map/render"

/** Zeichenreihenfolge: interaktive Flächen liegen über den Umrissen, die Auswahl ganz oben. */
const LAYER_ORDER: RenderMode[] = ["disabled", "outline", "interactive", "selected"]

export function SchoolMap() {
  const [selected, setSelected] = useState<BuildingId | null>(null)
  const [floor, setFloor] = useState<Floor>(1)

  const [query, setQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  const isPinchingRef = useRef(false)
  const lastPinchDistRef = useRef(0)
  const isDraggingRef = useRef(false)
  const lastPointerRef = useRef({ x: 0, y: 0 })
  const isTouchPanningRef = useRef(false)
  const zoomRef = useRef(1)

  const [viewportWidth, setViewportWidth] = useState(0)

  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])

  // Breite des Kartenausschnitts – daraus wird die Schriftgröße der Beschriftungen abgeleitet.
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof ResizeObserver === "undefined") return

    const updateWidth = () => {
      const next = el.getBoundingClientRect().width
      setViewportWidth((prev) => (Math.abs(prev - next) > 0.5 ? next : prev))
    }

    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /**
   * Beschriftungen sollen auf jedem Gerät gleich groß erscheinen: Die Schriftgröße in
   * viewBox-Einheiten wird aus der Zielgröße in Pixeln zurückgerechnet. Wird sie zu groß
   * (schmales Display), würden die Beschriftungen überlappen – dann bleiben sie aus, bis
   * weit genug hineingezoomt wurde.
   */
  const labelFontSize =
    viewportWidth > 0 ? (LABEL_TARGET_PX * SVG_VIEWBOX_WIDTH) / (viewportWidth * zoom) : 0
  const showLabels = labelFontSize > 0 && labelFontSize <= LABEL_MAX_FONT_SIZE

  const handleFloorChange = useCallback(
    (newFloor: Floor) => {
      setFloor(newFloor)
      if (selected && !buildingsById[selected].floors[newFloor].clickable) setSelected(null)
    },
    [selected]
  )

  const handleSelect = useCallback((id: BuildingId) => {
    setSelected((prev) => (prev === id ? null : id))
  }, [])

  const selectedDetails = useMemo(
    () => (selected ? getFloorDetails(buildingsById[selected], floor) : null),
    [selected, floor]
  )

  /** Flächen der aktuellen Etage, bereits in Zeichenreihenfolge sortiert. */
  const shapes = useMemo(() => {
    const byMode = new Map<RenderMode, BuildingData[]>()
    for (const building of buildings) {
      const mode = getRenderMode(building, floor, selected)
      if (!mode) continue
      const list = byMode.get(mode)
      if (list) list.push(building)
      else byMode.set(mode, [building])
    }
    return LAYER_ORDER.flatMap((mode) =>
      (byMode.get(mode) ?? []).map((building) => ({ building, mode }))
    )
  }, [floor, selected])

  const labelledBuildings = useMemo(
    () => buildings.filter((b) => b.label && b.floors[floor].clickable),
    [floor]
  )

  const searchResults = useMemo(() => searchBuildings(query), [query])

  const closeSearchResults = useCallback(() => {
    setIsSearchOpen(false)
    setActiveIndex(-1)
  }, [])

  const handleResultSelect = useCallback((result: SearchResult) => {
    setFloor(result.floor)
    setSelected(result.id)
    setQuery("")
    setIsSearchOpen(false)
    setActiveIndex(-1)
    searchInputRef.current?.blur()
    // Details liegen unterhalb der Karte – nach der Auswahl in den sichtbaren Bereich holen.
    requestAnimationFrame(() =>
      detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    )
  }, [])

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return
    if (e.key === "Escape") return closeSearchResults()
    if (searchResults.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setIsSearchOpen(true)
      setActiveIndex((prev) => (prev + 1) % searchResults.length)
      return
    }

    if (e.key === "ArrowUp") {
      e.preventDefault()
      setIsSearchOpen(true)
      setActiveIndex((prev) => (prev <= 0 ? searchResults.length - 1 : prev - 1))
      return
    }

    if (e.key === "Enter") {
      e.preventDefault()
      const result = searchResults[activeIndex >= 0 ? activeIndex : 0]
      if (result) handleResultSelect(result)
    }
  }

  useEffect(() => {
    setActiveIndex(-1)
  }, [query])

  useEffect(() => {
    if (!isSearchOpen) return

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (searchWrapperRef.current?.contains(target)) return
      closeSearchResults()
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("touchstart", handlePointerDown)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("touchstart", handlePointerDown)
    }
  }, [isSearchOpen, closeSearchResults])

  /** Zoomt auf einen Bildschirmpunkt zu, sodass der Punkt unter dem Finger/Cursor bleibt. */
  const zoomTowards = useCallback((newZoom: number, clientX: number, clientY: number) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const prevZoom = zoomRef.current
    const clamped = clampZoom(newZoom)
    if (clamped === prevZoom) return

    const px = clientX - rect.left - rect.width / 2
    const py = clientY - rect.top - rect.height / 2
    const scale = clamped / prevZoom

    setPan((prevPan) =>
      clampPan(
        scale * (prevPan.x - px) + px,
        scale * (prevPan.y - py) + py,
        clamped,
        rect.width,
        rect.height
      )
    )
    zoomRef.current = clamped
    setZoom(clamped)
  }, [])

  /** Zoomt per Schaltfläche auf die Mitte des Kartenausschnitts. */
  const zoomByStep = useCallback(
    (factor: number) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      zoomTowards(zoomRef.current * factor, rect.left + rect.width / 2, rect.top + rect.height / 2)
    },
    [zoomTowards]
  )

  const resetZoom = useCallback(() => {
    zoomRef.current = 1
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  /**
   * Nur Strg/⌘ + Mausrad (und damit auch Trackpad-Pinch) zoomt. Einfaches Scrollen bleibt
   * dem Scrollen der Seite vorbehalten – sonst „fängt“ die Karte die Seite beim Vorbeiscrollen ein.
   */
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      const delta = -e.deltaY * 0.01
      zoomTowards(zoomRef.current * (1 + delta), e.clientX, e.clientY)
    },
    [zoomTowards]
  )

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomRef.current <= 1) return
    isDraggingRef.current = true
    setIsDragging(true)
    lastPointerRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - lastPointerRef.current.x
    const dy = e.clientY - lastPointerRef.current.y
    lastPointerRef.current = { x: e.clientX, y: e.clientY }
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setPan((prev) => clampPan(prev.x + dx, prev.y + dy, zoomRef.current, rect.width, rect.height))
  }, [])

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false
    setIsDragging(false)
  }, [])

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      isPinchingRef.current = true
      isTouchPanningRef.current = false
      lastPinchDistRef.current = getTouchDist(e.touches)
      return
    }

    if (e.touches.length === 1 && zoomRef.current > 1) {
      isTouchPanningRef.current = true
      lastPointerRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }, [])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 2 && isPinchingRef.current) {
        e.preventDefault()
        const dist = getTouchDist(e.touches)
        const mid = getTouchMid(e.touches)
        const scale = dist / Math.max(lastPinchDistRef.current, 1)
        zoomTowards(zoomRef.current * scale, mid.x, mid.y)
        lastPinchDistRef.current = dist
        return
      }

      if (e.touches.length === 1 && isTouchPanningRef.current) {
        e.preventDefault()
        const touch = e.touches[0]
        const dx = touch.clientX - lastPointerRef.current.x
        const dy = touch.clientY - lastPointerRef.current.y
        lastPointerRef.current = { x: touch.clientX, y: touch.clientY }
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        setPan((prev) => clampPan(prev.x + dx, prev.y + dy, zoomRef.current, rect.width, rect.height))
      }
    },
    [zoomTowards]
  )

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length < 2) isPinchingRef.current = false
    if (e.touches.length === 0) isTouchPanningRef.current = false
  }, [])

  // Zoom-/Pan-Gesten hängen am Kartenausschnitt, nicht am Fenster – so bleibt der Rest
  // der Seite normal bedienbar (Scrollen, Pinch-Zoom des Browsers).
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    el.addEventListener("wheel", handleWheel, { passive: false })
    el.addEventListener("touchstart", handleTouchStart, { passive: false })
    el.addEventListener("touchmove", handleTouchMove, { passive: false })
    el.addEventListener("touchend", handleTouchEnd, { passive: true })
    el.addEventListener("touchcancel", handleTouchEnd, { passive: true })

    return () => {
      el.removeEventListener("wheel", handleWheel)
      el.removeEventListener("touchstart", handleTouchStart)
      el.removeEventListener("touchmove", handleTouchMove)
      el.removeEventListener("touchend", handleTouchEnd)
      el.removeEventListener("touchcancel", handleTouchEnd)
    }
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd])

  const canZoomIn = zoom < MAX_ZOOM - 0.001
  const canZoomOut = zoom > MIN_ZOOM + 0.001

  return (
    <div className="flex flex-col gap-6">
      {/* Suche */}
      <div ref={searchWrapperRef} className="relative z-30">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsSearchOpen(true)
            }}
            onFocus={() => setIsSearchOpen(true)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Gebäude, Raum oder Bereich suchen …"
            aria-label="Gebäudeteile und Räume durchsuchen"
            role="combobox"
            aria-expanded={isSearchOpen && searchResults.length > 0}
            aria-controls="schulplan-suchergebnisse"
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 && searchResults[activeIndex]
                ? `suchergebnis-${searchResults[activeIndex].key}`
                : undefined
            }
            className={cn(
              "w-full rounded-xl border border-border bg-card py-3 pl-10 pr-10 text-sm md:text-base",
              "text-foreground placeholder:text-muted-foreground",
              "outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/40"
            )}
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                setActiveIndex(-1)
                searchInputRef.current?.focus()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Suche zurücksetzen"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {isSearchOpen && query.trim().length > 0 && (
          <div
            id="schulplan-suchergebnisse"
            role="listbox"
            aria-label="Suchergebnisse"
            className={cn(
              "absolute left-0 right-0 top-full mt-2 max-h-80 overflow-y-auto",
              "rounded-xl border border-border bg-popover shadow-lg",
              "animate-in fade-in slide-in-from-top-1 duration-150"
            )}
          >
            {searchResults.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">
                Keine Treffer für &bdquo;{query}&ldquo;.
              </p>
            ) : (
              <ul className="flex flex-col p-1">
                {searchResults.map((result, index) => (
                  <li key={result.key}>
                    <button
                      type="button"
                      id={`suchergebnis-${result.key}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => handleResultSelect(result)}
                      className={cn(
                        "flex w-full flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-colors",
                        index === activeIndex ? "bg-secondary" : "hover:bg-secondary/60",
                        selected === result.id && floor === result.floor ? "ring-1 ring-primary" : null
                      )}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-foreground">
                          {result.building.name}
                        </span>
                        <span className="shrink-0 rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                          {floorLabels[result.floor]}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {result.matchedRooms.length > 0
                          ? result.matchedRooms.join(", ")
                          : result.details.description}
                      </span>
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70">
                        Treffer in: {result.matchedIn.join(" · ")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Karte */}
      <div className="rounded-xl border border-border bg-card p-2 md:p-6">
        <div className="relative">
          <div
            ref={containerRef}
            className={cn(
              "relative w-full select-none overflow-hidden rounded-lg",
              "min-h-64 sm:min-h-0",
              // Nur bei aktivem Zoom die Touch-Gesten vollständig übernehmen,
              // sonst bleibt vertikales Scrollen über der Karte möglich.
              zoom > 1 ? "touch-none" : "touch-pan-y",
              zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
            )}
            style={{ aspectRatio: `${SVG_VIEWBOX_WIDTH} / ${SVG_VIEWBOX_HEIGHT}` }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.12s ease-out",
                willChange: "transform",
              }}
            >
              <svg
                viewBox={SVG_VIEWBOX}
                className="block h-auto max-h-full w-full"
                role="group"
                aria-label={`Interaktiver Schulplan, ${floorLabels[floor]}`}
              >
                {shapes.map(({ building, mode }) => (
                  <BuildingShape
                    key={building.id}
                    building={building}
                    mode={mode}
                    floor={floor}
                    zoom={zoom}
                    onSelect={handleSelect}
                  />
                ))}
                {showLabels &&
                  labelledBuildings.map((building) => (
                    <BuildingLabel
                      key={`label-${building.id}`}
                      building={building}
                      fontSize={labelFontSize}
                      isSelected={selected === building.id}
                    />
                  ))}
              </svg>
            </div>
          </div>

          {/* Etagenauswahl */}
          <div
            className="absolute bottom-2 left-2 z-20 flex gap-1 rounded-lg border border-border bg-card/90 p-1 shadow-md backdrop-blur-sm md:bottom-4 md:left-4"
            role="group"
            aria-label="Etage auswählen"
          >
            {ALL_FLOORS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => handleFloorChange(f)}
                className={cn(
                  "h-9 w-9 rounded-md text-sm font-medium transition-colors",
                  floor === f
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                aria-pressed={floor === f}
                aria-label={floorLabels[f]}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Zoomsteuerung */}
          <div
            className="absolute bottom-2 right-2 z-20 flex gap-1 rounded-lg border border-border bg-card/90 p-1 shadow-md backdrop-blur-sm md:bottom-4 md:right-4"
            role="group"
            aria-label="Zoom"
          >
            <button
              type="button"
              onClick={() => zoomByStep(1 / ZOOM_STEP)}
              disabled={!canZoomOut}
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              aria-label="Herauszoomen"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => zoomByStep(ZOOM_STEP)}
              disabled={!canZoomIn}
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              aria-label="Hineinzoomen"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              disabled={!canZoomOut}
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              aria-label="Ansicht zurücksetzen"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Legende */}
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-sm border border-primary/40 bg-primary/5" />
            anklickbar
          </li>
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-sm border border-primary bg-primary/30" />
            ausgewählt
          </li>
          <li className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-sm border border-muted-foreground/30" />
            andere Etage
          </li>
        </ul>

        <p className="mt-3 text-balance text-center text-sm leading-relaxed text-muted-foreground">
          Tippe oder klicke auf ein Gebäude, um mehr zu erfahren. Zoomen mit den Schaltflächen,
          zwei Fingern oder Strg&nbsp;+&nbsp;Mausrad.
        </p>
      </div>

      {/* Details */}
      <div ref={detailsRef} aria-live="polite">
        {selected && selectedDetails ? (
          <div className="animate-in fade-in rounded-xl border border-border bg-card p-6 duration-300">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-primary md:text-2xl">
                {buildingsById[selected].name}
              </h2>
              <span className="ml-auto shrink-0 rounded-lg bg-primary/15 px-3 py-1 text-sm font-semibold text-primary md:text-base">
                {floorLabels[floor]}
              </span>
            </div>
            <p className="leading-relaxed text-muted-foreground">{selectedDetails.description}</p>
            {selectedDetails.rooms.length > 0 && (
              <>
                <h3 className="mb-3 mt-5 text-sm font-semibold uppercase tracking-wider text-foreground">
                  Räume &amp; Bereiche
                </h3>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {selectedDetails.rooms.map((room) => (
                    <li
                      key={room}
                      className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm text-foreground"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                      {room}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-5 text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
            >
              Auswahl aufheben
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
            <p className="text-muted-foreground">
              Noch nichts ausgewählt. Wähle ein Gebäude im Plan aus oder nutze die Suche, um Details
              anzuzeigen.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
