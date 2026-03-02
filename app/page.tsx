"use client"

export default function Home() {
  async function upgrade() {
    const res = await fetch("/api/checkout", {
      method: "POST",
    })

    const data = await res.json()
    window.location.href = data.url
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold">Cuckoo 🚀</h1>

      <button
        onClick={upgrade}
        className="rounded-lg bg-black px-6 py-3 text-white hover:opacity-80"
      >
        Upgrade to Pro – $20
      </button>
    </main>
  )
}