import { createHmac, timingSafeEqual } from "node:crypto"

const ACCESS_COOKIE_NAME = "cb_access"
const ACCESS_COOKIE_TTL_SECONDS = 60 * 60 * 24 * 30

type AccessPayload = {
  exp: number
  sub: string
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url")
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8")
}

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url")
}

export function getRequiredEnv(
  name: "APP_COOKIE_SECRET" | "STRIPE_SECRET_KEY" | "STRIPE_PRICE_ID",
) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export function getAccessCookieName() {
  return ACCESS_COOKIE_NAME
}

export function createAccessCookieValue(subscriptionId: string, now = Date.now()) {
  const secret = getRequiredEnv("APP_COOKIE_SECRET")
  const payload = encodeBase64Url(
    JSON.stringify({
      exp: now + ACCESS_COOKIE_TTL_SECONDS * 1000,
      sub: subscriptionId,
    } satisfies AccessPayload),
  )
  const signature = signPayload(payload, secret)

  return `${payload}.${signature}`
}

export function verifyAccessCookieValue(token?: string | null) {
  if (!token) {
    return { valid: false as const }
  }

  const [payload, providedSignature] = token.split(".")

  if (!payload || !providedSignature) {
    return { valid: false as const }
  }

  const secret = process.env.APP_COOKIE_SECRET

  if (!secret) {
    return { valid: false as const }
  }

  const expectedSignature = signPayload(payload, secret)
  const providedBuffer = Buffer.from(providedSignature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return { valid: false as const }
  }

  try {
    const parsed = JSON.parse(decodeBase64Url(payload)) as AccessPayload

    if (!parsed.sub || typeof parsed.exp !== "number" || parsed.exp <= Date.now()) {
      return { valid: false as const }
    }

    return {
      valid: true as const,
      payload: parsed,
    }
  } catch {
    return { valid: false as const }
  }
}

export function getAccessCookieMaxAge() {
  return ACCESS_COOKIE_TTL_SECONDS
}
