import { left, right, type Either } from '@business/either'
import type { IOrderRepository } from '@business/iOrderRepository'
import type { Order } from '@domain/order'
import type { DomainError } from '@domain/errors'
import { orderNotFound } from '@domain/errors'

export class ListOrdersUseCase {
  constructor(private readonly orders: IOrderRepository) {}

  async execute(): Promise<Either<never, Order[]>> {
    return right(await this.orders.findAll())
  }
}

export class GetOrderUseCase {
  constructor(private readonly orders: IOrderRepository) {}

  async execute(id: string): Promise<Either<DomainError, Order>> {
    const order = await this.orders.findById(id)
    if (!order) return left(orderNotFound)
    return right(order)
  }
}

export class UpdateOrderStatusesUseCase {
  constructor(private readonly orders: IOrderRepository) {}

  async execute(
    id: string,
    input: Parameters<IOrderRepository['updateStatuses']>[1],
  ): Promise<Either<DomainError, Order>> {
    const order = await this.orders.updateStatuses(id, input)
    if (!order) return left(orderNotFound)
    return right(order)
  }
}
