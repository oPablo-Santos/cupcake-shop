'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  checkoutSchema,
  adminLoginSchema,
  createAdminSchema,
  productSchema,
  updateProductSchema,
  updateOrderStatusesSchema,
} from '@controller/schemas'
import { actionError, domainMessage, validateWithZod, type ActionFailure, type ActionSuccess } from '@controller/actionResult'
import { consumeRateLimit } from '@controller/rateLimit'
import { useCases, SESSION_COOKIE, MAX_AGE_SEC } from '@framework/ioc/useCases'
import type { Product } from '@domain/product'
import type { Order } from '@domain/order'
import type { AdminUser } from '@domain/adminUser'

async function rateLimitKey(scope: string) {
  const headerStore = await headers()
  const forwarded = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim()
  const ip = forwarded || headerStore.get('x-real-ip') || 'unknown'
  return `${scope}:${ip}`
}

export async function getCatalogProducts(): Promise<ActionSuccess<Product[]> | ActionFailure> {
  try {
    const result = await useCases.listAvailableProducts.execute()
    if (result.kind === 'left') return actionError('Erro ao carregar catálogo')
    return { success: true as const, data: result.value }
  } catch (error) {
    console.error('Failed to load catalog', error)
    return actionError(
      'Catálogo temporariamente indisponível. Verifique se o PostgreSQL está ativo e tente novamente.',
    )
  }
}

export async function checkoutAction(raw: unknown) {
  if (!consumeRateLimit(await rateLimitKey('checkout'), 10, 60_000)) {
    return actionError(domainMessage('RATE_LIMITED', 'Muitas tentativas'))
  }

  const validated = validateWithZod(checkoutSchema, raw)
  if (!validated.ok) {
    return actionError('Revise os campos do formulário.', validated.field)
  }

  try {
    const { items, ...customer } = validated.data
    const result = await useCases.createOrder.execute(
      {
        ...customer,
        complement: customer.complement ?? null,
      },
      items,
    )

    if (result.kind === 'left') {
      return actionError(domainMessage(result.value.code, result.value.message))
    }

    return { success: true as const, data: { orderId: result.value.id } }
  } catch (error) {
    console.error('Checkout failed', error)
    return actionError('Não foi possível finalizar o pedido. Tente novamente em instantes.')
  }
}

export async function adminLoginAction(raw: unknown) {
  if (!consumeRateLimit(await rateLimitKey('admin-login'), 5, 60_000)) {
    return actionError(domainMessage('RATE_LIMITED', 'Muitas tentativas'))
  }

  const validated = validateWithZod(adminLoginSchema, raw)
  if (!validated.ok) return actionError(validated.errors[0] ?? 'Revise usuário e senha', validated.field)

  const bootstrap = await useCases.bootstrapAdmin.execute()
  if (bootstrap.kind === 'left' && bootstrap.value.code === 'ADMIN_MISCONFIGURED') {
    return actionError(domainMessage(bootstrap.value.code, bootstrap.value.message))
  }

  const result = await useCases.adminLogin.execute(validated.data.username, validated.data.password)
  if (result.kind === 'left') {
    return actionError(domainMessage(result.value.code, result.value.message))
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, result.value.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: MAX_AGE_SEC,
  })

  return { success: true as const, data: { ok: true } }
}

export async function adminLogoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete({ name: SESSION_COOKIE, path: '/admin' })
  redirect('/admin/login')
}

async function requireAdminId() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const session = await useCases.verifyAdminSession.execute(token)
  if (session.kind === 'left') return null
  return session.value.adminUserId
}

export async function adminListProductsAction(): Promise<ActionSuccess<Product[]> | ActionFailure> {
  if (!(await requireAdminId())) return actionError('Não autorizado')
  const result = await useCases.listAllProducts.execute()
  return { success: true as const, data: result.value }
}

