import { NextResponse } from "next/server"
import { createAccessCookieValue, getAccessCookieMaxAge, getAccessCookieName, getRequiredEnv } from "@/lib/access"

export const runtime = "nodejs"

type StripeCheckoutSession = {
  payment_status?: string
  subscription?: string | null
}

type StripeSubscription = {
  id?: string
  status?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { session_id?: string } | null
    const sessionId = body?.session_id?.trim()

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
    }

    const stripeSecretKey = getRequiredEnv("STRIPE_SECRET_KEY")
    const sessionResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
        },
        cache: "no-store",
      },
    )

    if (!sessionResponse.ok) {
      return NextResponse.json({ error: "Unable to verify checkout session" }, { status: 400 })
    }

    const session = (await sessionResponse.json()) as StripeCheckoutSession
    const subscriptionId = session.subscription?.trim()

    if (!subscriptionId) {
      return NextResponse.json({ error: "Checkout session has no subscription" }, { status: 403 })
    }

    const subscriptionResponse = await fetch(
      `https://api.stripe.com/v1/subscriptions/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
        },
        cache: "no-store",
      },
    )

    if (!subscriptionResponse.ok) {
      return NextResponse.json({ error: "Unable to verify subscription" }, { status: 400 })
    }

    const subscription = (await subscriptionResponse.json()) as StripeSubscription
    const verifiedSubscriptionId = subscription.id?.trim()
    const allowedStatuses = new Set(["active", "trialing"])
    const hasValidSubscription = Boolean(
      verifiedSubscriptionId &&
        subscription.status &&
        allowedStatuses.has(subscription.status),
    )
    const hasValidPayment =
      session.payment_status === "paid" || subscription.status === "trialing"

    if (!verifiedSubscriptionId || !hasValidSubscription || !hasValidPayment) {
      return NextResponse.json({ error: "Subscription is not active" }, { status: 403 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set({
      name: getAccessCookieName(),
      value: createAccessCookieValue(verifiedSubscriptionId),
      httpOnly: true,
      maxAge: getAccessCookieMaxAge(),
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    return response
  } catch (error) {
    console.error("Stripe verify route failed", error)

    return NextResponse.json(
      { error: "Unable to verify subscription access" },
      { status: 500 },
    )
  }
}
