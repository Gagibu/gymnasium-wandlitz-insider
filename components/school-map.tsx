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
  | "Archiv"
  | "Foyer2"
  | "Bibliothek"
  | "uUukH"
  | "L1oB"
  | "zaub"
  | "Bergs-komp"
  | "nTal"
  | "haus25"

type Floor = 1 | 2 | 3

type VisualState = "visible" | "hidden" | "disabled"

interface BuildingInfo {
  id: BuildingId
  name: string
  shortName: string
  description: string
  rooms: string[]
}

type FloorState = {
  visual: VisualState
  clickable: boolean
}

type ShapeGeometry =
  | {
      kind: "path"
      d: string
    }
  | {
      kind: "rect"
      width: number
      height: number
      x: number
      y: number
      transform?: string
    }

type ShapeDef = {
  id: BuildingId
  ariaLabel: string
  geometry: ShapeGeometry
  floors: Record<Floor, FloorState>
}

const buildings: Record<BuildingId, BuildingInfo> = {
  building1: {
    id: "building1",
    name: "Turnhalle – Sport",
    shortName: "Turnhalle",
    description:
      "Die Turnhalle beherbergt die große Halle, die Umkleiden und Toiletten.",
    rooms: ["Große Halle (gH1 / gH2)", "Umkleiden", "Toiletten"],
  },
  building2: {
    id: "building2",
    name: "Feldschule – Gesellschaftswissenschaften",
    shortName: "Feldschule",
    description:
      "Hier liegen die Fachräume für Gesellschaftswissenschaften mit den dazugehörigen Fluren und Nebenräumen.",
    rooms: ["Geschichte-Fachräume", "Politische Bildung", "Erdkunde", "Toiletten"],
  },
  haus2: {
    id: "haus2",
    name: "Haus 2 – Sprachenunterricht",
    shortName: "Haus 2",
    description: "Sprachenbereich und zugehörige Unterrichtsräume.",
    rooms: ["Aula", "kleine Sporthalle", "Sekretariat", "Toiletten"],
  },
  haus3: {
    id: "haus3",
    name: "Haus 3",
    shortName: "Haus 3",
    description: "Neben- und Fachbereich im Campusplan.",
    rooms: [],
  },
  haus5: {
    id: "haus5",
    name: "Haus 5",
    shortName: "Haus 5",
    description: "Weitere Unterrichts- und Funktionsräume.",
    rooms: [],
  },
  foyer: {
    id: "foyer",
    name: "Foyer",
    shortName: "Foyer",
    description: "Zentraler Übergangsbereich.",
    rooms: [],
  },
  essenraum: {
    id: "essenraum",
    name: "Essenraum",
    shortName: "Essenraum",
    description: "Speisebereich und Aufenthaltszone.",
    rooms: [],
  },
  haus1: {
    id: "haus1",
    name: "Haus 1",
    shortName: "Haus 1",
    description: "Verbindungs- und Unterrichtsbereich.",
    rooms: [],
  },
  Archiv: {
    id: "Archiv",
    name: "Archiv",
    shortName: "Archiv",
    description: "Archivbereich der Schule.",
    rooms: [],
  },
  Foyer2: {
    id: "Foyer2",
    name: "Foyer 2",
    shortName: "Foyer 2",
    description: "Zweiter Foyerbereich.",
    rooms: [],
  },
  Bibliothek: {
    id: "Bibliothek",
    name: "Bibliothek",
    shortName: "Bibliothek",
    description: "Bibliotheksbereich.",
    rooms: [],
  },
  uUukH: {
    id: "uUukH",
    name: "uUukH",
    shortName: "uUukH",
    description: "Spezialbereich uUukH.",
    rooms: [],
  },
  L1oB: {
    id: "L1oB",
    name: "L1oB",
    shortName: "L1oB",
    description: "Bereich L1oB.",
    rooms: [],
  },
  zaub: {
    id: "zaub",
    name: "zaub",
    shortName: "zaub",
    description: "Sonderbereich zaub.",
    rooms: [],
  },
  "Bergs-komp": {
    id: "Bergs-komp",
    name: "Bergs-komp",
    shortName: "Bergs-komp",
    description: "Bereich Bergs-komp.",
    rooms: [],
  },
  nTal: {
    id: "nTal",
    name: "nTal",
    shortName: "nTal",
    description: "Bereich nTal.",
    rooms: [],
  },
  haus25: {
    id: "haus25",
    name: "haus25",
    shortName: "haus25",
    description: "Bereich haus25.",
    rooms: [],
  },
}

