import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { SiteNavigation } from "@/components/site-navigation"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <SiteNavigation />

      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Startseite
        </Link>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/icon-192.png"
            alt="Gymnasium Wandlitz Insider Logo"
            className="h-20 w-20 rounded-2xl"
          />
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground text-balance">Anmelden</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Melde dich mit deinem Konto an
          </p>
        </div>

        {/* Login form */}
        <LoginForm />
      </div>
    </main>
  )
}
