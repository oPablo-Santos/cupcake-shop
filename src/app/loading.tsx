export default function CatalogLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Carregando catálogo">
      <div className="animate-pulse space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="h-4 w-32 rounded bg-[var(--surface-muted)]" />
        <div className="h-8 w-48 rounded bg-[var(--surface-muted)]" />
        <div className="h-4 max-w-md rounded bg-[var(--surface-muted)]" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]"
          >
            <div className="aspect-[4/3] bg-[var(--surface-muted)]" />
            <div className="space-y-2 p-4">
              <div className="h-5 w-3/4 rounded bg-[var(--surface-muted)]" />
              <div className="h-4 w-full rounded bg-[var(--surface-muted)]" />
              <div className="h-4 w-1/3 rounded bg-[var(--surface-muted)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
