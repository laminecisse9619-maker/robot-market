import { createContext, useContext, useState, type ReactNode } from 'react'

interface CompareContextValue {
  ids: string[]
  toggle: (robotId: string) => void
  clear: () => void
  isComparing: (robotId: string) => boolean
}

const CompareContext = createContext<CompareContextValue | null>(null)

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([])

  const toggle = (robotId: string) => {
    setIds((prev) => {
      if (prev.includes(robotId)) return prev.filter((id) => id !== robotId)
      if (prev.length >= 4) return prev
      return [...prev, robotId]
    })
  }

  const clear = () => setIds([])
  const isComparing = (robotId: string) => ids.includes(robotId)

  return (
    <CompareContext.Provider value={{ ids, toggle, clear, isComparing }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
