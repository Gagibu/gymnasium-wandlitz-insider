"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Home, LogIn, Map, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { SITE_DOMAIN } from "@/lib/site"
import { cn } from "@/lib/utils"

const navigationItems = [
  { name: "Startseite", href: "/", icon: Home, description: "Zurück zur Hauptseite" },
  { name: "Schulplan", href: "/schulplan", icon: Map, description: "Interaktiver Gebäudeplan" },
  { name: "Anmelden", href: "/login", icon: LogIn, description: "Zum Login-Bereich" },
  { name: "Impressum", href: "/impressum", icon: FileText, description: "Rechtliche Informationen" },
]

export function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Menü bei Seitenwechsel schließen (z. B. Zurück-Taste des Browsers).
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Escape schließt das Menü, solange es offen ist; der Hintergrund bleibt derweil stehen.
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "fixed right-4 top-4 z-50 rounded-full border border-border bg-card p-3 shadow-lg",
          "transition-colors hover:bg-secondary",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        )}
        aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={isOpen}
        aria-controls="hauptnavigation"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-foreground" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5 text-foreground" aria-hidden="true" />
        )}
      </button>

      {/* Abdunklung hinter dem Menü */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <nav
        id="hauptnavigation"
        aria-label="Hauptnavigation"
        // Im geschlossenen Zustand komplett aus Tabreihenfolge und Screenreader nehmen.
        inert={!isOpen}
        className={cn(
          "fixed right-0 top-0 z-40 h-full w-72 border-l border-border bg-card shadow-xl",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col px-6 pt-20">
          <h2 className="mb-6 text-lg font-semibold text-foreground">Seitenübersicht</h2>

          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg p-3 transition-colors",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block font-medium">{item.name}</span>
                      <span
                        className={cn(
                          "block text-xs",
                          isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                        )}
                      >
                        {item.description}
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="mt-auto pb-8">
            <p className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
              {SITE_DOMAIN}
            </p>
          </div>
        </div>
      </nav>
    </>
  )
}
