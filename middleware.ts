import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ACCESS_COOKIE_NAME = "cb_access"

type AccessPayload = {
  exp: number
  sub: string
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")

  return atob(padded)
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = ""

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

async function createSignature(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  )

  return bytesToBase64Url(new Uint8Array(signature))
}

async function hasValidAccessCookie(token?: string) {
  if (!token || !process.env.APP_COOKIE_SECRET) {
    return false
  }

  const [payload, providedSignature] = token.split(".")

  if (!payload || !providedSignature) {
    return false
  }

  const expectedSignature = await createSignature(payload, process.env.APP_COOKIE_SECRET)

  if (providedSignature !== expectedSignature) {
    return false
  }

  try {
    const parsed = JSON.parse(decodeBase64Url(payload)) as AccessPayload
    return Boolean(parsed.sub) && typeof parsed.exp === "number" && parsed.exp > Date.now()
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.next()
  }

  const token = request.cookies.get(ACCESS_COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.next()
  }

  const isValid = await hasValidAccessCookie(token)

  if (isValid) {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: "",
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  return response
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
