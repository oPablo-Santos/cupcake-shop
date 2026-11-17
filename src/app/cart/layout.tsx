import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carrinho | Cupcake Shop',
  description: 'Revise os cupcakes escolhidos e siga para o checkout.',
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
