'use client'

import Link from 'next/link'
import { useCart } from '@/app/components/CartProvider'
import { ThemeToggle } from '@/app/components/ThemeToggle'
import { IconUser } from '@/app/components/icons'

export function SiteHeader() {
  const { itemCount, bumpKey } = useCart()

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-amber-400 text-lg shadow-sm"
            aria-hidden
          >
            🧁
          </span>
          <span className="text-lg font-semibold tracking-tight text-[var(--accent)] group-hover:opacity-90">
            Cupcake Shop
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link
            href="/"
            className="text-[var(--muted-foreground)] transition hover:text-[var(--accent)]"
          >
            Catálogo
          </Link>
          <Link
            href="/cart"
            key={bumpKey}
            className="cart-bump rounded-full bg-[var(--surface-muted)] px-3 py-1 font-medium text-[var(--foreground)] ring-1 ring-[var(--border)] transition hover:ring-[var(--accent)]/50"
          >
            Carrinho ({itemCount})
          </Link>
          <ThemeToggle />
          <Link
            href="/admin/login"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            aria-label="Área admin"
            title="Admin"
          >
            <IconUser className="h-5 w-5" />
          </Link>
        </nav>
      </div>
    </header>
  )
}
