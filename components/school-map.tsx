"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  MoreVertical,
  Search,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

import {
  DEFAULT_VIEWPORT_HEIGHT,
  MAX_ZOOM,
  MIN_ZOOM,
  STROKE_WIDTH,
  SVG_VIEWBOX_HEIGHT,
  SVG_VIEWBOX_WIDTH,
  floorLabels,
} from "@/lib/school-map/constants"
import { buildings, buildingsById } from "@/lib/school-map/data"
import {
  FELDSCHULE_HINTERGRUND_D,
  FELDSCHULE_TEILBARE_WAND_WEISS_D,
  FELDSCHULE_UMRISS_D,
} from "@/lib/school-map/feldschule-decor"
import { getFloorDetails, searchBuildings } from "@/lib/school-map/search"
import type { BuildingId, Floor, SearchResult } from "@/lib/school-map/types"
import { clampPan, getTouchDist, getTouchMid } from "@/lib/school-map/zoom"
import { renderBuildingShape } from "@/lib/school-map/render"
import { useBottomSheet } from "@/lib/school-map/use-bottom-sheet"

export function SchoolMap() {
  const [selected, setSelected] = useState<BuildingId | null>(null)
  const [floor, setFloor] = useState<Floor>(1)

  const [query, setQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [isExpandToggled, setIsExpandToggled] = useState(false)
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false)
  const [showProtectiveEquipment, setShowProtectiveEquipment] = useState(false)
  const optionsMenuRef = useRef<HTMLDivElement>(null)

  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const isPinchingRef = useRef(false)
  const lastPinchDistRef = useRef(0)
  const isDraggingRef = useRef(false)
  const lastMousePosRef = useRef({ x: 0, y: 0 })
  const isTouchPanningRef = useRef(false)
  const lastTouchPosRef = useRef({ x: 0, y: 0 })
  const zoomRef = useRef(1)

  const [viewportWidth, setViewportWidth] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const [searchBottom, setSearchBottom] = useState(0)

  // Vollbild: Karte über den ganzen Bildschirm, Details als ziehbares Bottom-Sheet.
  const isFullscreen = isExpandToggled

  const sheet = useBottomSheet({ enabled: isFullscreen, viewportHeight: windowHeight })

  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])

  // Auch beim Wechsel in den Vollbildmodus neu messen – z. B. wenn sich die
  // Fensterhöhe seit dem letzten resize-Ereignis geändert hat.
  useEffect(() => {
    const update = () => setWindowHeight(window.visualViewport?.height ?? window.innerHeight)
    update()
    window.addEventListener("resize", update)
    window.addEventListener("orientationchange", update)
    window.visualViewport?.addEventListener("resize", update)
    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("orientationchange", update)
      window.visualViewport?.removeEventListener("resize", update)
    }
  }, [isFullscreen])

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

  // Untere Kante der Suchleiste: im Vollbild die obere Grenze der sichtbaren Karte.
  useEffect(() => {
    const el = searchWrapperRef.current
    if (!el || typeof ResizeObserver === "undefined") return

    const updateBottom = () => {
      const next = el.getBoundingClientRect().bottom
      setSearchBottom((prev) => (Math.abs(prev - next) > 0.5 ? next : prev))
    }

    updateBottom()
    const observer = new ResizeObserver(updateBottom)
    observer.observe(el)
    return () => observer.disconnect()
  }, [isFullscreen, windowHeight])

  const baseViewportHeight =
    viewportWidth > 0
      ? (viewportWidth * SVG_VIEWBOX_HEIGHT) / SVG_VIEWBOX_WIDTH
      : DEFAULT_VIEWPORT_HEIGHT

  const handleFloorChange = useCallback(
    (newFloor: Floor) => {
      setFloor(newFloor)
      if (selected && !buildingsById[selected].floors[newFloor].clickable) setSelected(null)
    },
    [selected]
  )

  const handleSelect = useCallback(
    (id: BuildingId) => {
      if (!buildingsById[id].floors[floor].clickable) return
      setSelected((prev) => (prev === id ? null : id))
    },
    [floor]
  )

  const selectedDetails = useMemo(() => {
    if (!selected) return null
    return getFloorDetails(buildingsById[selected], floor)
  }, [selected, floor])

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
  }, [])

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
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

  useEffect(() => {
    if (!isOptionsMenuOpen) return

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (optionsMenuRef.current?.contains(target)) return
      setIsOptionsMenuOpen(false)
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("touchstart", handlePointerDown)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("touchstart", handlePointerDown)
    }
  }, [isOptionsMenuOpen])

  const zoomTowards = useCallback(
    (newZoom: number, clientX: number, clientY: number) => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const cw = rect.width
      const ch = rect.height
      const prevZoom = zoomRef.current
      const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom))

      const px = clientX - rect.left - cw / 2
      const py = clientY - rect.top - ch / 2
      const scale = clamped / prevZoom

      setPan((prevPan) =>
        clampPan(scale * (prevPan.x - px) + px, scale * (prevPan.y - py) + py, clamped, cw, ch)
      )
      zoomRef.current = clamped
      setZoom(clamped)
    },
    []
  )

  const resetZoom = () => {
    zoomRef.current = 1
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  // Beim Wechsel zwischen Vollbild und eingebetteter Ansicht ändert sich das
  // Seitenverhältnis – ein verschobener Ausschnitt würde danach verrutscht wirken.
  useEffect(() => {
    zoomRef.current = 1
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [isFullscreen])

  // Im Vollbild scrollt nur noch das Sheet, nicht die Seite dahinter.
  useEffect(() => {
    if (!isFullscreen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (isSearchOpen && query.trim().length > 0) return
      setIsExpandToggled(false)
    }
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isFullscreen, isSearchOpen, query])

  const { collapse: collapseSheet, revealDetails } = sheet
  useEffect(() => {
    if (!isFullscreen) return
    if (selected) revealDetails()
    else collapseSheet()
  }, [collapseSheet, isFullscreen, revealDetails, selected])

  const toggleSheet = useCallback(() => {
    if (sheet.isExpanded) sheet.collapse()
    else sheet.expand()
  }, [sheet])

  // Ein Tipp auf die Kopfzeile klappt das Sheet um; ein Ziehen darf das nicht auslösen.
  const sheetTapStartRef = useRef<{ x: number; y: number } | null>(null)
  const handleSheetHeaderClick = useCallback(
    (e: React.MouseEvent) => {
      const start = sheetTapStartRef.current
      sheetTapStartRef.current = null
      if (!start) return
      if (Math.abs(e.clientX - start.x) > 6 || Math.abs(e.clientY - start.y) > 6) return
      toggleSheet()
    },
    [toggleSheet]
  )

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      const delta = -e.deltaY * 0.0015
      const targetZoom = zoomRef.current + delta * zoomRef.current
      zoomTowards(targetZoom, e.clientX, e.clientY)
    },
    [zoomTowards]
  )

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomRef.current <= 1) return
    isDraggingRef.current = true
    lastMousePosRef.current = { x: e.clientX, y: e.clientY }
  }, [])

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
    []
  )

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false
  }, [])

  const isEventInsideCard = (target: EventTarget | null) => {
    if (!(target instanceof Node)) return false
    return Boolean(cardRef.current?.contains(target))
  }

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      isPinchingRef.current = true
      isTouchPanningRef.current = false
      lastPinchDistRef.current = getTouchDist(e.touches)
      return
    }

    if (e.touches.length === 1 && zoomRef.current > 1 && isEventInsideCard(e.target)) {
      isTouchPanningRef.current = true
      lastTouchPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
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
    [zoomTowards]
  )

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length < 2) isPinchingRef.current = false
    if (e.touches.length === 0) isTouchPanningRef.current = false
  }, [])

  useEffect(() => {
    const wheelEl = containerRef.current
    if (wheelEl) wheelEl.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("touchstart", handleTouchStart, { passive: false })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("touchend", handleTouchEnd, { passive: true })
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true })

    return () => {
      if (wheelEl) wheelEl.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
      window.removeEventListener("touchcancel", handleTouchEnd)
    }
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd])

  // Im Vollbild wandern die unteren Bedienelemente mit dem Sheet nach oben.
  const controlsBottom = Math.min(sheet.visibleHeight + 12, Math.round(windowHeight * 0.5))
  const sheetMotion = sheet.isDragging ? "none" : "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)"
  const controlsStyle = isFullscreen
    ? {
        bottom: controlsBottom,
        transition: sheet.isDragging ? "none" : "bottom 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
      }
    : undefined

  // Die Karte bleibt mittig zwischen Suchleiste und Sheet. Weil das eine reine
  // Verschiebung im Bildschirmraum ist, bleibt der aktuell zentrierte Punkt der
  // zentrierte Punkt – unabhängig von Zoom und Verschiebung.
  const mapShift =
    isFullscreen && windowHeight > 0
      ? Math.round((searchBottom + (windowHeight - sheet.visibleHeight)) / 2 - windowHeight / 2)
      : 0

  return (
    <div
      className={cn(
        isFullscreen
          ? "fixed inset-0 z-[60] overflow-hidden bg-background"
          : "flex flex-col gap-8"
      )}
    >
      <div
        ref={searchWrapperRef}
        className={cn(
          "relative z-30",
          isFullscreen &&
            "absolute left-3 right-3 top-3 z-40 md:left-4 md:right-auto md:top-4 md:w-[28rem]"
        )}
      >
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
              "w-full border border-border bg-card py-3 pl-10 pr-10 text-sm md:text-base",
              "text-foreground placeholder:text-muted-foreground",
              "outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/40",
              isFullscreen ? "rounded-full shadow-lg" : "rounded-xl"
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
                          Etage {result.floor}
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

      <div
        ref={cardRef}
        className={cn(
          isFullscreen
            ? "absolute inset-0 z-0"
            : "relative rounded-xl border border-border bg-card p-1 md:p-6"
        )}
      >
        <div className={isFullscreen ? "absolute inset-0" : "relative w-full"}>
          <div
            ref={containerRef}
            className={cn(
              "select-none overflow-hidden touch-none",
              isFullscreen ? "h-full w-full" : "rounded-lg",
              zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
            )}
            style={isFullscreen ? undefined : { height: baseViewportHeight }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className={isFullscreen ? "h-full w-full" : undefined}
              style={{
                transform: `translateY(${mapShift}px)`,
                transition: sheetMotion,
                willChange: "transform",
              }}
            >
            <div
              className={isFullscreen ? "h-full w-full" : undefined}
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "center center",
                transition: isDraggingRef.current ? "none" : "transform 0.05s linear",
                willChange: "transform",
              }}
            >
              <svg
                viewBox="0 0 155.79399 88.953056"
                className={cn("block", isFullscreen ? "h-full w-full" : "h-auto w-full")}
                role="group"
                aria-label="Interaktiver Schulplan"
              >
                {floor === 2 && (
                  <path
                    d={FELDSCHULE_UMRISS_D}
                    className="fill-transparent stroke-foreground pointer-events-none"
                    style={{ strokeWidth: STROKE_WIDTH }}
                    vectorEffect="non-scaling-stroke"
                    aria-hidden="true"
                  />
                )}
                {buildings
                  .filter((b) => b.floors[floor].visual === "disabled")
                  .map((b) =>
                    renderBuildingShape({
                      building: b,
                      mode: "disabled",
                      floor,
                      selected,
                      zoom,
                      onSelect: handleSelect,
                    })
                  )}
                {buildings
                  .filter((b) => b.floors[floor].visual === "visible")
                  .map((b) =>
                    renderBuildingShape({
                      building: b,
                      mode: "visible",
                      floor,
                      selected,
                      zoom,
                      onSelect: handleSelect,
                    })
                  )}
                {buildings
                  .filter((b) => b.floors[floor].visual === "hidden")
                  .map((b) =>
                    renderBuildingShape({
                      building: b,
                      mode: "hidden",
                      floor,
                      selected,
                      zoom,
                      onSelect: handleSelect,
                    })
                  )}
                {floor === 2 && (
                  <>
                    <path
                      d={FELDSCHULE_HINTERGRUND_D}
                      className="fill-card pointer-events-none"
                      aria-hidden="true"
                    />
                    <path
                      d={FELDSCHULE_TEILBARE_WAND_WEISS_D}
                      className="fill-white pointer-events-none"
                      aria-hidden="true"
                    />
                  </>
                )}
                {selected
                  ? renderBuildingShape({
                      building: buildingsById[selected],
                      mode: "selected",
                      floor,
                      selected,
                      zoom,
                      onSelect: handleSelect,
                    })
                  : null}
              </svg>
            </div>
            </div>
          </div>

          <div
            className={cn(
              "absolute z-20 flex flex-col gap-1 border border-border bg-card/90 p-1 shadow-md backdrop-blur-sm",
              isFullscreen
                ? "right-3 top-[4.5rem] rounded-xl md:right-4 md:top-4"
                : "right-0 top-0 rounded-lg md:right-2 md:top-2"
            )}
            role="group"
            aria-label="Kartenoptionen"
          >
            <button
              type="button"
              onClick={() => setIsExpandToggled((prev) => !prev)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-md transition-all duration-200",
                "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              aria-pressed={isExpandToggled}
              aria-label={isExpandToggled ? "Vollbild schließen" : "Karte im Vollbild öffnen"}
            >
              {isExpandToggled ? (
                <Minimize2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <div ref={optionsMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsOptionsMenuOpen((prev) => !prev)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md transition-all duration-200",
                  "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                aria-haspopup="menu"
                aria-expanded={isOptionsMenuOpen}
                aria-label="Weitere Kartenoptionen"
              >
                <MoreVertical className="h-4 w-4" aria-hidden="true" />
              </button>

              {isOptionsMenuOpen && (
                <div
                  role="menu"
                  aria-label="Weitere Kartenoptionen"
                  className={cn(
                    "absolute right-0 top-full z-30 mt-2 min-w-56 overflow-hidden",
                    "rounded-xl border border-border bg-popover shadow-lg",
                    "animate-in fade-in slide-in-from-top-1 duration-150"
                  )}
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setShowProtectiveEquipment((prev) => !prev)
                      setIsOptionsMenuOpen(false)
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-secondary"
                  >
                    {showProtectiveEquipment
                      ? "Schutzeinrichtungen ausblenden"
                      : "Schutzeinrichtungen einblenden"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            className={cn(
              "absolute z-20 flex gap-1 border border-border bg-card/90 p-1 shadow-md backdrop-blur-sm",
              isFullscreen
                ? "left-3 rounded-xl md:left-4"
                : "bottom-1 left-1 rounded-lg md:bottom-5 md:left-5"
            )}
            style={controlsStyle}
            role="group"
            aria-label="Etagenauswahl"
          >
            {([1, 2, 3] as Floor[]).map((f) => (
              <button
                key={f}
                onClick={() => handleFloorChange(f)}
                className={cn(
                  "h-9 w-9 rounded-md text-sm font-medium transition-all duration-200",
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

          {zoom > 1 && (
            <button
              onClick={resetZoom}
              style={controlsStyle}
              className={cn(
                "absolute z-20 border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                "border-border bg-card/90 text-foreground shadow-md backdrop-blur-sm hover:bg-secondary",
                isFullscreen
                  ? "right-3 rounded-xl md:right-4"
                  : "bottom-1 right-1 rounded-lg md:bottom-5 md:right-5"
              )}
            >
              Zoom zurücksetzen
            </button>
          )}
        </div>

        {!isFullscreen && (
          <p className="text-balance text-center text-sm leading-relaxed text-muted-foreground md:text-base">
            Klicke auf ein Gebäude oder einen Bereich, um mehr zu erfahren.
          </p>
        )}
      </div>

      {isFullscreen ? (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-40 flex flex-col overflow-hidden",
            "rounded-t-2xl border-t border-border bg-card shadow-[0_-8px_30px_rgba(0,0,0,0.25)]"
          )}
          style={{
            height: sheet.visibleHeight,
            transition: sheet.isDragging ? "none" : "height 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          aria-live="polite"
        >
          <div
            onPointerDown={(e) => {
              sheetTapStartRef.current = { x: e.clientX, y: e.clientY }
              sheet.dragHandlers.onPointerDown(e)
            }}
            onClick={handleSheetHeaderClick}
            className="shrink-0 cursor-grab touch-none select-none px-5 pb-3 pt-2 active:cursor-grabbing"
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border" aria-hidden="true" />
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-bold text-foreground md:text-xl">
                  {selected ? buildingsById[selected].name : "Schulplan Gymnasium Wandlitz"}
                </h2>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {selected
                    ? `${floorLabels[floor]} · ${selectedDetails?.rooms.length ?? 0} Räume & Bereiche`
                    : "Tippe auf ein Gebäude, um Details zu sehen"}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSheet()
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label={sheet.isExpanded ? "Details einklappen" : "Details ausklappen"}
                aria-expanded={sheet.isExpanded}
              >
                {sheet.isExpanded ? (
                  <ChevronDown className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <ChevronUp className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
              {selected && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelected(null)
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Auswahl aufheben"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-10"
            style={{ touchAction: "pan-y" }}
          >
            {selected && selectedDetails ? (
              <>
                <span className="inline-flex rounded-lg bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">
                  {floorLabels[floor]}
                </span>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {selectedDetails.description}
                </p>
                {selectedDetails.rooms.length > 0 && (
                  <>
                    <h3 className="mt-5 mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
                      Räume & Bereiche
                    </h3>
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {selectedDetails.rooms.map((room) => (
                        <li
                          key={room}
                          className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm text-foreground"
                        >
                          <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                          {room}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            ) : (
              <p className="leading-relaxed text-muted-foreground">
                Noch kein Gebäude oder Bereich ausgewählt. Wähle ein Gebäude im Plan aus oder nutze
                die Suche, um Details anzuzeigen. Ziehe diese Leiste nach oben, um mehr Platz für die
                Beschreibung zu bekommen.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div aria-live="polite">
        {selected && selectedDetails ? (
          <div className="animate-in fade-in rounded-xl border border-border bg-card p-6 duration-300">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-primary md:text-2xl">
                {buildingsById[selected].name}
              </h2>
              <span className="ml-auto shrink-0 rounded-lg bg-primary/15 px-3 py-1 text-sm font-semibold text-primary md:text-base">
                Etage {floor}
              </span>
            </div>
            <p className="leading-relaxed text-muted-foreground">{selectedDetails.description}</p>
            {selectedDetails.rooms.length > 0 && (
              <>
                <h3 className="mt-5 mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
                  Räume & Bereiche
                </h3>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {selectedDetails.rooms.map((room) => (
                    <li
                      key={room}
                      className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm text-foreground"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      {room}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
            <p className="text-muted-foreground">
              Noch kein Gebäude oder Bereich ausgewählt. Wähle ein Gebäude im Plan aus, um Details anzuzeigen.
            </p>
          </div>
        )}
        </div>
      )}
    </div>
  )
}