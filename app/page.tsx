"use client"

import Image from "next/image"
import { useState } from "react"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upgrade() {
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch("/api/checkout", { method: "POST" })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error ?? `Checkout failed (${res.status})`)
      }
      if (!data?.url) {
        throw new Error("Checkout URL missing from server response.")
      }

      window.location.href = data.url
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="container flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Cuckoo Block" width={36} height={36} priority />
            <div className="leading-tight">
              <div className="text-base font-semibold tracking-tight">Cuckoo Block</div>
              <div className="text-sm muted">Operations-grade tools</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm muted">Secure checkout by Stripe</span>
            <button
              onClick={upgrade}
              disabled={isLoading}
              className="brand-button rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60"
            >
              {isLoading ? "Redirecting..." : "Upgrade"}
            </button>
          </div>
        </div>
      </header>

      <main className="container py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Cuckoo Block makes your operation feel under control.
            </h1>
            <p className="mt-4 text-lg muted">
              A clean, reliable workflow that helps teams execute faster without chaos.
            </p>
            <p className="mt-3 text-sm muted">
              Start a monthly membership to get access to upgraded services and the Pro dashboard.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={upgrade}
                disabled={isLoading}
                className="brand-button rounded-2xl px-6 py-3 disabled:opacity-60"
              >
                {isLoading ? "Opening checkout..." : "Start Pro membership"}
              </button>
              <div className="text-sm muted">
                Monthly subscription - Instant access
              </div>
            </div>

            {error && (
              <div className="mt-4 card p-4 text-sm">
                <div className="font-medium">Checkout error</div>
                <div className="mt-1 muted">{error}</div>
              </div>
            )}

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="card p-4">
                <div className="text-sm font-semibold">Fast</div>
                <div className="mt-1 text-sm muted">Checkout in seconds.</div>
              </div>
              <div className="card p-4">
                <div className="text-sm font-semibold">Secure</div>
                <div className="mt-1 text-sm muted">Stripe-hosted payments.</div>
              </div>
              <div className="card p-4">
                <div className="text-sm font-semibold">Clear</div>
                <div className="mt-1 text-sm muted">No clutter. Just flow.</div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="text-sm font-semibold">What you get with Pro</div>
            <ul className="mt-4 space-y-3 text-sm muted">
              <li>- Priority access to the dashboard</li>
              <li>- Faster workflows and fewer clicks</li>
              <li>- A foundation for paid-only features</li>
            </ul>

            <div className="mt-6 rounded-2xl border p-4" style={{ borderColor: "var(--border)" }}>
              <div className="text-sm font-semibold">Trust</div>
              <div className="mt-1 text-sm muted">
                Payments handled by Stripe. We never store your card details.
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm muted">Need an invoice?</div>
              <a
                className="underline underline-offset-4"
                href="mailto:hello@cuckooblock.com"
              >
                hello@cuckooblock.com
              </a>
            </div>
          </div>
        </div>

        <footer className="mt-16 border-t py-8 text-sm muted" style={{ borderColor: "var(--border)" }}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>&copy; {new Date().getFullYear()} Cuckoo Block</div>
            <div className="flex gap-4">
              <span>Terms available on request</span>
              <span>Privacy-first billing</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
