import { cookies } from "next/headers"
import Link from "next/link"
import DashboardClient from "./dashboard-client"
import { getAccessCookieName, verifyAccessCookieValue } from "@/lib/access"

type DashboardPageProps = {
  searchParams?: Promise<{ session_id?: string }>
}

export default async function Dashboard({ searchParams }: DashboardPageProps) {
  const params = searchParams ? await searchParams : undefined
  const sessionId = params?.session_id
  const cookieStore = await cookies()
  const accessCookie = cookieStore.get(getAccessCookieName())
  const access = verifyAccessCookieValue(accessCookie?.value)

  if (!sessionId) {
    if (!access.valid) {
      return (
        <main className="container py-14">
          <div className="card p-8">
            <h1 className="text-3xl font-semibold tracking-tight">Pro membership required</h1>
            <p className="mt-3 muted">
              Start or renew your subscription to unlock the dashboard.
            </p>
            <div className="mt-6">
              <Link href="/" className="brand-button inline-flex rounded-2xl px-6 py-3">
                Upgrade
              </Link>
            </div>
          </div>
        </main>
      )
    }

    return (
      <main className="container py-14">
        <div className="card p-8">
          <h1 className="text-3xl font-semibold tracking-tight">You&apos;re in</h1>
          <p className="mt-3 muted">
            Your subscription is active. This is your Pro dashboard landing page.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="card p-4">
              <div className="text-sm font-semibold">Next</div>
              <div className="mt-1 text-sm muted">Protect this page behind auth.</div>
            </div>
            <div className="card p-4">
              <div className="text-sm font-semibold">Billing</div>
              <div className="mt-1 text-sm muted">Add webhook - mark paid users.</div>
            </div>
            <div className="card p-4">
              <div className="text-sm font-semibold">Product</div>
              <div className="mt-1 text-sm muted">Ship your first paid feature.</div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return <DashboardClient sessionId={sessionId} />
}
