"use client"

import { useState, useEffect } from "react"
import { Download, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Register the new self-unregistering service worker to replace any old cached ones
    // This forces the browser to fetch the new SW which will then clean up and unregister itself
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" })
        .catch(() => {
          // Ignore errors - SW registration is optional
        })
    }

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support beforeinstallprompt
      alert(
        "Um die App zu installieren:\n\n" +
        "iOS Safari: Tippe auf das Teilen-Symbol und wähle 'Zum Home-Bildschirm'.\n\n" +
        "Android Chrome: Tippe auf das Menü (drei Punkte) und wähle 'App installieren' oder 'Zum Startbildschirm hinzufügen'.\n\n" +
        "Desktop: Klicke auf das Installieren-Symbol in der Adressleiste."
      )
      return
    }

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setIsInstalled(true)
    }
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  if (isInstalled) {
    return (
      <div className="flex items-center justify-center gap-2 text-primary py-3 px-6 rounded-full bg-primary/10 border border-primary/20">
        <Smartphone className="h-5 w-5" />
        <span className="font-medium">App installiert</span>
      </div>
    )
  }

  return (
    <Button
      onClick={handleInstallClick}
      size="lg"
      className="gap-3 px-8 py-6 text-lg font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105"
    >
      <Download className="h-6 w-6" />
      Web-App jetzt installieren
    </Button>
  )
}
