// Core data models for ROBOT MARKET.
// These interfaces mirror the shape we expect from Supabase tables later:
// each one maps cleanly to a table (robots, sellers, categories, orders...).
// For now they're populated with mock data in /src/data.

export interface Specification {
  label: string
  value: string
}

export interface Seller {
  id: string
  name: string
  slug: string
  country: string
  countryCode: string
  logoInitial: string
  verified: boolean
  rating: number
  reviewCount: number
  salesCount: number
  joinedYear: number
  description: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  productCount: number
}

export interface Robot {
  id: string
  slug: string
  name: string
  brand: string
  model: string
  categorySlug: string
  price: number
  currency: 'USD' | 'EUR' | 'XOF' | 'CAD'
  condition: 'new' | 'used'
  images: string[]
  sellerId: string
  country: string
  rating: number
  reviewCount: number
  stock: number
  description: string
  features: string[]
  specifications: Specification[]
  shippingCountries: string[]
  warrantyMonths: number
  createdAt: string
}

export interface CartItem {
  robotId: string
  quantity: number
}

export interface SellerApplication {
  fullName: string
  businessName: string
  country: string
  email: string
  phone: string
  sellerType: 'individual' | 'manufacturer' | 'distributor' | 'business'
  storeName: string
  storeDescription: string
}

// Shape of a row in the Supabase `sellers` table (snake_case, matches SQL schema).
export interface SellerRecord {
  id: string
  user_id: string
  full_name: string
  business_name: string | null
  country: string
  email: string
  phone: string
  seller_type: 'individual' | 'manufacturer' | 'distributor' | 'business'
  store_name: string
  store_description: string | null
  created_at: string
}
