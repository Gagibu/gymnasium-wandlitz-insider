import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SiteNavigation } from "@/components/site-navigation"
import { SchoolMap } from "@/components/school-map"

export default function SchulplanPage() {
  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <SiteNavigation />
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Zurück zur Startseite</span>
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">
          Schulplan
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Hier findest du den Lageplan des Gymnasiums Wandlitz. Klicke auf ein Gebäude,
          um nähere Informationen zu den Räumen und Bereichen zu erhalten.
        </p>

        <SchoolMap />

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <p className="text-muted-foreground text-sm text-center">
            &copy; {new Date().getFullYear()} Gymnasium Wandlitz Insider
          </p>
        </footer>
      </div>
    </main>
  )
}
