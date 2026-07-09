import { Construction, Clock } from "lucide-react"
import Link from "next/link"
import { PWAInstallButton } from "@/components/pwa-install-button"
import { SiteNavigation } from "@/components/site-navigation"

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <SiteNavigation />
      {/* Decorative diagonal lines */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden md:block">
        <svg
          width="60"
          height="300"
          viewBox="0 0 60 300"
          fill="none"
          className="text-primary"
        >
          {[...Array(12)].map((_, i) => (
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
      </div>

      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo / Brand */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Gymnasium Wandlitz
          </span>
          <span className="text-primary text-2xl md:text-3xl font-bold">Insider</span>
        </div>

        {/* Main Message */}
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4">
            <Construction className="h-12 w-12 md:h-16 md:w-16 text-accent" />
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight text-balance">
            This Website is Being Built at the Moment
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto">
            Diese Seite befindet sich derzeit im Aufbau. Wir arbeiten daran, bald etwas Großartiges zu präsentieren.
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 text-primary">
          <Clock className="h-5 w-5 animate-pulse" />
          <span className="text-sm font-medium uppercase tracking-wider">Coming Soon</span>
        </div>

        {/* PWA Install Button */}
        <div className="pt-4">
          <PWAInstallButton />
        </div>

        {/* Domain display */}
        <div className="pt-8 border-t border-border">
          <p className="text-muted-foreground text-sm">
            gymnasium-wandlitz-insider.vercel.app
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 text-center space-y-2">
        <p className="text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} Gymnasium Wandlitz Insider
        </p>
        <Link
          href="/impressum"
          className="text-muted-foreground text-xs hover:text-foreground transition-colors underline underline-offset-2"
        >
          Impressum
        </Link>
      </footer>
    </main>
  )
}