export async function adminCreateProductAction(raw: unknown) {
  if (!(await requireAdminId())) return actionError('Não autorizado')
  const validated = validateWithZod(productSchema, raw)
  if (!validated.ok) {
    return actionError(validated.errors[0] ?? 'Revise os campos do produto.', validated.field)
  }

  const result = await useCases.createProduct.execute(validated.data)
  return { success: true as const, data: result.value }
}

export async function adminUpdateProductAction(id: string, raw: unknown) {
  if (!(await requireAdminId())) return actionError('Não autorizado')
  const validated = validateWithZod(updateProductSchema, raw)
  if (!validated.ok) {
    return actionError(validated.errors[0] ?? 'Revise os campos do produto.', validated.field)
  }

  const result = await useCases.updateProduct.execute(id, validated.data)
  if (result.kind === 'left') {
    return actionError(domainMessage(result.value.code, result.value.message))
  }
  return { success: true as const, data: result.value }
}

export async function adminDeactivateProductAction(id: string) {
  if (!(await requireAdminId())) return actionError('Não autorizado')
  const result = await useCases.deactivateProduct.execute(id)
  if (result.kind === 'left') {
    return actionError(domainMessage(result.value.code, result.value.message))
  }
  return { success: true as const, data: result.value }
}

export async function adminListOrdersAction(): Promise<ActionSuccess<Order[]> | ActionFailure> {
  if (!(await requireAdminId())) return actionError('Não autorizado')
  const result = await useCases.listOrders.execute()
  return { success: true as const, data: result.value }
}

export async function adminGetOrderAction(id: string): Promise<ActionSuccess<Order> | ActionFailure> {
  if (!(await requireAdminId())) return actionError('Não autorizado')
  const result = await useCases.getOrder.execute(id)
  if (result.kind === 'left') {
    return actionError(domainMessage(result.value.code, result.value.message))
  }
  return { success: true as const, data: result.value }
}

export async function adminUpdateOrderStatusesAction(id: string, raw: unknown) {
  if (!(await requireAdminId())) return actionError('Não autorizado')
  const validated = validateWithZod(updateOrderStatusesSchema, raw)
  if (!validated.ok) return actionError('Dados inválidos')

  const result = await useCases.updateOrderStatuses.execute(id, validated.data)
  if (result.kind === 'left') {
    return actionError(domainMessage(result.value.code, result.value.message))
  }
  return { success: true as const, data: result.value }
}

export async function isAdminAuthenticatedAction() {
  const adminUserId = await requireAdminId()
  return {
    success: true as const,
    data: { authenticated: !!adminUserId, adminUserId: adminUserId ?? undefined },
  }
}

export async function adminListAdminsAction(): Promise<ActionSuccess<AdminUser[]> | ActionFailure> {
  if (!(await requireAdminId())) return actionError('Não autorizado')
  const result = await useCases.listAdminUsers.execute()
  if (result.kind === 'left') return actionError('Erro ao listar administradores')
  return { success: true as const, data: result.value }
}

export async function adminCreateAdminAction(raw: unknown) {
  if (!(await requireAdminId())) return actionError('Não autorizado')
  const validated = validateWithZod(createAdminSchema, raw)
  if (!validated.ok) {
    return actionError(validated.errors[0] ?? 'Revise os campos', validated.field)
  }

  const result = await useCases.createAdminUser.execute(
    validated.data.username,
    validated.data.password,
  )
  if (result.kind === 'left') {
    return actionError(domainMessage(result.value.code, result.value.message))
  }
  return { success: true as const, data: result.value }
}

export async function adminDeactivateAdminAction(id: string) {
  const currentAdminId = await requireAdminId()
  if (!currentAdminId) return actionError('Não autorizado')

  const result = await useCases.deactivateAdminUser.execute(id, currentAdminId)
  if (result.kind === 'left') {
    return actionError(domainMessage(result.value.code, result.value.message))
  }
  return { success: true as const, data: result.value }
}
