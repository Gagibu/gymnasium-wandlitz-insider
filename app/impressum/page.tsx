import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SiteNavigation } from "@/components/site-navigation"

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <SiteNavigation />
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Zurück zur Startseite</span>
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          Impressum
        </h1>

        <div className="space-y-8 text-foreground">
          {/* Gymnasium Wandlitz Insider */}
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-primary">
              Gymnasium Wandlitz Insider
            </h2>
            <div className="text-muted-foreground space-y-1">
              <p>
Unabhängiges, nicht offizielles Informations- und Schülerprojekt</p>
            </div>
          </section>

          {/* Angaben gemäß § 5 DDG */}
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-primary">
              Angaben gemäß § 5 DDG
            </h2>
            <div className="text-muted-foreground space-y-1">
              <p>Betreiber:</p>
              <p>[Vor- und Nachname]</p> <br>
              <p>Anschrift: </p>
              <p>[Straße und Hausnummer]</p>
              <p>[PLZ Ort]</p>
              <p>Deutschland</p>
            </div>
          </section>

          {/* Kontakt */}
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-primary">Kontakt und Support</h2>
            <div className="text-muted-foreground space-y-1">
              <p>E-Mail: [ihre-email@beispiel.de]</p>
              <p>Telefon: [Ihre Telefonnummer] (optional)</p>
            </div>
          </section>

          {/* Verantwortlich für den Inhalt */}
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-primary">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <div className="text-muted-foreground space-y-1">
              <p>[Name des Verantwortlichen]</p>
              <p>[Adresse]</p>
            </div>
          </section>

          {/* Haftungsausschluss */}
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-primary">
              Haftung für Inhalte
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen
              Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind
              wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte
              fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
              rechtswidrige Tätigkeit hinweisen.
            </p>
          </section>

          {/* Haftung für Links */}
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-primary">
              Haftung für Links
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir
              keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine
              Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
              Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>

          {/* Urheberrecht */}
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-primary">Urheberrecht</h2>
            <p className="text-muted-foreground leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
              unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
              Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes
              bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>
        </div>

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
