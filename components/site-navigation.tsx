"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, LogIn, Map, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    name: "Startseite",
    href: "/",
    icon: Home,
    description: "Zurück zur Hauptseite"
  },
  {
    name: "Schulplan",
    href: "/schulplan",
    icon: Map,
    description: "Interaktiver Gebäudeplan"
  },
  {
    name: "Anmelden",
    href: "/login",
    icon: LogIn,
    description: "Zum Login-Bereich"
  },
  {
    name: "Impressum",
    href: "/impressum",
    icon: FileText,
    description: "Rechtliche Informationen"
  },
]

export function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState("")
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) {
      setCurrentPath(pathname)
    }
  }, [pathname])

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-3 bg-card border border-border rounded-full shadow-lg hover:bg-secondary transition-colors"
        aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-foreground" />
        )}
      </button>

      {/* Navigation overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Navigation panel */}
      <nav
        className={cn(
          "fixed top-0 right-0 z-40 h-full w-72 bg-card border-l border-border shadow-xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-20 px-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Seitenübersicht
          </h2>

          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = currentPath === item.href
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <div>
                      <span className="font-medium block">{item.name}</span>
                      <span
                        className={cn(
                          "text-xs",
                          isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                        )}
                      >
                        {item.description}
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Footer info */}
          <div className="mt-auto pb-8">
            <div className="border-t border-border pt-6">
              <p className="text-xs text-muted-foreground text-center">
                v0-gymanisum-wandlitz-insider.vercel.app
              </p>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
