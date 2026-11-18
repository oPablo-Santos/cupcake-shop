import type { z } from 'zod'

export type ActionFailure = {
  success: false
  errors: { general: string[]; field?: Record<string, string[]> }
}

export type ActionSuccess<T> = { success: true; data: T }

export function validateWithZod<T extends z.ZodType>(
  schema: T,
  input: unknown,
):
  | { ok: true; data: z.infer<T> }
  | { ok: false; errors: string[]; field: Record<string, string[]> } {
  const parsed = schema.safeParse(input)
  if (parsed.success) return { ok: true, data: parsed.data }

  const field: Record<string, string[]> = {}
  for (const issue of parsed.error.issues) {
    const key = issue.path[0]
    if (typeof key !== 'string') continue
    if (!field[key]) field[key] = [issue.message]
  }

  const errors = parsed.error.issues.map((issue) => issue.message)
  return { ok: false, errors, field }
}

export function fieldErrorsFlat(field?: Record<string, string[]>): Record<string, string> {
  if (!field) return {}
  const out: Record<string, string> = {}
  for (const [key, messages] of Object.entries(field)) {
    if (messages[0]) out[key] = messages[0]
  }
  return out
}

export function actionError(message: string, field?: Record<string, string[]>): ActionFailure {
  return { success: false, errors: { general: [message], field } }
}

export function domainMessage(code: string, fallback: string) {
  const map: Record<string, string> = {
    PRODUCT_NOT_FOUND: 'Produto não encontrado',
    PRODUCT_UNAVAILABLE: 'Produto indisponível',
    ORDER_NOT_FOUND: 'Pedido não encontrado',
    INVALID_CREDENTIALS: 'Usuário ou senha inválidos',
    ADMIN_MISCONFIGURED:
      'Área admin indisponível. Configure ADMIN_SESSION_SECRET e ADMIN_PASSWORD para o primeiro acesso.',
    ADMIN_NOT_FOUND: 'Administrador não encontrado',
    USERNAME_TAKEN: 'Nome de usuário já em uso',
    CANNOT_DEACTIVATE_SELF: 'Você não pode desativar sua própria conta',
    WEAK_PASSWORD: 'Senha fraca: use pelo menos 12 caracteres e evite valores óbvios',
    RATE_LIMITED: 'Muitas tentativas. Aguarde um momento e tente novamente.',
    EMPTY_CART: 'Carrinho vazio',
    INVALID_ZIP: 'Informe um CEP válido com 8 dígitos',
  }
  return map[code] ?? fallback
}
