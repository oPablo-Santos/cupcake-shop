export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6" aria-busy="true" aria-label="Carregando checkout">
      <div className="animate-pulse space-y-2">
        <div className="h-8 w-40 rounded bg-[var(--surface-muted)]" />
        <div className="h-4 w-64 rounded bg-[var(--surface-muted)]" />
      </div>
      <div className="animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="h-4 w-24 rounded bg-[var(--surface-muted)]" />
        <div className="mt-4 space-y-3">
          <div className="h-12 rounded-lg bg-[var(--surface-muted)]" />
          <div className="h-12 rounded-lg bg-[var(--surface-muted)]" />
        </div>
      </div>
      <div className="animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-10 rounded-lg bg-[var(--surface-muted)] sm:col-span-2 even:sm:col-span-1" />
          ))}
        </div>
        <div className="mt-6 h-11 rounded-lg bg-[var(--surface-muted)]" />
      </div>
    </div>
  )
}
