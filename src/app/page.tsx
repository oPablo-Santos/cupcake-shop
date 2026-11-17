import type { Metadata } from 'next'
import { getCatalogProducts } from '@/app/actions/shop'
import { ProductCard } from '@/app/components/ProductCard'

export const metadata: Metadata = {
  title: 'Cupcakes artesanais para encomenda | Cupcake Shop',
  description:
    'Compre cupcakes artesanais com sabores exclusivos, pagamento simulado e pedido online direto pela Cupcake Shop.',
  keywords: [
    'cupcakes artesanais',
    'loja de cupcakes',
    'doces gourmet',
    'cupcake para encomenda',
    'cupcake shop',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Cupcake Shop | Cupcakes artesanais para encomenda',
    description:
      'Conheça sabores exclusivos de cupcakes artesanais, monte seu pedido online e finalize em poucos passos.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const result = await getCatalogProducts()

  if (!result.success) {
    const message = result.errors.general[0] ?? 'Não foi possível carregar o catálogo.'
    return (
      <div className="space-y-6">
        <header className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">Doces artesanais</p>
          <h1 className="text-3xl font-semibold tracking-tight">Catálogo</h1>
        </header>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/40">
          <p className="font-medium text-red-800 dark:text-red-300">{message}</p>
          <p className="mt-2 text-sm text-red-700/90 dark:text-red-300/90">
            Localmente: suba o PostgreSQL, rode{' '}
            <code className="rounded bg-red-100 px-1 dark:bg-red-950">npm run db:migrate:deploy</code> e{' '}
            <code className="rounded bg-red-100 px-1 dark:bg-red-950">npm run db:seed</code>, depois recarregue a página.
          </p>
        </div>
      </div>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Cupcake Shop',
    description:
      'Loja de cupcakes artesanais com sabores premium, catálogo online e pedido digital.',
    makesOffer: result.data.map((product, index) => ({
      '@type': 'Offer',
      position: index + 1,
      itemOffered: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.imageUrl,
      },
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
    })),
  }

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wider text-[var(--accent)]">Doces artesanais</p>
        <h1 className="text-3xl font-semibold tracking-tight">Catálogo</h1>
        <p className="max-w-xl text-[var(--muted-foreground)]">
          Massas fofinhas, coberturas generosas e combinações pensadas para surpreender — escolha seus favoritos.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {result.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {result.data.length === 0 && (
        <p className="text-center text-[var(--muted-foreground)]">Nenhum produto disponível no momento.</p>
      )}
    </div>
  )
}
