export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3456'
}

export const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=1200&h=630&fit=crop&auto=format'

export const PAYMENT_METHOD_LABELS = {
  PIX: 'PIX',
  CREDIT_CARD: 'Cartão de crédito',
  CASH_ON_DELIVERY: 'Pagamento na entrega',
} as const
