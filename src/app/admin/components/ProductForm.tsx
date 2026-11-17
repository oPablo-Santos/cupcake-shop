'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Product } from '@domain/product'
import { productSchema, updateProductSchema } from '@controller/schemas'
import { validateWithZod } from '@controller/actionResult'
import { adminCreateProductAction, adminUpdateProductAction } from '@/app/actions/shop'
import { parseReaisToCents } from '@/lib/money'

const inputClass =
  'rounded-lg border border-[var(--input-border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]'

type Props = {
  product?: Product
}

export function ProductForm({ product }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const priceCents = parseReaisToCents(String(formData.get('priceReais') ?? ''))
    if (priceCents === null) {
      setLoading(false)
      setError('Informe um preço válido (ex.: 12,50)')
      return
    }

    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      description: String(formData.get('description') ?? '').trim(),
      priceCents,
      imageUrl: String(formData.get('imageUrl') ?? '').trim(),
      available: formData.get('available') === 'on',
    }

    const schema = product ? updateProductSchema : productSchema
    const validated = validateWithZod(schema, payload)
    if (!validated.ok) {
      setLoading(false)
      setError(validated.errors[0] ?? 'Revise os campos do produto')
      return
    }

    const result = product
      ? await adminUpdateProductAction(product.id, validated.data)
      : await adminCreateProductAction(validated.data)

    setLoading(false)

    if (!result.success) {
      setError(result.errors.general[0] ?? 'Erro ao salvar')
      return
    }

    router.push('/admin/products')
    router.refresh()
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
      <h2 className="mb-3 font-medium">{product ? 'Atualizar' : 'Novo produto'}</h2>
      {error && <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit(new FormData(event.currentTarget))
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        <label className="block space-y-1 text-sm sm:col-span-2">
          <span>Nome</span>
          <input name="name" defaultValue={product?.name} placeholder="Nome do produto" className={inputClass} />
        </label>
        <label className="block space-y-1 text-sm sm:col-span-2">
          <span>Descrição</span>
          <textarea
            name="description"
            defaultValue={product?.description}
            placeholder="Descrição"
            className={`min-h-24 ${inputClass}`}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Preço (R$)</span>
          <input
            name="priceReais"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={product ? (product.priceCents / 100).toFixed(2) : ''}
            placeholder="0,00"
            className={inputClass}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>URL da imagem</span>
          <input
            name="imageUrl"
            type="url"
            defaultValue={product?.imageUrl}
            placeholder="https://..."
            className={inputClass}
          />
        </label>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input name="available" type="checkbox" defaultChecked={product?.available ?? true} />
          Disponível no catálogo
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-white sm:col-span-2 disabled:opacity-60 dark:text-[#141010]"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  )
}
