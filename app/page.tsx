import { ArrowRight, Clock, Construction, Map } from "lucide-react"
import Link from "next/link"
import { PWAInstallButton } from "@/components/pwa-install-button"
import { SiteFooter } from "@/components/site-footer"
import { SiteNavigation } from "@/components/site-navigation"
import { cn } from "@/lib/utils"

/** Dekorative Schräglinien am Bildschirmrand – rein optisch, ohne Bedeutung für den Inhalt. */
function DiagonalLines({ className }: { className?: string }) {
  return (
    <svg
      width="60"
      height="300"
      viewBox="0 0 60 300"
      fill="none"
      aria-hidden="true"
      className={cn("pointer-events-none text-primary/25", className)}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1="0"
          y1={i * 25}
          x2="50"
          y2={i * 25 + 25}
          stroke="currentColor"
          strokeWidth="2"
        />
      ))}
    </svg>
  )
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNavigation />

      {/* Erst ab lg einblenden – darunter würden die Linien unter dem Text liegen. */}
      <DiagonalLines className="fixed left-8 top-1/2 hidden -translate-y-1/2 lg:block" />
      <DiagonalLines className="fixed right-8 top-1/2 hidden -translate-y-1/2 -scale-x-100 lg:block" />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl space-y-10 text-center">
          {/* Wortmarke */}
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-2xl font-bold tracking-tight md:text-3xl">
            <span className="text-foreground">Gymnasium Wandlitz</span>
            <span className="text-primary">Insider</span>
          </p>

          {/* Statusmeldung */}
          <div className="space-y-6">
            <Construction className="mx-auto h-12 w-12 text-accent md:h-16 md:w-16" aria-hidden="true" />

            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Diese Seite befindet sich noch im Aufbau
            </h1>

            <p className="mx-auto max-w-md text-lg text-muted-foreground md:text-xl">
              Wir arbeiten daran, hier nach und nach alles Wichtige rund um die Schule zu
              versammeln. Der Schulplan ist schon fertig – schau dich gern um.
            </p>

            <p className="flex items-center justify-center gap-2 text-primary">
              <Clock className="h-5 w-5 animate-pulse" aria-hidden="true" />
              <span className="text-sm font-medium uppercase tracking-wider">In Arbeit</span>
            </p>
          </div>

          {/* Einstiegspunkte */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/schulplan"
              className={cn(
                "group flex w-full max-w-md items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left",
                "transition-colors hover:border-primary/60 hover:bg-secondary",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              )}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Map className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">Interaktiver Schulplan</span>
                <span className="block text-sm text-muted-foreground">
                  Gebäude, Räume und Etagen durchsuchen
                </span>
              </span>
              <ArrowRight
                className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                aria-hidden="true"
              />
            </Link>

            <PWAInstallButton />
          </div>
        </div>
      </main>

      <SiteFooter className="mx-auto w-full max-w-2xl px-4 pb-10" />
    </div>
  )
}
