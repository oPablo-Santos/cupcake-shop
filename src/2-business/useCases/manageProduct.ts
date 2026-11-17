import { left, right, type Either } from '@business/either'
import type { IProductRepository } from '@business/iProductRepository'
import type { Product } from '@domain/product'
import type { DomainError } from '@domain/errors'
import { productNotFound } from '@domain/errors'

export class CreateProductUseCase {
  constructor(private readonly products: IProductRepository) {}

  async execute(
    input: Parameters<IProductRepository['create']>[0],
  ): Promise<Either<never, Product>> {
    const product = await this.products.create(input)
    return right(product)
  }
}

export class UpdateProductUseCase {
  constructor(private readonly products: IProductRepository) {}

  async execute(
    id: string,
    input: Parameters<IProductRepository['update']>[1],
  ): Promise<Either<DomainError, Product>> {
    const product = await this.products.update(id, input)
    if (!product) return left(productNotFound)
    return right(product)
  }
}

export class DeactivateProductUseCase {
  constructor(private readonly products: IProductRepository) {}

  async execute(id: string): Promise<Either<DomainError, Product>> {
    const existing = await this.products.findById(id)
    if (!existing) return left(productNotFound)

    const product = await this.products.update(id, { available: false })
    if (!product) return left(productNotFound)
    return right(product)
  }
}
