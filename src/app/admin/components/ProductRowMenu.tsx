'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { adminActivateProductAction, adminDeactivateProductAction } from '@/app/actions/shop'
import { ActionMenu } from '@/app/admin/components/ActionMenu'

export function ProductRowMenu({ productId, available }: { productId: string; available: boolean }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function setAvailable(next: boolean) {
    const message = next
      ? 'Ativar este produto no catálogo?'
      : 'Inativar este produto? Ele sai do catálogo público.'
    if (!window.confirm(message)) return
    setBusy(true)
    const result = next
      ? await adminActivateProductAction(productId)
      : await adminDeactivateProductAction(productId)
    setBusy(false)
    if (!result.success) {
      window.alert(result.errors.general[0] ?? 'Não foi possível atualizar o produto')
      return
    }
    router.refresh()
  }

  return (
    <ActionMenu
      busy={busy}
      items={[
        { label: 'Editar', href: `/admin/products/${productId}` },
        { label: 'Ativar', disabled: available, onSelect: () => void setAvailable(true) },
        {
          label: 'Inativar',
          danger: true,
          disabled: !available,
          onSelect: () => void setAvailable(false),
        },
      ]}
    />
  )
}
