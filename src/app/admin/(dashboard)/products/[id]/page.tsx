import { notFound } from 'next/navigation'
import { adminListProductsAction } from '@/app/actions/shop'
import { AdminNav } from '@/app/admin/components/AdminNav'
import { ProductForm } from '@/app/admin/components/ProductForm'

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await adminListProductsAction()
  if (!result.success) return <p className="text-red-600 dark:text-red-400">{result.errors.general[0]}</p>

  const product = result.data.find((p) => p.id === id)
  if (!product) notFound()

  return (
    <div className="space-y-6">
      <AdminNav />
      <h1 className="text-2xl font-semibold">Editar produto</h1>
      <ProductForm product={product} />
    </div>
  )
}
