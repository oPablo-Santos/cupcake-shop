import Link from 'next/link'
import { adminListProductsAction } from '@/app/actions/shop'
import { formatCents } from '@/lib/money'
import { AdminNav } from '@/app/admin/components/AdminNav'
import { ProductForm } from '@/app/admin/components/ProductForm'
import { DeactivateProductButton } from '@/app/admin/components/DeactivateProductButton'

export default async function AdminProductsPage() {
  const result = await adminListProductsAction()

  if (!result.success) {
    return <p className="text-red-600 dark:text-red-400">{result.errors.general[0]}</p>
  }

  return (
    <div className="space-y-8">
      <AdminNav />
      <div>
        <h1 className="text-2xl font-semibold">Produtos</h1>
        <p className="text-[var(--muted-foreground)]">CRUD e desativação (sem exclusão destrutiva).</p>
      </div>

      <ProductForm />

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)] text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Preço</th>
              <th className="px-4 py-3 font-medium">Disponível</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {result.data.map((product) => (
              <tr key={product.id} className="transition hover:bg-[var(--surface-muted)]/60">
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">{formatCents(product.priceCents)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      product.available
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}
                  >
                    {product.available ? 'Sim' : 'Não'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/products/${product.id}`} className="text-[var(--accent)] underline">
                      Editar
                    </Link>
                    {product.available && <DeactivateProductButton productId={product.id} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
