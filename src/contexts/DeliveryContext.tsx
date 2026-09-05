import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface DeliveryLocation {
  country: string
  countryCode: string
  flag: string
}

interface DeliveryContextValue {
  location: DeliveryLocation | null
  loading: boolean
}

const DeliveryContext = createContext<DeliveryContextValue>({ location: null, loading: true })

function countryCodeToFlag(code: string): string {
  if (!code || code.length !== 2) return '🌍'
  const codePoints = [...code.toUpperCase()].map((c) => 0x1f1e6 - 65 + c.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<DeliveryLocation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)

    fetch('https://ipwho.is/', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (data?.success && data.country && data.country_code) {
          setLocation({
            country: data.country,
            countryCode: data.country_code,
            flag: countryCodeToFlag(data.country_code),
          })
        }
      })
      .catch(() => {
        // Silent fallback — the header will just show "Worldwide" instead.
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
        clearTimeout(timeout)
      })

    return () => {
      cancelled = true
      controller.abort()
      clearTimeout(timeout)
    }
  }, [])

  return <DeliveryContext.Provider value={{ location, loading }}>{children}</DeliveryContext.Provider>
}

export function useDelivery() {
  return useContext(DeliveryContext)
}
