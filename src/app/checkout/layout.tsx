import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Checkout | Cupcake Shop' },
  description: 'Finalize seu pedido com dados de entrega e pagamento simulado.',
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
