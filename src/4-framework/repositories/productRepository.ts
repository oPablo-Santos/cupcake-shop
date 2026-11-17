import type { Product } from '@domain/product'
import type {
  CreateProductInput,
  IProductRepository,
  UpdateProductInput,
} from '@business/iProductRepository'
import { prisma } from '@framework/db/prisma'

function mapProduct(row: {
  id: string
  name: string
  description: string
  priceCents: number
  imageUrl: string
  available: boolean
}): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    priceCents: row.priceCents,
    imageUrl: row.imageUrl,
    available: row.available,
  }
}

export class ProductRepository implements IProductRepository {
  async findAvailable() {
    const rows = await prisma.product.findMany({
      where: { available: true },
      orderBy: { name: 'asc' },
    })
    return rows.map(mapProduct)
  }

  async findAll() {
    const rows = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    return rows.map(mapProduct)
  }

  async findById(id: string) {
    const row = await prisma.product.findUnique({ where: { id } })
    return row ? mapProduct(row) : null
  }

  async create(input: CreateProductInput) {
    const row = await prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        priceCents: input.priceCents,
        imageUrl: input.imageUrl,
        available: input.available ?? true,
      },
    })
    return mapProduct(row)
  }

  async update(id: string, input: UpdateProductInput) {
    try {
      const row = await prisma.product.update({
        where: { id },
        data: input,
      })
      return mapProduct(row)
    } catch {
      return null
    }
  }
}
