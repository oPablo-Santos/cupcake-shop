import { left, type Either } from '@business/either'
import type { CreateOrderInput, IOrderRepository } from '@business/iOrderRepository'
import type { IProductRepository } from '@business/iProductRepository'
import type { Order } from '@domain/order'
import type { DomainError } from '@domain/errors'
import { emptyCart, invalidZipCode, productNotFound, productUnavailable } from '@domain/errors'
import { calculateShippingCents } from '@domain/shipping'

export type CheckoutLineInput = { productId: string; quantity: number }

export class CreateOrderUseCase {
  constructor(
    private readonly orders: IOrderRepository,
    private readonly products: IProductRepository,
  ) {}

  async execute(
    customer: Omit<CreateOrderInput, 'items' | 'totalCents' | 'paymentMethod'> & {
      paymentMethod: CreateOrderInput['paymentMethod']
    },
    lines: CheckoutLineInput[],
  ): Promise<Either<DomainError, Order>> {
    if (lines.length === 0) return left(emptyCart)

    const resolved: CreateOrderInput['items'] = []
    let totalCents = 0

    for (const line of lines) {
      if (line.quantity < 1) continue
      const product = await this.products.findById(line.productId)
      if (!product) return left(productNotFound)
      if (!product.available) return left(productUnavailable)

      const unitPriceCents = product.priceCents
      totalCents += unitPriceCents * line.quantity
      resolved.push({
        productId: product.id,
        quantity: line.quantity,
        unitPriceCents,
      })
    }

    if (resolved.length === 0) return left(emptyCart)

    const shippingCents = calculateShippingCents(customer.zipCode, totalCents)
    if (shippingCents === null) return left(invalidZipCode)

    return this.orders.createOrderAtomic({
      ...customer,
      totalCents: totalCents + shippingCents,
      items: resolved,
    })
  }
}
