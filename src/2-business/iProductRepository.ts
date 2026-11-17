import type { Product } from '@domain/product'

export type CreateProductInput = {
  name: string
  description: string
  priceCents: number
  imageUrl: string
  available?: boolean
}

export type UpdateProductInput = {
  name?: string
  description?: string
  priceCents?: number
  imageUrl?: string
  available?: boolean
}

export interface IProductRepository {
  findAvailable(): Promise<Product[]>
  findAll(): Promise<Product[]>
  findById(id: string): Promise<Product | null>
  create(input: CreateProductInput): Promise<Product>
  update(id: string, input: UpdateProductInput): Promise<Product | null>
}
