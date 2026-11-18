'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createAdminSchema } from '@controller/schemas'
import { fieldErrorsFlat, validateWithZod } from '@controller/actionResult'
import { adminCreateAdminAction } from '@/app/actions/shop'
import { FormField } from '@/app/components/FormField'

export function CreateAdminForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)
    setFieldErrors({})

    const payload = {
      username: String(formData.get('username') ?? '').trim(),
      password: String(formData.get('password') ?? ''),
    }
    const validated = validateWithZod(createAdminSchema, payload)
    if (!validated.ok) {
      setLoading(false)
      setFieldErrors(fieldErrorsFlat(validated.field))
      setError(validated.errors[0] ?? 'Revise os campos')
      return
    }

    const result = await adminCreateAdminAction(validated.data)
    setLoading(false)
    if (!result.success) {
      setFieldErrors(fieldErrorsFlat(result.errors.field))
      setError(result.errors.general[0] ?? 'Erro ao criar administrador')
      return
    }

    setSuccess(`Administrador “${result.data.username}” criado.`)
    router.refresh()
  }

  return (
    <div className="glass-card p-4">
      <h2 className="mb-3 font-medium">Novo administrador</h2>
      {success ? (
        <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {success}
        </p>
      ) : null}
      {error ? <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit(new FormData(event.currentTarget))
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        <FormField label="Usuário" name="username" error={fieldErrors.username} autoComplete="off" />
        <FormField
          label="Senha"
          name="password"
          type="password"
          error={fieldErrors.password}
          autoComplete="new-password"
          hint="Mínimo 12 caracteres"
        />
        <button type="submit" disabled={loading} className="btn btn-primary sm:col-span-2">
          {loading ? 'Criando...' : 'Criar administrador'}
        </button>
      </form>
    </div>
  )
}