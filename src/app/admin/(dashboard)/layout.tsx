import { redirect } from 'next/navigation'
import { isAdminAuthenticatedAction } from '@/app/actions/shop'

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const result = await isAdminAuthenticatedAction()
  if (!result.success || !result.data.authenticated) {
    redirect('/admin/login')
  }
  return children
}
