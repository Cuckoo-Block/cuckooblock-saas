"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type DashboardClientProps = {
  sessionId?: string
}

export default function DashboardClient({ sessionId }: DashboardClientProps) {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "verifying" | "error">(
    sessionId ? "verifying" : "idle",
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      return
    }

    let cancelled = false

    async function verifyAccess() {
      try {
        const response = await fetch("/api/stripe/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id: sessionId }),
        })
        const data = (await response.json()) as { error?: string }

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to verify subscription access")
        }

        if (cancelled) {
          return
        }

        router.replace("/dashboard")
        router.refresh()
      } catch (caughtError) {
        if (cancelled) {
          return
        }

        setStatus("error")
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to verify subscription access",
        )
      }
    }

    void verifyAccess()

    return () => {
      cancelled = true
    }
  }, [router, sessionId])

  if (status === "verifying") {
    return (
      <main className="container py-14">
        <div className="card p-8">
          <h1 className="text-3xl font-semibold tracking-tight">Verifying access</h1>
          <p className="mt-3 muted">
            We&apos;re confirming your subscription and preparing your dashboard.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="container py-14">
      <div className="card p-8">
        <h1 className="text-3xl font-semibold tracking-tight">Pro membership required</h1>
        <p className="mt-3 muted">
          Start or renew your subscription to unlock the dashboard.
        </p>
        {error ? (
          <div className="mt-4 card p-4 text-sm">
            <div className="font-medium">Access error</div>
            <div className="mt-1 muted">{error}</div>
          </div>
        ) : null}
        <div className="mt-6">
          <Link href="/" className="brand-button inline-flex rounded-2xl px-6 py-3">
            Upgrade
          </Link>
        </div>
      </div>
    </main>
  )
}
