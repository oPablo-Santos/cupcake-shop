'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/app/components/CartProvider'

type Props = {
  product: {
    id: string
    name: string
    priceCents: number
    imageUrl: string
  }
}

export function AddToCartButton({ product }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!added) return
    const timer = window.setTimeout(() => setAdded(false), 1400)
    return () => window.clearTimeout(timer)
  }, [added])

  return (
    <button
      type="button"
      onClick={() => {
        addItem({
          productId: product.id,
          name: product.name,
          priceCents: product.priceCents,
          imageUrl: product.imageUrl,
        })
        setAdded(true)
      }}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-300 active:scale-95 ${
        added
          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
          : 'bg-[var(--accent)] text-white hover:brightness-110 dark:text-[#141010]'
      }`}
    >
      {added ? '✓ Adicionado' : 'Adicionar'}
    </button>
  )
}
