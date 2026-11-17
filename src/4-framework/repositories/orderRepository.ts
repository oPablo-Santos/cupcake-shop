import { left, right, type Either } from '@business/either'
import type { CreateOrderInput, IOrderRepository, UpdateOrderStatusesInput } from '@business/iOrderRepository'
import type { Order } from '@domain/order'
import type { DomainError } from '@domain/errors'
import { emptyCart, productNotFound, productUnavailable } from '@domain/errors'
import { prisma } from '@framework/db/prisma'

function mapOrder(row: {
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
  paymentMethod: Order['paymentMethod']
  totalCents: number
  orderStatus: Order['orderStatus']
  paymentStatus: Order['paymentStatus']
  deliveryStatus: Order['deliveryStatus']
  createdAt: Date
  items: {
    productId: string
    quantity: number
    unitPriceCents: number
    product: { name: string }
  }[]
}): Order {
  return {
    id: row.id,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    customerPhone: row.customerPhone,
    street: row.street,
    number: row.number,
    complement: row.complement,
    neighborhood: row.neighborhood,
    city: row.city,
    state: row.state,
    zipCode: row.zipCode,
    paymentMethod: row.paymentMethod,
    totalCents: row.totalCents,
    orderStatus: row.orderStatus,
    paymentStatus: row.paymentStatus,
    deliveryStatus: row.deliveryStatus,
    createdAt: row.createdAt,
    items: row.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
      productName: item.product.name,
    })),
  }
}

const orderInclude = {
  items: { include: { product: { select: { name: true } } } },
} as const

class OrderCreateAbort extends Error {
  constructor(readonly domain: DomainError) {
    super(domain.code)
  }
}

export class OrderRepository implements IOrderRepository {
  async createOrderAtomic(input: CreateOrderInput): Promise<Either<DomainError, Order>> {
    try {
      const row = await prisma.$transaction(async (tx) => {
        const itemsToCreate: CreateOrderInput['items'] = []

        for (const item of input.items) {
          const product = await tx.product.findUnique({ where: { id: item.productId } })
          if (!product) throw new OrderCreateAbort(productNotFound)
          if (!product.available) throw new OrderCreateAbort(productUnavailable)

          const unitPriceCents = product.priceCents
          itemsToCreate.push({
            productId: product.id,
            quantity: item.quantity,
            unitPriceCents,
          })
        }

        if (itemsToCreate.length === 0) throw new OrderCreateAbort(emptyCart)

        return tx.order.create({
          data: {
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            customerPhone: input.customerPhone,
            street: input.street,
            number: input.number,
            complement: input.complement ?? null,
            neighborhood: input.neighborhood,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode,
            paymentMethod: input.paymentMethod,
            totalCents: input.totalCents,
            items: {
              create: itemsToCreate.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPriceCents: item.unitPriceCents,
              })),
            },
          },
          include: orderInclude,
        })
      })

      return right(mapOrder(row))
    } catch (error) {
      if (error instanceof OrderCreateAbort) return left(error.domain)
      throw error
    }
  }

  async findAll() {
    const rows = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: orderInclude,
    })
    return rows.map(mapOrder)
  }

  async findById(id: string) {
    const row = await prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    })
    return row ? mapOrder(row) : null
  }

  async updateStatuses(id: string, input: UpdateOrderStatusesInput) {
    try {
      const row = await prisma.order.update({
        where: { id },
        data: input,
        include: orderInclude,
      })
      return mapOrder(row)
    } catch {
      return null
    }
  }
}
