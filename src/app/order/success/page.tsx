import type { Metadata } from 'next'
import Link from 'next/link'
import { useCases } from '@framework/ioc/useCases'
import { formatCents } from '@/lib/money'
import { formatZipCodeInput } from '@domain/shipping'
import { PAYMENT_METHOD_LABELS } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pedido confirmado | Cupcake Shop',
  robots: { index: false, follow: false },
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams

  if (!id) {
    return (
      <div className="mx-auto max-w-lg space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <h1 className="text-xl font-semibold">Pedido</h1>
        <p className="text-[var(--muted-foreground)]">Não encontramos o número do pedido nesta página.</p>
        <Link href="/" className="inline-block font-medium text-[var(--accent)] underline-offset-4 hover:underline">
          Voltar ao catálogo
        </Link>
      </div>
    )
  }

  const result = await useCases.getOrder.execute(id)

  if (result.kind === 'left') {
    return (
      <div className="mx-auto max-w-lg space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <h1 className="text-xl font-semibold">Pedido não encontrado</h1>
        <p className="text-[var(--muted-foreground)]">
          Verifique se o link está correto ou entre em contato informando o código{' '}
          <span className="font-mono text-sm">{id}</span>.
        </p>
        <Link href="/" className="inline-block font-medium text-[var(--accent)] underline-offset-4 hover:underline">
          Voltar ao catálogo
        </Link>
      </div>
    )
  }

  const order = result.value
  const itemsSubtotal = order.items.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0)
  const shippingCents = Math.max(0, order.totalCents - itemsSubtotal)
  const firstName = order.customerName.split(/\s+/)[0] ?? order.customerName
  const cepDisplay = formatZipCodeInput(order.zipCode)

  return (
    <div className="mx-auto max-w-lg animate-fade-up space-y-6">
      <div className="rounded-2xl border border-emerald-200 bg-[var(--card)] p-8 text-center shadow-sm dark:border-emerald-900/60">
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
          aria-hidden
        >
          ✓
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-emerald-800 dark:text-emerald-300">Pedido recebido!</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Obrigado, {firstName}. Registramos seu pedido com pagamento simulado e avisaremos sobre a entrega.
        </p>
        <p className="mt-4 rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-sm">
          Número do pedido
          <span className="mt-1 block font-mono text-base text-[var(--foreground)]">{order.id}</span>
        </p>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Resumo</h2>
        <ul className="mt-3 divide-y divide-[var(--border)] text-sm">
          {order.items.map((line) => (
            <li key={`${line.productId}-${line.quantity}`} className="flex justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <span>
                {line.productName ?? 'Produto'}{' '}
                <span className="text-[var(--muted-foreground)]">×{line.quantity}</span>
              </span>
              <span className="shrink-0 font-medium tabular-nums">
                {formatCents(line.unitPriceCents * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1.5 border-t border-[var(--border)] pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-[var(--muted-foreground)]">Subtotal</dt>
            <dd>{formatCents(itemsSubtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--muted-foreground)]">Frete (CEP {cepDisplay})</dt>
            <dd>{shippingCents === 0 ? 'Grátis' : formatCents(shippingCents)}</dd>
          </div>
          <div className="flex justify-between font-semibold">
            <dt>Total</dt>
            <dd className="text-[var(--accent)]">{formatCents(order.totalCents)}</dd>
          </div>
          <div className="flex justify-between pt-1 text-[var(--muted-foreground)]">
            <dt>Pagamento</dt>
            <dd>{PAYMENT_METHOD_LABELS[order.paymentMethod]}</dd>
          </div>
          <div className="flex justify-between text-[var(--muted-foreground)]">
            <dt>Entrega</dt>
            <dd>
              {order.city}/{order.state}
            </dd>
          </div>
        </dl>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="rounded-xl bg-[var(--accent)] px-6 py-3 text-center font-medium text-white transition hover:brightness-110 dark:text-[#141010]"
        >
          Voltar ao catálogo
        </Link>
        <Link
          href="/cart"
          className="rounded-xl border border-[var(--border)] px-6 py-3 text-center font-medium transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Fazer novo pedido
        </Link>
      </div>
    </div>
  )
}
