import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

function getRequiredEnv(name: "STRIPE_SECRET_KEY") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getBaseUrl(request: NextRequest) {
  const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();

  if (envBaseUrl) {
    return envBaseUrl;
  }

  return request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = getRequiredEnv("STRIPE_SECRET_KEY");
    const baseUrl = getBaseUrl(request);

    const formData = new URLSearchParams({
      mode: "payment",
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: baseUrl,
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][product_data][name]": "Cuckoo Pro",
      "line_items[0][price_data][unit_amount]": "2000",
      "line_items[0][quantity]": "1",
    });

    const response = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        cache: "no-store",
      },
    );

    const data = (await response.json()) as
      | { url?: string; error?: { message?: string } }
      | undefined;

    if (!response.ok) {
      console.error("Stripe checkout session creation failed", data);
      return NextResponse.json(
        { error: "Unable to start secure checkout. Please try again." },
        { status: response.status },
      );
    }

    if (!data?.url) {
      return NextResponse.json(
        { error: "Stripe checkout session did not include a redirect URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected checkout error";

    console.error("Checkout route failed", error);

    return NextResponse.json(
      {
        error:
          message === "Missing required environment variable: STRIPE_SECRET_KEY"
            ? "Checkout is temporarily unavailable."
            : "Unable to start secure checkout. Please try again.",
      },
      { status: 500 },
    );
  }
}