const mapShapes: ShapeDef[] = [
  {
    id: "building1",
    ariaLabel: "Gebäude A – Turnhalle",
    geometry: {
      kind: "path",
      d: "m 20.758603,14.902796 8.333045,10.131956 2.187088,-1.79046 6.076279,7.422309 -2.187088,1.790461 8.017415,9.840493 -20.61788,16.878842 -22.426739,-27.39476 z",
    },
    floors: {
      1: { visual: "visible", clickable: true },
      2: { visual: "disabled", clickable: false },
      3: { visual: "disabled", clickable: false },
    },
  },
  {
    id: "building2",
    ariaLabel: "Gebäude B – Feldschule",
    geometry: {
      kind: "rect",
      width: 26.458336,
      height: 14.552083,
      x: 95.044033,
      y: -22.734944,
      transform: "rotate(50.694505)",
    },
    floors: {
      1: { visual: "disabled", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "disabled", clickable: false },
    },
  },
  {
    id: "haus3",
    ariaLabel: "Haus 3",
    geometry: {
      kind: "path",
      d: "m 72.634817,1.240357 5.92951,7.243026 -1.68526,1.379636 7.10362,8.67723 -2.18719,1.790646 -7.103671,-8.677288 -23.55778,19.285593 -9.745532,-11.904383 13.195222,-10.802278 3.816023,4.661358 z",
    },
    floors: {
      1: { visual: "hidden", clickable: true },
      2: { visual: "hidden", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "essenraum",
    ariaLabel: "Essenraum",
    geometry: {
      kind: "path",
      d: "m 85.739717,17.101957 -1.75703,1.438292 -4.90281,-5.988508 2.99211,-2.449495 -3.00303,-3.709023 7.63757,-6.2525 4.75544,5.808876 -8.89199,7.280459 z",
    },
    floors: {
      1: { visual: "hidden", clickable: true },
      2: { visual: "hidden", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "Archiv",
    ariaLabel: "Archiv",
    geometry: {
      kind: "path",
      d: "m 98.039777,33.667165 6.427703,7.845426 5.58487,-4.572056 2.98541,3.646745 -5.58487,4.572056 2.8777,3.515172 -6.59858,5.40193 -2.8777,-3.515171 -1.622843,1.308513 -6.28092,-7.672279 3.72702,-3.117557 -3.04712,-3.803166 z",
    },
    floors: {
      1: { visual: "hidden", clickable: true },
      2: { visual: "hidden", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "foyer",
    ariaLabel: "Foyer",
    geometry: {
      kind: "path",
      d: "m 93.038647,24.481535 1.23287,1.505975 -1.50501,1.23207 8.392663,10.257969 -4.409283,3.609657 -9.62854,-11.761473 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "hidden", clickable: true },
      3: { visual: "disabled", clickable: false },
    },
  },
  {
    id: "Foyer2",
    ariaLabel: "Foyer 2",
    geometry: {
      kind: "path",
      d: "m 87.121345,29.325734 5.917301,-4.844198 1.232871,1.505973 -1.505001,1.23207 5.27326,6.447586 -4.409329,3.609612 z",
    },
    floors: {
      1: { visual: "hidden", clickable: true },
      2: { visual: "hidden", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "haus5",
    ariaLabel: "Haus 5",
    geometry: {
      kind: "path",
      d: "m 131.86145,16.945308 -2.56258,2.09786 8.38633,10.24409 -4.48684,3.673151 7.36895,9.001338 -8.01148,6.558608 6.51667,7.960264 16.58077,-13.573856 -13.88512,-16.962021 -1.52037,1.244655 z",
    },
    floors: {
      1: { visual: "disabled", clickable: false },
      2: { visual: "hidden", clickable: true },
      3: { visual: "hidden", clickable: true },
    },
  },
  {
    id: "haus2",
    ariaLabel: "Haus 2",
    geometry: {
      kind: "path",
      d: "m 127.04308,16.28767 6.2809,7.672263 -25.80861,21.194663 11.31566,13.903363 0.65775,-0.47475 6.35513,7.762942 -15.81274,12.945112 -6.35514,-7.76294 8.58765,-7.030281 -11.42733,-13.958734 -1.604853,1.330484 -6.28089,-7.672248 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "hidden", clickable: true },
      3: { visual: "hidden", clickable: true },
    },
  },
  {
    id: "haus1",
    ariaLabel: "Haus 1",
    geometry: {
      kind: "path",
      d: "m 95.922977,8.765417 6.545953,7.996014 -32.557785,26.65342 -6.545929,-7.995997 11.007967,-9.01168 -1.52641,-1.864544 6.346614,-5.195658 1.52641,1.864544 z",
    },
    floors: {
      1: { visual: "hidden", clickable: true },
      2: { visual: "hidden", clickable: true },
      3: { visual: "visible", clickable: true },
    },
  },
  {
    id: "Bibliothek",
    ariaLabel: "Bibliothek",
    geometry: {
      kind: "path",
      d: "m 112.135567,28.491709 3.00377,3.669169 9.40648,-7.700637 3.27714,4.003094 5.50101,-4.503411 -6.28089,-7.672254 z",
    },
    floors: {
      1: { visual: "visible", clickable: true },
      2: { visual: "hidden", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "uUukH",
    ariaLabel: "uUukH",
    geometry: {
      kind: "path",
      d: "m 110.330587,48.674508 8.50042,10.383439 0.65775,-0.474754 6.35514,7.762942 -15.81278,12.945078 -6.3551,-7.76291 8.58761,-7.030312 -8.53163,-10.421568 z",
    },
    floors: {
      1: { visual: "disabled", clickable: false },
      2: { visual: "hidden", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "L1oB",
    ariaLabel: "L1oB",
    geometry: {
      kind: "path",
      d: "m 110.052347,36.940535 2.98541,3.646745 -5.58487,4.572056 2.8777,3.515172 -6.59858,5.40193 -2.89566,-3.53713 -1.60485,1.330486 -6.28094,-7.672285 3.7271,-3.117492 -9.55631,-11.754267 -17.210167,14.089147 -6.545974,-7.996052 11.007969,-9.011681 -1.526411,-1.864545 6.346613,-5.195658 1.52641,1.864545 1.0757,-0.880621 -7.103661,-8.677278 -23.55778,19.285593 -9.745532,-11.904383 13.195222,-10.802278 3.816023,4.661358 14.235058,-11.65354 5.92951,7.243026 -1.68526,1.379636 7.10362,8.67723 -4.90281,-5.988508 2.99211,-2.449495 -3.00303,-3.709023 7.63757,-6.2525 4.75544,5.808876 -8.89199,7.280459 3.16974,3.871899 10.18327,-8.336542 6.54594,7.996014 -9.43028,7.720105 1.23287,1.505975 -1.505,1.23207 11.70096,14.29301 z",
    },
    floors: {
      1: { visual: "visible", clickable: false },
      2: { visual: "hidden", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "zaub",
    ariaLabel: "zaub",
    geometry: {
      kind: "path",
      d: "m 110.052347,36.940535 2.98541,3.646745 14.7852,-12.123945 -3.27714,-4.003094 -9.40648,7.700637 -3.00377,-3.669169 -10.97641,8.985848 3.30832,4.035034 z",
    },
    floors: {
      1: { visual: "disabled", clickable: false },
      2: { visual: "hidden", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "Bergs-komp",
    ariaLabel: "Bergs-komp",
    geometry: {
      kind: "path",
      d: "m 63.365215,35.418855 11.007968,-9.011682 -1.526421,-1.864553 6.346624,-5.195648 1.526411,1.864544 15.203188,-12.4461011 6.545945,7.9960161 -9.430284,7.720102 1.232871,1.505976 -1.505011,1.23207 7.13886,8.726453 1.505004,-1.23207 1.25378,1.531517 24.37893,-19.957809 2.25579,2.755498 2.56258,-2.09786 8.38633,10.24409 1.52037,-1.244656 13.88512,16.962019 -16.58077,13.573858 -6.51667,-7.960264 8.01148,-6.558616 -7.36896,-9.00134 4.48685,-3.673141 -4.36123,-5.327335 -25.8086,21.194672 11.31567,13.90337 0.65774,-0.47475 6.35508,7.762875 -15.81268,12.945181 -6.35513,-7.762938 8.58764,-7.030278 -11.40936,-13.936773 -1.622884,1.308446 -6.280909,-7.672236 3.799348,-3.110286 -9.62854,-11.761472 -17.210201,14.089117 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "nTal",
    ariaLabel: "nTal",
    geometry: {
      kind: "path",
      d: "m 85.739717,17.101959 -3.16974,-3.871901 8.89199,-7.2804586 -4.75544,-5.80887595 -7.63757,6.25249995 3.00303,3.7090226 -2.99211,2.449495 4.90282,5.988509 -7.10363,-8.6772316 1.68526,-1.379635 -5.92951,-7.243026 L 58.399759,12.893897 54.583736,8.2325394 41.388514,19.034817 51.134046,30.9392 l 23.55778,-19.285593 7.103671,8.677289 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "disabled", clickable: false },
      3: { visual: "disabled", clickable: false },
    },
  },
  {
    id: "haus25",
    ariaLabel: "haus25",
    geometry: {
      kind: "path",
      d: "m 137.6852,29.287258 -4.36122,-5.327325 -25.87108,21.199411 11.37814,13.898623 0.65774,-0.474751 6.35514,7.762943 -15.81274,12.945114 -6.35513,-7.76294 8.58764,-7.030276 -11.40936,-13.936775 -1.622843,1.308501 -6.28095,-7.67229 8.208613,-6.719944 -1.253783,-1.531518 1.505003,-1.232069 1.25378,1.531518 24.37892,-19.957818 2.25579,2.755499 2.56258,-2.097861 8.38633,10.244089 1.52038,-1.244655 13.88511,16.962021 -16.58076,13.573856 -6.51668,-7.960264 8.01149,-6.558608 -7.36896,-9.001338 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "hidden", clickable: false },
      3: { visual: "visible", clickable: false },
    },
  },
]

const shapeById = Object.fromEntries(mapShapes.map((shape) => [shape.id, shape])) as Record<
  BuildingId,
  ShapeDef
>

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

  const getFloorState = useCallback(
    (id: BuildingId, targetFloor: Floor) => shapeById[id].floors[targetFloor],
    []
  )

  const isInteractiveOnFloor = useCallback(
    (id: BuildingId, targetFloor: Floor) => getFloorState(id, targetFloor).clickable,
    [getFloorState]
  )

  const handleFloorChange = (newFloor: Floor) => {
    setFloor(newFloor)
    if (selected && !isInteractiveOnFloor(selected, newFloor)) {
      setSelected(null)
    }
  }

  const handleSelect = (id: BuildingId) => {
    if (!isInteractiveOnFloor(id, floor)) return
    setSelected((prev) => (prev === id ? null : id))
  }

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

      setPan((prevPan) => {
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
    [clampPan]
  )

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false
  }, [])

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

  const handleTouchStart = useCallback((e: TouchEvent) => {
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
  }, [])

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

  const floorLabels: Record<Floor, string> = {
    1: "Etage 1",
    2: "Etage 2",
    3: "Etage 3",
  }

  const STROKE_WIDTH = 1.2

  const getShapeClass = (shape: ShapeDef) => {
    const state = shape.floors[floor]
    const isSelected = selected === shape.id && state.visual === "visible" && state.clickable

    if (state.visual === "disabled") {
      return cn(
        "transition-all duration-200 outline-none pointer-events-none",
        "fill-transparent stroke-muted-foreground/50"
      )
    }

    if (state.visual === "visible") {
      return cn(
        "transition-all duration-200 outline-none",
        state.clickable ? "cursor-pointer pointer-events-auto" : "pointer-events-none",
        isSelected ? "fill-white stroke-primary" : "fill-white stroke-foreground",
        state.clickable && !isSelected ? "hover:fill-white hover:stroke-primary" : null
      )
    }

    return cn(
      "transition-all duration-200 outline-none fill-transparent stroke-transparent",
      state.clickable ? "cursor-pointer pointer-events-auto hover:fill-white hover:stroke-primary" : "pointer-events-none"
    )
  }

  const renderShape = (shape: ShapeDef) => {
    const state = shape.floors[floor]
    if (state.visual === "hidden" && !state.clickable) return null

    const isSelected = selected === shape.id && state.visual === "visible" && state.clickable
    const strokeWidth = isSelected ? (STROKE_WIDTH * 1.35) / zoom : STROKE_WIDTH / zoom
    const commonProps = {
      id: shape.id,
      role: state.clickable ? "button" : undefined,
      tabIndex: state.clickable ? 0 : -1,
      'aria-label': shape.ariaLabel,
      'aria-disabled': !state.clickable,
      onClick: () => handleSelect(shape.id),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (!state.clickable) return
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleSelect(shape.id)
        }
      },
      className: getShapeClass(shape),
      vectorEffect: "non-scaling-stroke" as const,
      style: {
        strokeWidth,
      },
    }

    if (shape.geometry.kind === "path") {
      return <path key={shape.id} {...commonProps} d={shape.geometry.d} />
    }

    return (
      <rect
        key={shape.id}
        {...commonProps}
        width={shape.geometry.width}
        height={shape.geometry.height}
        x={shape.geometry.x}
        y={shape.geometry.y}
        transform={shape.geometry.transform}
      />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div ref={cardRef} className="bg-card border border-border rounded-xl p-1 md:p-6 relative">
        <div className="relative w-full">
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
                {mapShapes
                  .filter((shape) => shape.floors[floor].visual === "disabled")
                  .map(renderShape)}
                {mapShapes
                  .filter((shape) => shape.floors[floor].visual === "visible")
                  .map(renderShape)}
                {mapShapes
                  .filter((shape) => shape.floors[floor].visual === "hidden" && shape.floors[floor].clickable)
                  .map(renderShape)}
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

        <p className="text-center text-sm md:text-base leading-relaxed text-muted-foreground text-balance">
          Klicke auf ein Gebäude oder einen Bereich, um mehr zu erfahren.
        </p>
      </div>

      <div aria-live="polite">
        {selected ? (
          <div className="bg-card border border-border rounded-xl p-6 animate-in fade-in duration-300">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-3">{buildings[selected].name}</h2>
            <p className="text-muted-foreground leading-relaxed mb-5">{buildings[selected].description}</p>
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
