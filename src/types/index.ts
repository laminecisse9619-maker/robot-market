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
  /** true = fiche non revendiquée représentant un vrai fabricant (ex. Universal Robots).
   *  Tant que `claimed` est false, on ne connaît pas d'adresse de contact fiable
   *  pour ce fabricant : on ne lui envoie donc aucun e-mail en son nom. */
  isPlaceholder: boolean
  claimed: boolean
  /** Renseigné uniquement une fois la fiche revendiquée et validée par l'admin. */
  contactEmail?: string
  website?: string
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
  /** true = pas de prix catalogue public (cas fréquent en robotique industrielle) ;
   *  la fiche pousse alors directement vers "Demander un devis". `price` vaut 0. */
  priceOnRequest?: boolean
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

export interface QuoteRequestPayload {
  robotId: string
  buyerName: string
  buyerEmail: string
  buyerCompany?: string
  buyerPhone?: string
  message: string
  quantity?: number
}

export interface ClaimRequestPayload {
  robotId: string
  sellerId: string
  fullName: string
  jobTitle: string
  professionalEmail: string
  proof: string
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
