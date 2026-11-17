export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'CASH_ON_DELIVERY'
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
export type DeliveryStatus = 'PENDING' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export type OrderItemLine = {
  productId: string
  quantity: number
  unitPriceCents: number
  productName?: string
}

export type Order = {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  zipCode: string
  paymentMethod: PaymentMethod
  totalCents: number
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
  deliveryStatus: DeliveryStatus
  createdAt: Date
  items: OrderItemLine[]
}
