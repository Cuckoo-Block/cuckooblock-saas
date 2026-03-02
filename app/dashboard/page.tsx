import { redirect } from "next/navigation"

type DashboardPageProps = {
  searchParams?: Promise<{ session_id?: string }>
}

type StripeSession = {
  payment_status?: string
  status?: string
}

function getRequiredEnv(name: "STRIPE_SECRET_KEY") {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

async function getCheckoutSession(sessionId: string) {
  const stripeSecretKey = getRequiredEnv("STRIPE_SECRET_KEY")
  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
      },
      cache: "no-store",
    },
  )

  if (!response.ok) {
    throw new Error("Unable to verify checkout session")
  }

  return (await response.json()) as StripeSession
}

export default async function Dashboard({ searchParams }: DashboardPageProps) {
  const params = searchParams ? await searchParams : undefined
  const sessionId = params?.session_id

  if (!sessionId) {
    redirect("/")
  }

  const session = await getCheckoutSession(sessionId)

  if (session.payment_status !== "paid" && session.status !== "complete") {
    redirect("/")
  }

  return (
    <main className="container py-14">
      <div className="card p-8">
        <h1 className="text-3xl font-semibold tracking-tight">You&apos;re in</h1>
        <p className="mt-3 muted">
          Payment verified. This is your Pro dashboard landing page.
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
