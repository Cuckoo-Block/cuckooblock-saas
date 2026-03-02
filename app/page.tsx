"use client"

import { useState } from "react"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upgrade() {
    try {
      setIsLoading(true)
      setError(null)

      const res = await fetch("/api/checkout", { method: "POST" })
      const data = (await res.json()) as { url?: string; error?: string }

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Unable to start checkout")
      }

      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start checkout")
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-5xl font-bold tracking-tight">Cuckoo 🚀</h1>

      <button
        onClick={upgrade}
        disabled={isLoading}
        className="rounded-lg bg-black px-6 py-3 text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Redirecting..." : "Upgrade to Pro – $20"}
      </button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </main>
  )
}
