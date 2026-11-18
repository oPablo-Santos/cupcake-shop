'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import type { Product } from '@domain/product'
import { formatCents } from '@/lib/money'
import { AddToCartButton } from '@/app/components/AddToCartButton'

type Props = {
  products: Product[]
}

export function DailySuggestionsCarousel({ products }: Props) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback(
    (delta: number) => {
      if (products.length === 0) return
      setIndex((current) => (current + delta + products.length) % products.length)
    },
    [products.length],
  )

  useEffect(() => {
    if (products.length <= 1 || paused) return
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const timer = window.setInterval(() => go(1), 5500)
    return () => window.clearInterval(timer)
  }, [go, paused, products.length])

  if (products.length === 0) return null

  const product = products[index]

  return (
    <section
      className="glass-card overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carrossel"
      aria-label="Sugestões do dia"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Sugestões do dia</p>
          <h2 className="text-lg font-semibold">Destaques para você</h2>
        </div>
        {products.length > 1 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-ghost px-3 py-2 text-lg leading-none"
              onClick={() => go(-1)}
              aria-label="Sugestão anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className="btn btn-ghost px-3 py-2 text-lg leading-none"
              onClick={() => go(1)}
              aria-label="Próxima sugestão"
            >
              ›
            </button>
          </div>
        ) : null}
      </div>

      <article
        key={product.id}
        className="carousel-slide grid gap-6 p-4 sm:grid-cols-2 sm:p-6"
        aria-live="polite"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--surface-muted)] ring-1 ring-[var(--border)]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-500 hover:scale-[1.03]"
            sizes="(min-width: 640px) 50vw, 100vw"
            priority
          />
        </div>
        <div className="flex h-full flex-col justify-center gap-3">
          <h3 className="text-2xl font-semibold tracking-tight">{product.name}</h3>
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)] line-clamp-4">
            {product.description}
          </p>
          <p className="text-xl font-semibold text-[var(--accent)]">{formatCents(product.priceCents)}</p>
          <div className="pt-2">
            <AddToCartButton product={product} />
          </div>
        </div>
      </article>

      {products.length > 1 ? (
        <div className="flex justify-center gap-2 border-t border-[var(--border)] px-4 py-3">
          {products.map((item, dotIndex) => (
            <button
              key={item.id}
              type="button"
              className={`carousel-dot ${dotIndex === index ? 'carousel-dot-active' : ''}`}
              onClick={() => setIndex(dotIndex)}
              aria-label={`Ir para sugestão ${dotIndex + 1}`}
              aria-current={dotIndex === index ? 'true' : undefined}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}