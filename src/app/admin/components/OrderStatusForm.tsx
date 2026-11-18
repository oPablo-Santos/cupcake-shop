'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { DeliveryStatus, OrderStatus, PaymentStatus } from '@domain/order'
import { adminUpdateOrderStatusesAction } from '@/app/actions/shop'
import { deliveryStatusLabel, orderStatusLabel, paymentStatusLabel } from '@/lib/orderLabels'

type Props = {
  orderId: string
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
  deliveryStatus: DeliveryStatus
}

export function OrderStatusForm({ orderId, orderStatus, paymentStatus, deliveryStatus }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await adminUpdateOrderStatusesAction(orderId, {
      orderStatus: formData.get('orderStatus') as OrderStatus,
      paymentStatus: formData.get('paymentStatus') as PaymentStatus,
      deliveryStatus: formData.get('deliveryStatus') as DeliveryStatus,
    })
    setLoading(false)
    if (!result.success) {
      setError(result.errors.general[0] ?? 'Erro ao atualizar')
      return
    }
    router.refresh()
  }

  return (
    <section className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
      <h2 className="font-medium">Status</h2>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit(new FormData(event.currentTarget))
        }}
        className="space-y-3"
      >
        <label className="block text-sm">
          Pedido
          <select
            name="orderStatus"
            defaultValue={orderStatus}
            className="mt-1 w-full rounded-lg border border-[var(--input-border)] bg-[var(--background)] px-2 py-1"
          >
            {Object.entries(orderStatusLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Pagamento
          <select
            name="paymentStatus"
            defaultValue={paymentStatus}
            className="mt-1 w-full rounded-lg border border-[var(--input-border)] bg-[var(--background)] px-2 py-1"
          >
            {Object.entries(paymentStatusLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Entrega
          <select
            name="deliveryStatus"
            defaultValue={deliveryStatus}
            className="mt-1 w-full rounded-lg border border-[var(--input-border)] bg-[var(--background)] px-2 py-1"
          >
            {Object.entries(deliveryStatusLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:text-[#141010]"
        >
          {loading ? 'Salvando...' : 'Atualizar status'}
        </button>
      </form>
    </section>
  )
}
