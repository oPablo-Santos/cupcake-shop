'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { calculateShippingCents } from '@domain/shipping'

export type CartItem = {
  productId: string
  name: string
  priceCents: number
  imageUrl: string
  quantity: number
}

type CartStorage = {
  items: CartItem[]
  shippingZip?: string
}

type CartContextValue = {
  items: CartItem[]
  shippingZip: string
  setShippingZip: (zip: string) => void
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
  subtotalCents: number
  shippingCents: number | null
  grandTotalCents: number | null
  itemCount: number
  bumpKey: number
}

const STORAGE_KEY = 'cupcake-shop-cart'

const CartContext = createContext<CartContextValue | null>(null)

function readStorage(): CartStorage {
  if (typeof window === 'undefined') return { items: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: [] }
    const parsed = JSON.parse(raw) as CartStorage | CartItem[]
    if (Array.isArray(parsed)) return { items: parsed }
    return { items: parsed.items ?? [], shippingZip: parsed.shippingZip }
  } catch {
    return { items: [] }
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [shippingZip, setShippingZipState] = useState('')
  const [bumpKey, setBumpKey] = useState(0)

  useEffect(() => {
    const stored = readStorage()
    setItems(stored.items)
    setShippingZipState(stored.shippingZip ?? '')
  }, [])

  useEffect(() => {
    const payload: CartStorage = { items, shippingZip: shippingZip || undefined }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [items, shippingZip])

  const setShippingZip = useCallback((zip: string) => {
    setShippingZipState(zip)
  }, [])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setBumpKey((k) => k + 1)
    setItems((prev) => {
      const existing = prev.find((p) => p.productId === item.productId)
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId ? { ...p, quantity: p.quantity + quantity } : p,
        )
      }
      return [...prev, { ...item, quantity }]
    })
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    let normalized = quantity
    if (!Number.isFinite(normalized) || normalized < 1) normalized = 1
    normalized = Math.min(99, Math.floor(normalized))
    setItems((prev) => prev.map((p) => (p.productId === productId ? { ...p, quantity: normalized } : p)))
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId))
  }, [])

  const clear = useCallback(() => {
    setItems([])
    setShippingZipState('')
  }, [])

  const subtotalCents = useMemo(
    () => items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0),
    [items],
  )

  const shippingCents = useMemo(() => {
    if (items.length === 0) return null
    return calculateShippingCents(shippingZip, subtotalCents)
  }, [items.length, shippingZip, subtotalCents])

  const grandTotalCents = useMemo(() => {
    if (shippingCents === null) return null
    return subtotalCents + shippingCents
  }, [subtotalCents, shippingCents])

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      shippingZip,
      setShippingZip,
      addItem,
      setQuantity,
      removeItem,
      clear,
      subtotalCents,
      shippingCents,
      grandTotalCents,
      itemCount,
      bumpKey,
    }),
    [
      items,
      shippingZip,
      setShippingZip,
      addItem,
      setQuantity,
      removeItem,
      clear,
      subtotalCents,
      shippingCents,
      grandTotalCents,
      itemCount,
      bumpKey,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
