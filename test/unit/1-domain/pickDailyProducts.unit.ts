import { pickDailyProducts } from '@domain/pickDailyProducts'
import type { Product } from '@domain/product'

function product(id: string): Product {
  return {
    id,
    name: id,
    description: 'd',
    priceCents: 100,
    imageUrl: 'https://example.com/x.jpg',
    available: true,
  }
}

describe('pickDailyProducts', () => {
  it('retorna no máximo três produtos consecutivos na ordem estável por id', () => {
    const items = [product('c'), product('a'), product('b'), product('d')]
    const sortedIds = items.map((p) => p.id).sort()
    const picked = pickDailyProducts(items, new Date('2026-11-17T12:00:00.000Z'))
    const pickedIds = picked.map((p) => p.id)

    expect(picked).toHaveLength(3)
    const start = sortedIds.indexOf(pickedIds[0])
    for (let i = 0; i < 3; i++) {
      expect(pickedIds[i]).toBe(sortedIds[(start + i) % sortedIds.length])
    }
  })

  it('usa o dia em America/Sao_Paulo, não UTC', () => {
    const items = [product('a'), product('b'), product('c'), product('d')]
    const lateUtc = pickDailyProducts(items, new Date('2026-11-17T02:00:00.000Z')).map((p) => p.id)
    const priorSaoPauloDay = pickDailyProducts(items, new Date('2026-11-16T15:00:00.000Z')).map(
      (p) => p.id,
    )
    expect(lateUtc).toEqual(priorSaoPauloDay)
  })

  it('rotaciona o conjunto conforme a data', () => {
    const items = [product('a'), product('b'), product('c'), product('d'), product('e')]
    const day1 = pickDailyProducts(items, new Date('2026-11-17T12:00:00.000Z')).map((p) => p.id)
    const day2 = pickDailyProducts(items, new Date('2026-11-18T12:00:00.000Z')).map((p) => p.id)
    expect(day1).not.toEqual(day2)
    expect(new Set(day1).size).toBe(3)
  })

  it('retorna todos quando há três ou menos itens', () => {
    const items = [product('z'), product('a')]
    expect(pickDailyProducts(items)).toHaveLength(2)
  })
})