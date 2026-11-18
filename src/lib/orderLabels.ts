import type { DeliveryStatus, OrderStatus, PaymentMethod, PaymentStatus } from '@domain/order'

export const orderStatusLabel: Record<OrderStatus, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado',
}

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  FAILED: 'Falhou',
  REFUNDED: 'Estornado',
}

export const deliveryStatusLabel: Record<DeliveryStatus, string> = {
  PENDING: 'Pendente',
  PREPARING: 'Preparando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
}

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  PIX: 'PIX',
  CREDIT_CARD: 'Cartão de crédito',
  CASH_ON_DELIVERY: 'Pagamento na entrega',
}
