'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { adminLoginSchema } from '@controller/schemas'
import { fieldErrorsFlat, validateWithZod } from '@controller/actionResult'
import { adminLoginAction } from '@/app/actions/shop'
import { FormField } from '@/app/components/FormField'

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setFieldErrors({})

    const payload = {
      username: String(formData.get('username') ?? '').trim(),
      password: String(formData.get('password') ?? ''),
    }
    const validated = validateWithZod(adminLoginSchema, payload)
    if (!validated.ok) {
      setLoading(false)
      setFieldErrors(fieldErrorsFlat(validated.field))
      setError(validated.errors[0] ?? 'Revise usuário e senha')
      return
    }

    const result = await adminLoginAction(validated.data)
    setLoading(false)
    if (!result.success) {
      setFieldErrors(fieldErrorsFlat(result.errors.field))
      setError(result.errors.general[0] ?? 'Falha no login')
      return
    }
    router.push('/admin/products')
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Área restrita da loja</p>
      </div>
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      ) : null}
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit(new FormData(event.currentTarget))
        }}
        className="glass-card space-y-4 p-6"
      >
        <FormField
          label="Usuário"
          name="username"
          autoComplete="username"
          error={fieldErrors.username}
        />
        <FormField
          label="Senha"
          name="password"
          type="password"
          autoComplete="current-password"
          error={fieldErrors.password}
        />
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}