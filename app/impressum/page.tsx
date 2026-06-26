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
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">
              Gymnasium Wandlitz Insider
            </h2>
            <div className="text-muted-foreground space-y-1">
              <p>Unabhängiges, nicht offizielles Informations- und Schülerprojekt</p>
              <p>Diese Website ist ein privates, unabhängiges Schülerprojekt. Sie wird weder vom Gymnasium Wandlitz noch vom Landkreis Barnim oder einer sonstigen öffentlichen Stelle betrieben, herausgegeben oder redaktionell verantwortet. Sämtliche Inhalte spiegeln ausschließlich die Auffassung der jeweiligen Betreiber oder Autoren wider.</p>
              <p>[NOT OFFICIAL]</p>
              <p>[NICHT OFFIZIELL]</p>
            </div>
          </section>

          {/* Angaben gemäß § 5 DDG */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">
              Angaben gemäß § 5 DDG
            </h2>
            <div className="text-muted-foreground space-y-1">
              <p>Betreiber:</p>
              <p>{"[Vor- und Nachname]"}</p>
              <p className="mt-3">Anschrift:</p>
              <p>{"[Straße und Hausnummer]"}</p>
              <p>{"[PLZ Ort]"}</p>
              <p>Deutschland</p>
            </div>
          </section>

          {/* Schulbezug */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Schulbezug</h2>
            <div className="text-muted-foreground space-y-2">
              <p>Gymnasium Wandlitz</p>
              <p>Prenzlauer Chaussee 130</p>
              <p>16348 Wandlitz</p>
              <p className="mt-3">Diese Anschrift dient ausschließlich der Kennzeichnung des Schulstandorts, auf den sich die Inhalte dieser Website beziehen. Das Gymnasium Wandlitz ist weder Betreiber noch Herausgeber dieser Website.</p>
              <p>Diese Website wird unabhängig und privat betrieben und steht in keiner offiziellen Verbindung zum Gymnasium Wandlitz, dem Landkreis Barnim oder dem Schulträger.</p>
            </div>
          </section>

          {/* Kontakt und Support */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Kontakt und Support</h2>
            <div className="text-muted-foreground space-y-1">
              <p>{"E-Mail: [ihre-email@beispiel.de]"}</p>
              <p>{"Telefon: [optional]"}</p>
            </div>
          </section>

          {/* Verantwortlich für den Inhalt */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">
              Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV
            </h2>
            <div className="text-muted-foreground space-y-1">
              <p>Verantwortlicher:</p>
              <p>{"[Vor- und Nachname des Verantwortlichen]"}</p>
              <p className="mt-3">Anschrift:</p>
              <p>{"[Straße und Hausnummer]"}</p>
              <p>{"[PLZ Ort]"}</p>
              <p>Deutschland</p>
            </div>
          </section>

          {/* Haftung für Inhalte */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">
              Haftung für Inhalte
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Als Diensteanbieter sind wir gemäß den allgemeinen Gesetzen für eigene Inhalte auf diesen Seiten verantwortlich. Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Gewähr für die Aktualität, Richtigkeit und Vollständigkeit der bereitgestellten Informationen.
            </p>
          </section>

          {/* Haftung für Links */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">
              Haftung für Links
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der jeweiligen Seiten verantwortlich.
            </p>
          </section>

          {/* Urheberrecht */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">Urheberrecht</h2>
            <p className="text-muted-foreground leading-relaxed">
              Die auf dieser Website veröffentlichten Inhalte, Texte, Bilder und sonstigen Werke unterliegen dem deutschen Urheberrecht, soweit nicht anders gekennzeichnet. Jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedarf der vorherigen Zustimmung des jeweiligen Rechteinhabers.
            </p>
          </section>

          {/* Hinweis zu Marken- und Namensrechten */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">
              Hinweis zu Marken- und Namensrechten
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Die Nennung von Schulnamen, Marken, Logos oder sonstigen geschützten Bezeichnungen erfolgt ausschließlich zu Informationszwecken. Alle Rechte an den jeweiligen Bezeichnungen verbleiben bei den jeweiligen Rechteinhabern.
            </p>
          </section>

          {/* Dieses Impressum gilt für folgende Internetauftritte */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">
              Dieses Impressum gilt für folgende Internetauftritte
            </h2>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li>gymnasium-wandlitz-insider.de</li>
              <li>gymnasium-wandlitz-insider.vercel.app</li>
              <li>v0-gymnasium-wandlitz-insider.vercel.app</li>
              <li>gw-insider.de</li>
              <li>gw-insider.vercel.app</li>
            </ul>
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
