'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { adminLoginSchema } from '@controller/schemas'
import { validateWithZod } from '@controller/actionResult'
import { adminLoginAction } from '@/app/actions/shop'

const inputClass =
  'w-full rounded-lg border border-[var(--input-border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]'

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const payload = { password: String(formData.get('password') ?? '') }
    const validated = validateWithZod(adminLoginSchema, payload)
    if (!validated.ok) {
      setLoading(false)
      setError(validated.errors[0] ?? 'Informe a senha')
      return
    }

    const result = await adminLoginAction(validated.data)
    setLoading(false)
    if (!result.success) {
      setError(result.errors.general[0] ?? 'Falha no login')
      return
    }
    router.push('/admin/products')
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Área restrita da loja</p>
      </div>
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit(new FormData(event.currentTarget))
        }}
        className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
      >
        <label className="block space-y-1 text-sm">
          <span>Senha</span>
          <input type="password" name="password" className={inputClass} autoComplete="current-password" />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--accent)] py-2 font-medium text-white disabled:opacity-60 dark:text-[#141010]"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
