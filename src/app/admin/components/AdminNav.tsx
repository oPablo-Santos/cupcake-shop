import Link from 'next/link'
import { adminLogoutAction } from '@/app/actions/shop'

export function AdminNav() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
      <nav className="flex gap-4 text-sm font-medium">
        <Link href="/admin/products" className="text-[var(--muted-foreground)] hover:text-[var(--accent)]">
          Produtos
        </Link>
        <Link href="/admin/orders" className="text-[var(--muted-foreground)] hover:text-[var(--accent)]">
          Pedidos
        </Link>
      </nav>
      <form action={adminLogoutAction}>
        <button
          type="submit"
          className="text-sm text-[var(--muted-foreground)] hover:text-red-600 dark:hover:text-red-400"
        >
          Sair
        </button>
      </form>
    </div>
  )
}
