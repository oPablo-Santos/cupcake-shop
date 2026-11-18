import Image from 'next/image'
import type { Product } from '@domain/product'
import { formatCents } from '@/lib/money'
import { AddToCartButton } from '@/app/components/AddToCartButton'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="glass-card group animate-fade-up flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/30 hover:shadow-lg hover:shadow-[var(--accent)]/10">
      <div className="relative aspect-[4/3] bg-[var(--surface-muted)]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="font-semibold leading-snug">{product.name}</h2>
        <p className="text-sm text-[var(--muted-foreground)] line-clamp-3">{product.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="text-lg font-semibold text-[var(--accent)]">{formatCents(product.priceCents)}</span>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  )
}
