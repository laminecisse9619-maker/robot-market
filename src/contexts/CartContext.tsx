import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { robots } from '../data/robots'
import type { CartItem } from '../types'

interface CartContextValue {
  items: CartItem[]
  addItem: (robotId: string) => void
  removeItem: (robotId: string) => void
  setQuantity: (robotId: string, quantity: number) => void
  clear: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (robotId: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.robotId === robotId)
      if (existing) {
        return prev.map((i) => (i.robotId === robotId ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { robotId, quantity: 1 }]
    })
  }

  const removeItem = (robotId: string) => {
    setItems((prev) => prev.filter((i) => i.robotId !== robotId))
  }

  const setQuantity = (robotId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(robotId)
      return
    }
    setItems((prev) => prev.map((i) => (i.robotId === robotId ? { ...i, quantity } : i)))
  }

  const clear = () => setItems([])

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  const totalPrice = useMemo(() => {
    return items.reduce((sum, i) => {
      const robot = robots.find((r) => r.id === i.robotId)
      return sum + (robot ? robot.price * i.quantity : 0)
    }, 0)
  }, [items])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, setQuantity, clear, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
