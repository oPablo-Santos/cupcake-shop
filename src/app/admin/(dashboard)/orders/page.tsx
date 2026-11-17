import Link from 'next/link'
import { adminListOrdersAction } from '@/app/actions/shop'
import { formatCents } from '@/lib/money'
import { AdminNav } from '@/app/admin/components/AdminNav'

export default async function AdminOrdersPage() {
  const result = await adminListOrdersAction()
  if (!result.success) return <p className="text-red-600 dark:text-red-400">{result.errors.general[0]}</p>

  return (
    <div className="space-y-6">
      <AdminNav />
      <h1 className="text-2xl font-semibold">Pedidos</h1>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)] text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {result.data.map((order) => (
              <tr key={order.id} className="transition hover:bg-[var(--surface-muted)]/60">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="text-[var(--accent)] underline">
                    {order.id.slice(0, 8)}…
                  </Link>
                </td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="px-4 py-3">{formatCents(order.totalCents)}</td>
                <td className="px-4 py-3">{order.orderStatus}</td>
                <td className="px-4 py-3">{order.createdAt.toLocaleString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {result.data.length === 0 && (
          <p className="px-4 py-6 text-[var(--muted-foreground)]">Nenhum pedido ainda.</p>
        )}
      </div>
    </div>
  )
}
