import type { Either } from '@business/either'
import type { Order, DeliveryStatus, OrderStatus, PaymentMethod, PaymentStatus } from '@domain/order'
import type { DomainError } from '@domain/errors'

export type CreateOrderInput = {
  customerName: string
  customerEmail: string
  customerPhone: string
  street: string
  number: string
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  zipCode: string
  paymentMethod: PaymentMethod
  totalCents: number
  items: { productId: string; quantity: number; unitPriceCents: number }[]
}

export type UpdateOrderStatusesInput = {
  orderStatus?: OrderStatus
  paymentStatus?: PaymentStatus
  deliveryStatus?: DeliveryStatus
}

export interface IOrderRepository {
  createOrderAtomic(input: CreateOrderInput): Promise<Either<DomainError, Order>>
  findAll(): Promise<Order[]>
  findById(id: string): Promise<Order | null>
  updateStatuses(id: string, input: UpdateOrderStatusesInput): Promise<Order | null>
}
