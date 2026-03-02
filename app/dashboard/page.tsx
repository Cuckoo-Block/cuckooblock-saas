export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-neutral-500">
        Cuckoo Pro
      </p>
      <h1 className="text-4xl font-bold text-neutral-950 dark:text-neutral-50">
        Dashboard
      </h1>
      <p className="max-w-md text-base text-neutral-600 dark:text-neutral-300">
        Your checkout completed successfully. This is the post-purchase landing
        page for Pro users.
      </p>
    </main>
  );
}
