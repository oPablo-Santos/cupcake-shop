import Link from 'next/link'
import { adminListOrdersAction } from '@/app/actions/shop'
import { formatCents } from '@/lib/money'
import { AdminNav } from '@/app/admin/components/AdminNav'

const statusBadge: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
  CONFIRMED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
  CANCELLED: 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
}

export default async function AdminOrdersPage() {
  const result = await adminListOrdersAction()
  if (!result.success) return <p className="text-red-600 dark:text-red-400">{result.errors.general[0]}</p>

  return (
    <div className="space-y-6">
      <AdminNav />
      <div>
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Acompanhe status e detalhes de cada encomenda.</p>
      </div>

      {result.data.length === 0 ? (
        <div className="glass-card p-8 text-center text-[var(--muted-foreground)]">Nenhum pedido ainda.</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
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
                      <Link href={`/admin/orders/${order.id}`} className="font-medium text-[var(--accent)] hover:underline">
                        {order.id.slice(0, 8)}…
                      </Link>
                    </td>
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3">{formatCents(order.totalCents)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[order.orderStatus] ?? statusBadge.PENDING}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      {order.createdAt.toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}