'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { checkoutSchema } from '@controller/schemas'
import { fieldErrorsFlat, validateWithZod } from '@controller/actionResult'
import { useCart } from '@/app/components/CartProvider'
import { checkoutAction } from '@/app/actions/shop'
import { formatCents } from '@/lib/money'
import { formatZipCodeInput, normalizeZipCode } from '@domain/shipping'
import { QuantityStepper } from '@/app/components/QuantityStepper'
import { IconTrash } from '@/app/components/icons'

const inputClass =
  'w-full rounded-lg border bg-[var(--background)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]'

function fieldClass(hasError: boolean) {
  return `${inputClass} ${hasError ? 'border-red-500 ring-1 ring-red-500/30' : 'border-[var(--input-border)]'}`
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-red-600 dark:text-red-400">{message}</p>
}

export default function CheckoutPage() {
  const router = useRouter()
  const {
    items,
    itemCount,
    subtotalCents,
    shippingZip,
    shippingCents,
    grandTotalCents,
    clear,
    setQuantity,
    removeItem,
    setShippingZip,
  } = useCart()
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [zipCode, setZipCode] = useState(shippingZip)

  useEffect(() => {
    setZipCode(shippingZip)
  }, [shippingZip])

  if (items.length === 0) {
    return (
      <div className="space-y-4 glass-card p-8 text-center">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-[var(--muted-foreground)]">Adicione itens ao carrinho antes de finalizar.</p>
        <Link href="/" className="inline-block font-medium text-[var(--accent)] underline-offset-4 hover:underline">
          Ir ao catálogo
        </Link>
      </div>
    )
  }

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setFieldErrors({})

    const zipRaw = String(formData.get('zipCode') ?? zipCode)
    const normalizedZip = normalizeZipCode(zipRaw)
    if (!normalizedZip) {
      setFieldErrors({ zipCode: 'Informe um CEP válido com 8 dígitos para calcular o frete' })
      setError('Confira o CEP de entrega antes de confirmar o pedido.')
      setLoading(false)
      return
    }

    const payload = {
      customerName: String(formData.get('customerName') ?? '').trim(),
      customerEmail: String(formData.get('customerEmail') ?? '').trim(),
      customerPhone: String(formData.get('customerPhone') ?? '').trim(),
      street: String(formData.get('street') ?? '').trim(),
      number: String(formData.get('number') ?? '').trim(),
      complement: String(formData.get('complement') ?? '').trim() || undefined,
      neighborhood: String(formData.get('neighborhood') ?? '').trim(),
      city: String(formData.get('city') ?? '').trim(),
      state: String(formData.get('state') ?? '').trim().toUpperCase(),
      zipCode: normalizedZip,
      paymentMethod: String(formData.get('paymentMethod') ?? 'PIX') as
        | 'PIX'
        | 'CREDIT_CARD'
        | 'CASH_ON_DELIVERY',
      items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    }

    const validated = validateWithZod(checkoutSchema, payload)
    if (!validated.ok) {
      setFieldErrors(fieldErrorsFlat(validated.field))
      setError('Preencha os campos obrigatórios para continuar.')
      setLoading(false)
      return
    }

    try {
      const result = await checkoutAction(validated.data)

      if (!result.success) {
        setFieldErrors(fieldErrorsFlat(result.errors.field))
        setError(result.errors.general[0] ?? 'Erro ao finalizar pedido')
        return
      }

      clear()
      router.push(`/order/success?id=${result.data.orderId}`)
    } catch {
      setError('Não foi possível finalizar o pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const totalUnits = itemCount
  const zipReady = normalizeZipCode(zipCode) !== null

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-[var(--muted-foreground)]">
          {totalUnits} {totalUnits === 1 ? 'unidade' : 'unidades'} · Subtotal {formatCents(subtotalCents)}
          {shippingCents !== null && zipReady && (
            <>
              {' '}
              · Frete {shippingCents === 0 ? 'grátis' : formatCents(shippingCents)}
            </>
          )}
          {grandTotalCents !== null && zipReady && (
            <>
              {' '}
              · Total {formatCents(grandTotalCents)}
            </>
          )}
        </p>
      </div>

      <div
        className={`rounded-2xl border p-4 text-sm ${
          zipReady
            ? 'border-[var(--border)] bg-[var(--card)]'
            : 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30'
        }`}
        role="status"
      >
        <h2 className="font-medium">Frete e entrega</h2>
        {zipReady && shippingCents !== null ? (
          <p className="mt-1 text-[var(--muted-foreground)]">
            CEP {formatZipCodeInput(zipCode)} ·{' '}
            {shippingCents === 0 ? 'frete grátis neste pedido' : `frete ${formatCents(shippingCents)}`}
            {shippingZip && zipCode === shippingZip ? ' (usado do carrinho)' : ''}. Total estimado{' '}
            <span className="font-semibold text-[var(--foreground)]">
              {grandTotalCents !== null ? formatCents(grandTotalCents) : formatCents(subtotalCents)}
            </span>
            .
          </p>
        ) : (
          <p className="mt-1 text-amber-900 dark:text-amber-200">
            Informe um CEP válido no endereço abaixo. O frete entra no total só depois do CEP com 8 dígitos.
          </p>
        )}
      </div>

      <div className="glass-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Seu pedido</h2>
          <Link
            href="/cart"
            className="text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Editar no carrinho
          </Link>
        </div>
        <ul className="mt-3 divide-y divide-[var(--border)] text-sm">
          {items.map((item) => (
            <li key={item.productId} className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-snug">{item.name}</p>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                  {formatCents(item.priceCents)} cada
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                <QuantityStepper
                  value={item.quantity}
                  onChange={(next) => setQuantity(item.productId, next)}
                  label={item.name}
                />
                <span className="min-w-[4.5rem] text-right font-medium tabular-nums">
                  {formatCents(item.priceCents * item.quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
                  aria-label={`Remover ${item.name} do carrinho`}
                >
                  <IconTrash className="h-3.5 w-3.5" />
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit(new FormData(event.currentTarget))
        }}
        className="space-y-6 glass-card p-6 shadow-sm"
      >
        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="mb-2 font-medium">Cliente</legend>
          <label className="block space-y-1 text-sm sm:col-span-2">
            <span>Nome completo</span>
            <input
              name="customerName"
              placeholder="Seu nome"
              autoComplete="name"
              className={fieldClass(!!fieldErrors.customerName)}
              aria-invalid={!!fieldErrors.customerName}
            />
            <FieldError message={fieldErrors.customerName} />
          </label>
          <label className="block space-y-1 text-sm">
            <span>E-mail</span>
            <input
              name="customerEmail"
              type="email"
              placeholder="voce@email.com"
              autoComplete="email"
              className={fieldClass(!!fieldErrors.customerEmail)}
              aria-invalid={!!fieldErrors.customerEmail}
            />
            <FieldError message={fieldErrors.customerEmail} />
          </label>
          <label className="block space-y-1 text-sm">
            <span>Telefone</span>
            <input
              name="customerPhone"
              placeholder="(11) 99999-9999"
              autoComplete="tel"
              inputMode="tel"
              className={fieldClass(!!fieldErrors.customerPhone)}
              aria-invalid={!!fieldErrors.customerPhone}
            />
            <FieldError message={fieldErrors.customerPhone} />
          </label>
        </fieldset>

        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="mb-2 font-medium">Endereço</legend>
          <label className="block space-y-1 text-sm sm:col-span-2">
            <span>Rua</span>
            <input
              name="street"
              placeholder="Rua, avenida..."
              autoComplete="street-address"
              className={fieldClass(!!fieldErrors.street)}
            />
            <FieldError message={fieldErrors.street} />
          </label>
          <label className="block space-y-1 text-sm">
            <span>Número</span>
            <input name="number" placeholder="123" className={fieldClass(!!fieldErrors.number)} />
            <FieldError message={fieldErrors.number} />
          </label>
          <label className="block space-y-1 text-sm">
            <span>Complemento</span>
            <input name="complement" placeholder="Opcional" className={fieldClass(!!fieldErrors.complement)} />
            <FieldError message={fieldErrors.complement} />
          </label>
          <label className="block space-y-1 text-sm">
            <span>Bairro</span>
            <input name="neighborhood" placeholder="Bairro" className={fieldClass(!!fieldErrors.neighborhood)} />
            <FieldError message={fieldErrors.neighborhood} />
          </label>
          <label className="block space-y-1 text-sm">
            <span>Cidade</span>
            <input name="city" placeholder="Cidade" autoComplete="address-level2" className={fieldClass(!!fieldErrors.city)} />
            <FieldError message={fieldErrors.city} />
          </label>
          <label className="block space-y-1 text-sm">
            <span>UF</span>
            <input
              name="state"
              placeholder="SP"
              maxLength={2}
              autoComplete="address-level1"
              className={`${fieldClass(!!fieldErrors.state)} uppercase`}
            />
            <FieldError message={fieldErrors.state} />
          </label>
          <label className="block space-y-1 text-sm sm:col-span-2">
            <span>CEP</span>
            <input
              name="zipCode"
              placeholder="00000-000"
              value={zipCode}
              inputMode="numeric"
              autoComplete="postal-code"
              className={fieldClass(!!fieldErrors.zipCode)}
              onChange={(e) => {
                const formatted = formatZipCodeInput(e.target.value)
                setZipCode(formatted)
                setShippingZip(formatted)
              }}
            />
            <FieldError message={fieldErrors.zipCode} />
          </label>
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-medium">Pagamento (simulado)</legend>
          <select name="paymentMethod" className={`w-full ${fieldClass(false)}`} defaultValue="PIX">
            <option value="PIX">PIX</option>
            <option value="CREDIT_CARD">Cartão de crédito</option>
            <option value="CASH_ON_DELIVERY">Pagamento na entrega</option>
          </select>
        </fieldset>

        <button
          type="submit"
          disabled={loading || !zipReady}
          className="w-full rounded-lg bg-[var(--accent)] py-2.5 font-medium text-white transition hover:opacity-90 disabled:opacity-60 dark:text-[#141010]"
        >
          {loading ? 'Enviando...' : zipReady ? 'Confirmar pedido' : 'Informe o CEP para continuar'}
        </button>
      </form>
    </div>
  )
}
