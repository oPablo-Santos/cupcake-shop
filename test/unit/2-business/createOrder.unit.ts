import { CreateOrderUseCase } from '@business/useCases/createOrder'
import type { IOrderRepository } from '@business/iOrderRepository'
import type { IProductRepository } from '@business/iProductRepository'
import type { Order } from '@domain/order'
import {
  emptyCart,
  productNotFound,
  productUnavailable,
} from '@domain/errors'
import { right } from '@business/either'

const customer = {
  customerName: 'Ana',
  customerEmail: 'ana@example.com',
  customerPhone: '11999999999',
  street: 'Rua A',
  number: '1',
  neighborhood: 'Centro',
  city: 'SP',
  state: 'SP',
  zipCode: '01001000',
  paymentMethod: 'PIX' as const,
}

function makeProduct(overrides: Partial<{ id: string; available: boolean; priceCents: number }> = {}) {
  return {
    id: overrides.id ?? 'p1',
    name: 'Cupcake',
    description: 'Teste',
    priceCents: overrides.priceCents ?? 500,
    imageUrl: 'https://example.com/a.jpg',
    available: overrides.available ?? true,
  }
}

describe('CreateOrderUseCase', () => {
  it('recalcula total e delega persistência atômica', async () => {
    const products: IProductRepository = {
      findById: async (id) => (id === 'p1' ? makeProduct({ priceCents: 750 }) : null),
      findAvailable: async () => [],
      findAll: async () => [],
      create: async () => makeProduct(),
      update: async () => null,
    }

    let capturedTotal: number | undefined
    const orders: IOrderRepository = {
      createOrderAtomic: async (input) => {
        capturedTotal = input.totalCents
        const order: Order = {
          id: 'o1',
          ...customer,
          complement: null,
          totalCents: input.totalCents,
          orderStatus: 'PENDING',
          paymentStatus: 'PENDING',
          deliveryStatus: 'PENDING',
          createdAt: new Date(),
          items: input.items.map((item) => ({
            ...item,
            productName: 'Cupcake',
          })),
        }
        return right(order)
      },
      findAll: async () => [],
      findById: async () => null,
      updateStatuses: async () => null,
    }

    const useCase = new CreateOrderUseCase(orders, products)
    const result = await useCase.execute(customer, [{ productId: 'p1', quantity: 2 }])

    expect(result.kind).toBe('right')
    expect(capturedTotal).toBe(1500 + 1061)
  })

  it('retorna PRODUCT_NOT_FOUND', async () => {
    const products: IProductRepository = {
      findById: async () => null,
      findAvailable: async () => [],
      findAll: async () => [],
      create: async () => makeProduct(),
      update: async () => null,
    }
    const orders: IOrderRepository = {
      createOrderAtomic: async () => {
        throw new Error('should not persist')
      },
      findAll: async () => [],
      findById: async () => null,
      updateStatuses: async () => null,
    }

    const useCase = new CreateOrderUseCase(orders, products)
    const result = await useCase.execute(customer, [{ productId: 'missing', quantity: 1 }])

    expect(result).toEqual({ kind: 'left', value: productNotFound })
  })

  it('retorna PRODUCT_UNAVAILABLE', async () => {
    const products: IProductRepository = {
      findById: async () => makeProduct({ available: false }),
      findAvailable: async () => [],
      findAll: async () => [],
      create: async () => makeProduct(),
      update: async () => null,
    }
    const orders: IOrderRepository = {
      createOrderAtomic: async () => {
        throw new Error('should not persist')
      },
      findAll: async () => [],
      findById: async () => null,
      updateStatuses: async () => null,
    }

    const useCase = new CreateOrderUseCase(orders, products)
    const result = await useCase.execute(customer, [{ productId: 'p1', quantity: 1 }])

    expect(result).toEqual({ kind: 'left', value: productUnavailable })
  })

  it('retorna EMPTY_CART', async () => {
    const products: IProductRepository = {
      findById: async () => makeProduct(),
      findAvailable: async () => [],
      findAll: async () => [],
      create: async () => makeProduct(),
      update: async () => null,
    }
    const orders: IOrderRepository = {
      createOrderAtomic: async () => {
        throw new Error('should not persist')
      },
      findAll: async () => [],
      findById: async () => null,
      updateStatuses: async () => null,
    }

    const useCase = new CreateOrderUseCase(orders, products)

    expect(await useCase.execute(customer, [])).toEqual({ kind: 'left', value: emptyCart })
    expect(await useCase.execute(customer, [{ productId: 'p1', quantity: 0 }])).toEqual({
      kind: 'left',
      value: emptyCart,
    })
  })
})
