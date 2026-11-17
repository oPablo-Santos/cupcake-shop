import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const img = (id: string) => `https://images.unsplash.com/${id}?w=480&h=480&fit=crop&auto=format`

async function main() {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()

  const products = [
    {
      name: 'Brigadeiro de Panela Gourmet',
      description:
        'Massa de chocolate 70% cacau, recheio cremoso de brigadeiro de panela e granulado belga na cobertura.',
      priceCents: 1450,
      imageUrl: img('photo-1578985545062-69928b1d9587'),
    },
    {
      name: 'Baunilha Bourbon com Frutas Vermelhas',
      description:
        'Massa de baunilha bourbon, buttercream leve e compota artesanal de morango e framboesa.',
      priceCents: 1350,
      imageUrl: img('photo-1576618148400-f54bed99fcfd'),
    },
    {
      name: 'Red Velvet com Cream Cheese',
      description:
        'Camadas aveludadas de red velvet, frosting de cream cheese equilibrado e toque de cacau.',
      priceCents: 1550,
      imageUrl: img('photo-1551024506-0bccd828d307'),
    },
    {
      name: 'Limão Siciliano com Merengue',
      description:
        'Massa cítrica com raspas de limão siciliano, curd azedinho e merengue italiano levemente tostado.',
      priceCents: 1300,
      imageUrl: img('photo-1586985289688-ca3cf47d3e6e'),
    },
    {
      name: 'Caramelo Salgado com Nozes Pecan',
      description:
        'Massa amanteigada, ganache de caramelo salgado e crocante de nozes pecan caramelizadas.',
      priceCents: 1600,
      imageUrl: img('photo-1607920591413-4ec007e70023'),
    },
    {
      name: 'Matcha Cerimonial com Gergelim',
      description:
        'Massa verde com matcha cerimonial japonês, cream cheese suave e gergelim negro tostado.',
      priceCents: 1500,
      imageUrl: img('photo-1599599810769-bcde5a160d32'),
    },
    {
      name: 'Churros com Doce de Leite',
      description:
        'Massa com canela, cobertura de açúcar e canela e recheio generoso de doce de leite argentino.',
      priceCents: 1400,
      imageUrl: img('photo-1499636136210-6f4ee915583e'),
    },
    {
      name: 'Pistache Siciliano',
      description:
        'Massa de amêndoas, buttercream de pistache DOP e pistaches triturados na finalização.',
      priceCents: 1750,
      imageUrl: img('photo-1486427944299-d1955d23e34d'),
    },
    {
      name: 'Coco Queimado com Maracujá',
      description:
        'Massa de coco tostado, mousse de maracujá azedinho e flocos de coco caramelizado.',
      priceCents: 1380,
      imageUrl: img('photo-1522335789203-aabd1fc54bc9'),
    },
    {
      name: 'Brownie Duplo com Nutella',
      description:
        'Base de brownie fudgy, camada de Nutella e pedaços de brownie crocante na cobertura.',
      priceCents: 1520,
      imageUrl: img('photo-1565958011703-44f9829ba187'),
    },
  ]

  await prisma.product.createMany({
    data: products.map((product) => ({
      ...product,
      available: true,
    })),
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error('Seed failed', error)
    await prisma.$disconnect()
    process.exit(1)
  })
