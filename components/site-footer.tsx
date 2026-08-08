import Link from "next/link"
import { SITE_NAME } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * Einheitlicher Seitenfuß. Ersetzt die zuvor auf jeder Seite kopierten Footer-Blöcke.
 * `withImpressumLink` blendet den Impressum-Link aus, wo er nicht sinnvoll ist (z. B. auf der Impressum-Seite selbst).
 */
export function SiteFooter({
  className,
  withImpressumLink = true,
}: {
  className?: string
  withImpressumLink?: boolean
}) {
  return (
    <footer className={cn("border-t border-border pt-6", className)}>
      <div className="flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground sm:flex-row sm:gap-4">
        <p>
          &copy; {new Date().getFullYear()} {SITE_NAME}
        </p>
        <span aria-hidden="true" className="hidden sm:inline">
          ·
        </span>
        <p>Inoffizielles Schülerprojekt</p>
        {withImpressumLink && (
          <>
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <Link
              href="/impressum"
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              Impressum
            </Link>
          </>
        )}
      </div>
    </footer>
  )
}
