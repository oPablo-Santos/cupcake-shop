'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Product } from '@domain/product'
import { productSchema, updateProductSchema } from '@controller/schemas'
import { fieldErrorsFlat, validateWithZod } from '@controller/actionResult'
import { adminCreateProductAction, adminUpdateProductAction } from '@/app/actions/shop'
import { parseReaisToCents } from '@/lib/money'
import { FormField } from '@/app/components/FormField'

type Props = {
  product?: Product
}

export function ProductForm({ product }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)
    setFieldErrors({})

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
      setFieldErrors(fieldErrorsFlat(validated.field))
      setError(validated.errors[0] ?? 'Revise os campos do produto')
      return
    }

    const result = product
      ? await adminUpdateProductAction(product.id, validated.data)
      : await adminCreateProductAction(validated.data)

    setLoading(false)

    if (!result.success) {
      setFieldErrors(fieldErrorsFlat(result.errors.field))
      setError(result.errors.general[0] ?? 'Erro ao salvar')
      return
    }

    setSuccess(product ? 'Produto atualizado com sucesso.' : 'Produto criado com sucesso.')
    if (!product) {
      router.push('/admin/products')
    }
    router.refresh()
  }

  return (
    <div className="glass-card p-4">
      <h2 className="mb-3 font-medium">{product ? 'Atualizar' : 'Novo produto'}</h2>
      {success ? (
        <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {success}
        </p>
      ) : null}
      {error ? <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit(new FormData(event.currentTarget))
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <FormField label="Nome" name="name" defaultValue={product?.name} error={fieldErrors.name} />
        </div>
        <div className="sm:col-span-2">
          <FormField
            as="textarea"
            label="Descrição"
            name="description"
            defaultValue={product?.description}
            error={fieldErrors.description}
          />
        </div>
        <FormField
          label="Preço (R$)"
          name="priceReais"
          type="number"
          step="0.01"
          min="0.01"
          defaultValue={product ? (product.priceCents / 100).toFixed(2) : ''}
          error={fieldErrors.priceCents}
        />
        <FormField
          label="URL da imagem"
          name="imageUrl"
          type="url"
          defaultValue={product?.imageUrl}
          error={fieldErrors.imageUrl}
        />
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input name="available" type="checkbox" defaultChecked={product?.available ?? true} />
          Disponível no catálogo
        </label>
        <button type="submit" disabled={loading} className="btn btn-primary sm:col-span-2">
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  )
}