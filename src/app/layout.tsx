import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/app/components/CartProvider'
import { SiteHeader } from '@/app/components/SiteHeader'
import { ThemeProvider } from '@/app/components/ThemeProvider'
import { DEFAULT_OG_IMAGE, siteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: {
    default: 'Cupcake Shop',
    template: '%s | Cupcake Shop',
  },
  description: 'Loja de cupcakes artesanais — catálogo online, carrinho e pedido digital.',
  metadataBase: new URL(siteUrl()),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Cupcake Shop',
    title: 'Cupcake Shop',
    description: 'Cupcakes artesanais para encomenda, com sabores exclusivos e pedido online.',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Cupcakes artesanais — Cupcake Shop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cupcake Shop',
    description: 'Cupcakes artesanais para encomenda.',
    images: [DEFAULT_OG_IMAGE],
  },
}

const themeInitScript = `(function(){try{var t=localStorage.getItem('cupcake-shop-theme');document.documentElement.classList.toggle('dark',t==='dark');}catch(e){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <CartProvider>
            <SiteHeader />
            <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
