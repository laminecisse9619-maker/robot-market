import type { Category } from '../types'

// Catalogue recentré sur 4 grandes familles de robots B2B réels (40 modèles,
// 10 par catégorie) — voir src/data/robots.ts pour le détail.
export const categories: Category[] = [
  { id: 'c1', name: 'Cobots industriels', slug: 'cobots', icon: 'Bot', productCount: 10 },
  { id: 'c2', name: 'AMR & robots logistiques', slug: 'amr', icon: 'Truck', productCount: 10 },
  { id: 'c3', name: 'Robots quadrupèdes', slug: 'quadrupeds', icon: 'PawPrint', productCount: 10 },
  { id: 'c4', name: 'Robots éducatifs', slug: 'educational', icon: 'GraduationCap', productCount: 10 },
]
