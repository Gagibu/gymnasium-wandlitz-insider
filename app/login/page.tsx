import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { SiteFooter } from "@/components/site-footer"
import { SiteNavigation } from "@/components/site-navigation"
import { SITE_NAME } from "@/lib/site"

export const metadata: Metadata = {
  title: "Anmelden",
  description: `Anmeldung für den internen Bereich von ${SITE_NAME}.`,
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNavigation />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Zurück zur Startseite
          </Link>

          <div className="mb-8 flex justify-center">
            <Image
              src="/icon-192.png"
              alt=""
              width={80}
              height={80}
              className="h-20 w-20 rounded-2xl"
              priority
            />
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-balance text-2xl font-bold text-foreground">Anmelden</h1>
            <p className="mt-2 text-sm text-muted-foreground">Melde dich mit deinem Konto an</p>
          </div>

          <LoginForm />
        </div>
      </main>

      <SiteFooter className="mx-auto w-full max-w-md px-4 pb-10" />
    </div>
  )
}
