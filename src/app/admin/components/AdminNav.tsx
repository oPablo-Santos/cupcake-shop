import Link from 'next/link'
import { adminLogoutAction } from '@/app/actions/shop'

export function AdminNav() {
  return (
    <nav className="glass-card flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-4">
        <Link href="/admin/products" className="font-medium text-[var(--foreground)] hover:text-[var(--accent)]">
          Produtos
        </Link>
        <Link href="/admin/orders" className="font-medium text-[var(--muted-foreground)] hover:text-[var(--accent)]">
          Pedidos
        </Link>
        <Link href="/admin/admins" className="font-medium text-[var(--muted-foreground)] hover:text-[var(--accent)]">
          Administradores
        </Link>
      </div>
      <form action={adminLogoutAction}>
        <button type="submit" className="btn btn-ghost text-sm">
          Sair
        </button>
      </form>
    </nav>
  )
}