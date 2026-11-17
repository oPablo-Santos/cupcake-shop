import { notFound } from 'next/navigation'
import { adminGetOrderAction } from '@/app/actions/shop'
import { formatCents } from '@/lib/money'
import { maskEmail, maskPhone } from '@/lib/pii'
import { AdminNav } from '@/app/admin/components/AdminNav'
import { OrderStatusForm } from '@/app/admin/components/OrderStatusForm'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await adminGetOrderAction(id)
  if (!result.success) {
    if (result.errors.general[0]?.includes('não encontrado')) notFound()
    return <p className="text-red-600 dark:text-red-400">{result.errors.general[0]}</p>
  }

  const order = result.data

  return (
    <div className="space-y-6">
      <AdminNav />
      <div>
        <h1 className="text-2xl font-semibold">Pedido</h1>
        <p className="text-sm text-[var(--muted-foreground)]">{order.id}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="font-medium">Cliente</h2>
          <p>{order.customerName}</p>
          <p className="text-sm text-[var(--muted-foreground)]">{maskEmail(order.customerEmail)}</p>
          <p className="text-sm text-[var(--muted-foreground)]">{maskPhone(order.customerPhone)}</p>
          <p className="text-sm">
            {order.street}, {order.number}
            {order.complement ? ` - ${order.complement}` : ''}
            <br />
            {order.neighborhood} — {order.city}/{order.state} — CEP {order.zipCode}
          </p>
          <p className="text-sm">Pagamento: {order.paymentMethod}</p>
          <p className="font-medium">Total: {formatCents(order.totalCents)}</p>
        </section>

        <OrderStatusForm
          orderId={order.id}
          orderStatus={order.orderStatus}
          paymentStatus={order.paymentStatus}
          deliveryStatus={order.deliveryStatus}
        />
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
        <h2 className="mb-3 font-medium">Itens</h2>
        <ul className="space-y-2 text-sm">
          {order.items.map((item) => (
            <li key={`${item.productId}-${item.unitPriceCents}`} className="flex justify-between">
              <span>
                {item.productName ?? item.productId} × {item.quantity}
              </span>
              <span>{formatCents(item.unitPriceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
