type Props = {
  value: number
  onChange: (next: number) => void
  label: string
  min?: number
  max?: number
}

export function QuantityStepper({ value, onChange, label, min = 1, max = 99 }: Props) {
  return (
    <div
      className="inline-flex items-center overflow-hidden rounded-lg border border-[var(--input-border)] bg-[var(--background)]"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        className="flex h-9 w-9 items-center justify-center text-lg leading-none text-[var(--foreground)] transition hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={`Diminuir quantidade de ${label}`}
      >
        −
      </button>
      <span className="min-w-[2.25rem] border-x border-[var(--input-border)] px-1 text-center text-sm font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className="flex h-9 w-9 items-center justify-center text-lg leading-none text-[var(--foreground)] transition hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={`Aumentar quantidade de ${label}`}
      >
        +
      </button>
    </div>
  )
}
