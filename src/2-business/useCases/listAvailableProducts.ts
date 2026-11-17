import { right, type Either } from '@business/either'
import type { IProductRepository } from '@business/iProductRepository'
import type { Product } from '@domain/product'

export class ListAvailableProductsUseCase {
  constructor(private readonly products: IProductRepository) {}

  async execute(): Promise<Either<never, Product[]>> {
    const list = await this.products.findAvailable()
    return right(list)
  }
}
