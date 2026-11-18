'use client'

import { ProductImage } from '@/app/components/ProductImage'
import Link from 'next/link'
import { useCart } from '@/app/components/CartProvider'
import { formatCents } from '@/lib/money'
import { formatZipCodeInput } from '@domain/shipping'
import { QuantityStepper } from '@/app/components/QuantityStepper'
import { IconTrash } from '@/app/components/icons'

export default function CartPage() {
  const {
    items,
    setQuantity,
    removeItem,
    shippingZip,
    setShippingZip,
    subtotalCents,
    shippingCents,
    grandTotalCents,
    itemCount,
  } = useCart()

  if (items.length === 0) {
    return (
      <div className="glass-card space-y-4 p-8 text-center">
        <h1 className="text-2xl font-semibold">Carrinho</h1>
        <p className="text-[var(--muted-foreground)]">Seu carrinho está vazio.</p>
        <Link href="/" className="inline-block font-medium text-[var(--accent)] underline-offset-4 hover:underline">
          Voltar ao catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Carrinho</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          {itemCount} {itemCount === 1 ? 'unidade' : 'unidades'} · {items.length}{' '}
          {items.length === 1 ? 'produto' : 'produtos'}
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)] text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                <th className="px-4 py-3 font-medium">Produto</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Preço un.</th>
                <th className="px-4 py-3 font-medium">Qtd</th>
                <th className="px-4 py-3 font-medium text-right">Subtotal</th>
                <th className="px-4 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {items.map((item) => (
                <tr key={item.productId} className="transition hover:bg-[var(--surface-muted)]/60">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[var(--surface-muted)] ring-1 ring-[var(--border)]">
                        <ProductImage src={item.imageUrl} alt={item.name} className="object-cover" sizes="56px" />
                      </div>
                      <div>
                        <p className="font-medium leading-snug">{item.name}</p>
                        <p className="mt-0.5 text-xs text-[var(--muted-foreground)] sm:hidden">
                          {formatCents(item.priceCents)} · Qtd. {item.quantity}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-600 sm:hidden dark:text-red-400"
                        >
                          <IconTrash className="h-3.5 w-3.5" />
                          Remover
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 text-[var(--muted-foreground)] sm:table-cell">
                    {formatCents(item.priceCents)}
                  </td>
                  <td className="px-4 py-4">
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(next) => setQuantity(item.productId, next)}
                      label={item.name}
                    />
                  </td>
                  <td className="px-4 py-4 text-right font-medium">{formatCents(item.priceCents * item.quantity)}</td>
                  <td className="hidden px-4 py-4 text-right sm:table-cell">
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
                      aria-label={`Remover ${item.name}`}
                    >
                      <IconTrash className="h-3.5 w-3.5" />
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <h2 className="font-medium">Calcular frete</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Simulação por CEP (faixa regional + peso do pedido). Grátis acima de R$ 150.
          </p>
          <label className="mt-4 block space-y-1.5 text-sm">
            <span>CEP</span>
            <input
              value={shippingZip}
              onChange={(e) => setShippingZip(formatZipCodeInput(e.target.value))}
              placeholder="00000-000"
              className="w-full max-w-xs rounded-lg border border-[var(--input-border)] bg-[var(--background)] px-3 py-2"
              inputMode="numeric"
            />
          </label>
          {shippingCents !== null && (
            <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-400">
              {shippingCents === 0 ? 'Frete grátis para este pedido!' : `Frete estimado: ${formatCents(shippingCents)}`}
            </p>
          )}
          {shippingZip.replace(/\D/g, '').length > 0 && shippingCents === null && (
            <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">Informe um CEP com 8 dígitos.</p>
          )}
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <h2 className="font-medium">Resumo</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--muted-foreground)]">Subtotal</dt>
              <dd>{formatCents(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--muted-foreground)]">Frete</dt>
              <dd>{shippingCents === null ? '—' : shippingCents === 0 ? 'Grátis' : formatCents(shippingCents)}</dd>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd className="text-[var(--accent)]">
                {grandTotalCents === null ? formatCents(subtotalCents) : formatCents(grandTotalCents)}
              </dd>
            </div>
          </dl>
          <Link
            href="/checkout"
            className="mt-5 block rounded-xl bg-[var(--accent)] py-3 text-center font-medium text-white transition hover:brightness-110 dark:text-[#141010]"
          >
            Finalizar pedido
          </Link>
        </div>
      </div>
    </div>
  )
}
