"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type BuildingId = "building1" | "building2" | "building3"

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
      "Große Halle (GH1 / GH2)",
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
      "In diesem Gebäude befinden sich die Fachräume für die gesellschaftswissenschaftlichen Fächer wie Geschichte, Politische Bildung und Erdkund / Geographie mit den dazugehörigen Fachräumen.",
    rooms: [
      "Geschichte-Fachräume",
      "Politische Bildung-Fachräume",
      "Erdkunde-Fachräume",
      "Toiletten",
    ],
  },
  building3: {
    id: "building3",
    name: "Hauptgebäude – Sport, Mensa, Sprachen, Mathe und Informatik, Musik, Kunst und vieles mehr",
    shortName: "Hauptgebäude",
    description:
      "Das größte Gebäude umfasst die kleine Sporthalle, weitere Umkleiden sowie die Mensa und den Sek II Aufenthaltsbereich für die Pausen.",
    rooms: [
      "kleine Sporthalle",
      "Umkleideräume",
      "Mensa",
      "Aufenthaltsbereich",
    ],
  },
}

export function SchoolMap() {
  const [selected, setSelected] = useState<BuildingId | null>(null)

  const handleSelect = (id: BuildingId) => {
    setSelected((prev) => (prev === id ? null : id))
  }

  const buildingClass = (id: BuildingId) =>
    cn(
      "cursor-pointer transition-all duration-200 outline-none",
      selected === id
        ? "fill-primary/30 stroke-primary"
        : "fill-transparent stroke-foreground hover:fill-primary/10 hover:stroke-primary"
    )

  return (
    <div className="flex flex-col gap-8">
      {/* Floor plan */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-6">
        <svg
          viewBox="-70 0 330 270"
          className="w-full h-auto"
          role="group"
          aria-label="Interaktiver Schulplan mit drei anklickbaren Gebäuden"
        >
          <g transform="translate(64.244141,-11.483243)">
            <path
              id="building1"
              role="button"
              tabIndex={0}
              aria-label="Gebäude A – Hauptgebäude"
              onClick={() => handleSelect("building1")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleSelect("building1")
                }
              }}
              className={buildingClass("building1")}
              style={{ strokeWidth: 1.2 }}
              d="M 21.095565,94.313969 17.436159,97.222788 5.3304873,81.993368 -25.335456,106.36933 8.1428476,148.48637 38.8088,124.11041 26.489293,108.61199 l 3.659392,-2.90881 z"
            />
            <rect
              id="building2"
              role="button"
              tabIndex={0}
              aria-label="Gebäude B – Naturwissenschaften"
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
              x="174.50781"
              y="23.824528"
              transform="rotate(50.254519)"
            />
            <path
              id="building3"
              role="button"
              tabIndex={0}
              aria-label="Gebäude C – Sport & Mensa"
              onClick={() => handleSelect("building3")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleSelect("building3")
                }
              }}
              className={buildingClass("building3")}
              style={{ strokeWidth: 1.4 }}
              d="m 192.8467,98.05939 -3.05336,2.39381 -12.58914,-15.623807 -2.88773,2.327007 -3.60797,-4.477221 -39.39364,31.742681 -1.93484,-2.49389 -1.88945,1.46622 -10.42507,-13.436369 1.9934,-1.5464 -1.30539,-1.682627 14.00585,-10.86626 -10.64526,-13.72143 -15.92326,12.353753 -4.38255,-5.649471 1.79551,-1.392565 9.6e-4,0.0012 12.19171,-9.459754 -7.58435,-9.775326 -12.191628,9.459025 4.724204,6.08947 -1.795596,1.393293 -0.0016,-0.002 -2.779521,2.156805 7.243011,9.335735 -0.0748,0.05794 -9.952509,-12.82779 2.002742,-1.553722 L 85.295086,60.610854 62.385364,78.384827 57.591099,72.205165 37.860958,87.512628 51.747707,105.4122 71.477855,90.104732 l -0.0016,-0.002 17.795726,-13.807306 9.952426,12.828518 -2.239161,1.737105 -1.827892,-2.35579 -9.553045,7.411403 1.827886,2.355795 -17.164037,13.317323 10.645659,13.7211 27.338603,-21.21072 13.79965,17.78596 -5.77862,4.65584 10.08009,12.50975 2.81029,-2.26498 17.25782,21.41799 -13.3128,10.72675 9.8641,12.24178 24.84258,-20.0182 -9.86378,-12.24137 -1.58502,1.27746 -17.25822,-21.41768 40.75551,-32.839924 6.07642,7.540364 -7.02703,5.50916 11.23609,14.33183 -11.69207,9.16652 9.89253,12.61809 25.61192,-20.07964 -5.79005,-7.38532 0.0134,-0.0104 z"
            />
          </g>
        </svg>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Klicke auf eines der drei Gebäude, um mehr zu erfahren.
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
              Noch kein Gebäude ausgewählt. Wähle ein Gebäude im Plan aus, um Details anzuzeigen.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
