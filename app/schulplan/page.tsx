import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SiteNavigation } from "@/components/site-navigation"
import { SiteFooter } from "@/components/site-footer"
import { SchoolMap } from "@/components/school-map"

export const metadata: Metadata = {
  title: "Schulplan",
  description:
    "Interaktiver Lageplan des Gymnasiums Wandlitz: Gebäude, Räume und Etagen durchsuchen und anzeigen.",
}

export default function SchulplanPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNavigation />

      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Zurück zur Startseite</span>
          </Link>

          <h1 className="mb-2 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Schulplan
          </h1>
          <p className="mb-8 leading-relaxed text-muted-foreground">
            Hier findest du den Lageplan des Gymnasiums Wandlitz. Wähle eine Etage, klicke auf ein
            Gebäude für nähere Informationen zu Räumen und Bereichen – oder suche direkt nach einem
            Raum.
          </p>

          <SchoolMap />
        </div>
      </main>

      <SiteFooter className="mx-auto mt-12 w-full max-w-3xl px-4 pb-10" />
    </div>
  )
}
