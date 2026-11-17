import { right, type Either } from '@business/either'
import type { IProductRepository } from '@business/iProductRepository'
import type { Product } from '@domain/product'

export class ListAllProductsUseCase {
  constructor(private readonly products: IProductRepository) {}

  async execute(): Promise<Either<never, Product[]>> {
    return right(await this.products.findAll())
  }
}
