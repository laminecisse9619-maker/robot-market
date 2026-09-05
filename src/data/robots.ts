import type { Robot } from '../types'
import { robotImages } from './images'

// Catalogue réel : 40 robots, 10 par catégorie (cobots, AMR, quadrupèdes, éducatifs).
// Spécifications basées sur les fiches techniques publiques des constructeurs
// (voir le lien "source" en commentaire au-dessus de chaque robot). Quand un prix
// catalogue public n'existe pas (cas fréquent en robotique industrielle, vendue
// via intégrateurs), `priceOnRequest: true` est utilisé et `price` vaut 0 —
// la fiche pousse alors vers "Demander un devis" plutôt que "Ajouter au panier".
//
// Les images utilisent des visuels génériques par catégorie (voir data/images.ts) :
// chaque robot n'a pas encore sa propre photo officielle tant que sa fiche n'a
// pas été revendiquée par le vrai fabricant.

const base = (overrides: Partial<Robot> & Pick<Robot, 'id' | 'slug' | 'name' | 'brand' | 'model' | 'categorySlug' | 'sellerId' | 'country' | 'description' | 'specifications'>): Robot => ({
  price: 0,
  priceOnRequest: true,
  currency: 'USD',
  condition: 'new',
  images: robotImages(overrides.categorySlug, overrides.images),
  rating: 4.6,
  reviewCount: 0,
  stock: 0,
  features: [],
  shippingCountries: ['Worldwide'],
  warrantyMonths: 12,
  createdAt: '2026-01-01',
  ...overrides,
})

export const robots: Robot[] = [
  // ───────────────────────── COBOTS (10) ─────────────────────────
  base({
    id: 'ur5e', slug: 'universal-robots-ur5e', name: 'Universal Robots UR5e', brand: 'Universal Robots', model: 'UR5e',
    categorySlug: 'cobots', sellerId: 's-ur', country: 'Denmark',
    description: "Le cobot le plus vendu au monde. Format compact, parfait équilibre entre charge utile et portée pour l'assemblage, le contrôle qualité et le pick & place.",
    features: ['Programmation PolyScope tactile', 'Certifié ISO/TS 15066', '17 fonctions de sécurité configurables', 'Compatible UR+ (accessoires plug & play)'],
    specifications: [
      { label: 'Charge utile', value: '5 kg' }, { label: 'Portée', value: '850 mm' },
      { label: 'Poids', value: '18,4 kg' }, { label: 'Indice de protection', value: 'IP54' },
      { label: 'Répétabilité', value: '± 0,03 mm' }, { label: 'Axes', value: '6' },
      { label: 'Prix', value: 'Sur devis (distributeur agréé)' }, { label: 'Source', value: 'universal-robots.com' },
    ],
    warrantyMonths: 24,
  }),
  base({
    id: 'ur10e', slug: 'universal-robots-ur10e', name: 'Universal Robots UR10e', brand: 'Universal Robots', model: 'UR10e',
    categorySlug: 'cobots', sellerId: 's-ur', country: 'Denmark',
    description: "Le cobot polyvalent de référence pour la palettisation, l'emballage et le machine-tending, avec une portée étendue à 1300 mm.",
    features: ['Grande portée pour cellules multi-postes', 'Force-torque intégré au poignet', 'Compatible palettisation lourde'],
    specifications: [
      { label: 'Charge utile', value: '12,5 kg' }, { label: 'Portée', value: '1300 mm' },
      { label: 'Indice de protection', value: 'IP54' }, { label: 'Répétabilité', value: '± 0,05 mm' },
      { label: 'Axes', value: '6' }, { label: 'Prix indicatif', value: '≈ 45 000 $ (configuration type)' },
      { label: 'Source', value: 'universal-robots.com' },
    ],
    price: 45000, priceOnRequest: false, warrantyMonths: 24,
  }),
  base({
    id: 'ur16e', slug: 'universal-robots-ur16e', name: 'Universal Robots UR16e', brand: 'Universal Robots', model: 'UR16e',
    categorySlug: 'cobots', sellerId: 's-ur', country: 'Denmark',
    description: "Le cobot le plus puissant de la e-Series classique : charge utile élevée pour le machine-tending de pièces lourdes et le vissage à haut couple.",
    features: ['Charge utile élevée dans un format compact', 'Idéal manutention de pièces lourdes'],
    specifications: [
      { label: 'Charge utile', value: '16 kg' }, { label: 'Portée', value: '900 mm' },
      { label: 'Axes', value: '6' }, { label: 'Prix', value: 'Sur devis' },
      { label: 'Source', value: 'universal-robots.com' },
    ],
    warrantyMonths: 24,
  }),
  base({
    id: 'ur20', slug: 'universal-robots-ur20', name: 'Universal Robots UR20', brand: 'Universal Robots', model: 'UR20',
    categorySlug: 'cobots', sellerId: 's-ur', country: 'Denmark',
    description: "Nouvelle génération de cobot lourd, conçu pour la palettisation, le meulage et le vissage à haut couple avec un encombrement compact (Ø245 mm).",
    features: ['Nouvelle architecture de joints', 'Vitesse de cycle accrue vs UR10e', 'Capteur de force-torque intégré'],
    specifications: [
      { label: 'Charge utile', value: '20 kg' }, { label: 'Portée', value: '1750 mm' },
      { label: 'Axes', value: '6' }, { label: 'Prix', value: 'Sur devis' },
      { label: 'Source', value: 'universal-robots.com' },
    ],
    warrantyMonths: 24,
  }),
  base({
    id: 'fanuc-crx-10ia', slug: 'fanuc-crx-10ia', name: 'FANUC CRX-10iA', brand: 'FANUC', model: 'CRX-10iA',
    categorySlug: 'cobots', sellerId: 's-fanuc', country: 'Japan',
    description: "Cobot phare de FANUC pour les entreprises débutant en robotique : programmation par glisser-déposer sur tablette tactile, zéro maintenance pendant 8 ans.",
    features: ['Programmation tablette drag & drop', '8 ans zéro maintenance', 'Détection de contact sensible'],
    specifications: [
      { label: 'Charge utile', value: '10 kg' }, { label: 'Portée', value: '1249 mm' },
      { label: 'Poids', value: '40 kg' }, { label: 'Indice de protection', value: 'IP67' },
      { label: 'Répétabilité', value: '± 0,04 mm' }, { label: 'Contrôleur', value: 'R-30iB Mini Plus' },
      { label: 'Prix indicatif', value: '≈ 30 000 $' }, { label: 'Source', value: 'crx.fanucamerica.com' },
    ],
    price: 30000, priceOnRequest: false, warrantyMonths: 12,
  }),
  base({
    id: 'fanuc-crx-10ia-l', slug: 'fanuc-crx-10ia-l', name: 'FANUC CRX-10iA/L', brand: 'FANUC', model: 'CRX-10iA/L',
    categorySlug: 'cobots', sellerId: 's-fanuc', country: 'Japan',
    description: "Version longue portée du CRX-10iA, avec mouvement de retournement unique ('underflip') pour opérer dans des espaces confinés.",
    features: ['Portée étendue', 'Mouvement underflip', 'Version peinture/dispense disponible'],
    specifications: [
      { label: 'Charge utile', value: '10 kg' }, { label: 'Portée', value: '1418 mm' },
      { label: 'Indice de protection', value: 'IP67' }, { label: 'Prix indicatif', value: '≈ 37 000 $' },
      { label: 'Source', value: 'crx.fanucamerica.com' },
    ],
    price: 37000, priceOnRequest: false,
  }),
  base({
    id: 'abb-gofa-12', slug: 'abb-gofa-crb-15000-12', name: 'ABB GoFa 12', brand: 'ABB Robotics', model: 'CRB 15000-12',
    categorySlug: 'cobots', sellerId: 's-abb', country: 'Switzerland',
    description: "Cobot ABB haute charge utile pour le machine-tending et la manutention de pièces jusqu'à 12 kg, avec bras étendu.",
    features: ['Grande charge utile pour un cobot', 'Sécurité par détection de puissance et de force'],
    specifications: [
      { label: 'Charge utile', value: '12 kg' }, { label: 'Portée', value: '1400 mm' },
      { label: 'Indice de protection', value: 'IP67' }, { label: 'Prix', value: 'Sur devis' },
      { label: 'Source', value: 'new.abb.com' },
    ],
  }),
  base({
    id: 'kuka-lbr-iisy3', slug: 'kuka-lbr-iisy-3', name: 'KUKA LBR iisy3', brand: 'KUKA', model: 'LBR iisy3 R760',
    categorySlug: 'cobots', sellerId: 's-kuka', country: 'Germany',
    description: "Cobot allemand pensé pour une mise en service ultra-rapide (moins d'une heure), sans intégrateur, pour PME.",
    features: ['Mise en service < 1h sans intégrateur', 'Interface tactile intuitive smartPAD'],
    specifications: [
      { label: 'Charge utile', value: '3 kg' }, { label: 'Portée', value: '760 mm' },
      { label: 'Poids', value: '≈ 29,5 kg' }, { label: 'Indice de protection', value: 'IP20' },
      { label: 'Prix', value: 'Sur devis' }, { label: 'Source', value: 'kuka.com' },
    ],
  }),
  base({
    id: 'doosan-m0609', slug: 'doosan-m0609', name: 'Doosan M0609', brand: 'Doosan Robotics', model: 'M0609',
    categorySlug: 'cobots', sellerId: 's-doosan', country: 'South Korea',
    description: "Cobot coréen de la série M, conçu pour l'assemblage de précision et le contrôle qualité en ligne de production.",
    features: ['12 capteurs de couple sur chaque axe', 'Programmation par apprentissage manuel'],
    specifications: [
      { label: 'Charge utile', value: '6 kg' }, { label: 'Portée', value: '900 mm' },
      { label: 'Poids', value: '≈ 33 kg' }, { label: 'Indice de protection', value: 'IP54' },
      { label: 'Prix', value: 'Sur devis' }, { label: 'Source', value: 'doosanrobotics.com' },
    ],
  }),
  base({
    id: 'techman-tm12', slug: 'techman-tm12', name: 'Techman TM12', brand: 'Techman Robot', model: 'TM12',
    categorySlug: 'cobots', sellerId: 's-techman', country: 'Taiwan',
    description: "Cobot avec système de vision 2D/3D intégré en natif, simplifiant les applications de pick & place et d'inspection.",
    features: ['Caméra de vision intégrée en natif', 'Logiciel TMflow sans code'],
    specifications: [
      { label: 'Charge utile', value: '12 kg' }, { label: 'Portée', value: '1300 mm' },
      { label: 'Indice de protection', value: 'IP54' }, { label: 'Prix', value: 'Sur devis' },
      { label: 'Source', value: 'tm-robot.com' },
    ],
  }),

  // ───────────────────────── AMR (10) ─────────────────────────
  base({
    id: 'mir100', slug: 'mir100', name: 'MiR100', brand: 'Mobile Industrial Robots', model: 'MiR100',
    categorySlug: 'amr', sellerId: 's-mir', country: 'Denmark',
    description: "AMR d'entrée de gamme pour le transport de bacs et petites pièces, déploiement rapide sans marquage au sol.",
    features: ['Navigation SLAM sans infrastructure', 'Intégration convoyeurs et racks'],
    specifications: [
      { label: 'Charge utile', value: '100 kg' }, { label: 'Vitesse max.', value: '1,5 m/s' },
      { label: 'Poids', value: '67 kg' }, { label: 'Dimensions', value: '890 × 580 × 352 mm' },
      { label: 'Prix', value: 'Sur devis' }, { label: 'Source', value: 'mobile-industrial-robots.com' },
    ],
  }),
  base({
    id: 'mir200', slug: 'mir200', name: 'MiR200', brand: 'Mobile Industrial Robots', model: 'MiR200',
    categorySlug: 'amr', sellerId: 's-mir', country: 'Denmark',
    description: "L'AMR le plus déployé au monde chez MiR : transport de charges moyennes en usine, logistique et milieu hospitalier.",
    features: ['Le plus déployé de la gamme MiR', 'Compatible modules top (convoyeur, étagères)'],
    specifications: [
      { label: 'Charge utile', value: '200 kg' }, { label: 'Vitesse max.', value: '1,5 m/s' },
      { label: 'Poids', value: '76 kg' }, { label: 'Dimensions', value: '890 × 580 × 352 mm' },
      { label: 'Prix', value: 'Sur devis' }, { label: 'Source', value: 'mobile-industrial-robots.com' },
    ],
  }),
  base({
    id: 'mir250', slug: 'mir250', name: 'MiR250', brand: 'Mobile Industrial Robots', model: 'MiR250',
    categorySlug: 'amr', sellerId: 's-mir', country: 'Denmark',
    description: "AMR nouvelle génération, plus rapide et compact que le MiR200, certifié IP52 pour les environnements poussiéreux ou humides.",
    features: ['Le plus rapide et compact de la gamme MiR', 'Certifié IP52', 'Module Hook pour tracter des chariots jusqu\u2019à 500 kg'],
    specifications: [
      { label: 'Charge utile', value: '250 kg' }, { label: 'Vitesse max.', value: '2,0 m/s' },
      { label: 'Poids', value: '78 kg' }, { label: 'Indice de protection', value: 'IP52' },
      { label: 'Dimensions', value: '800 × 580 × 300 mm' }, { label: 'Prix', value: 'Sur devis' },
      { label: 'Source', value: 'mobile-industrial-robots.com' },
    ],
  }),
  base({
    id: 'mir500', slug: 'mir500', name: 'MiR500', brand: 'Mobile Industrial Robots', model: 'MiR500',
    categorySlug: 'amr', sellerId: 's-mir', country: 'Denmark',
    description: "AMR robuste pour le transport de palettes et charges lourdes, avec chariot élévateur MiR500 Pallet Lift en option.",
    features: ['Transport de palettes en option', 'Format compact pour sa capacité'],
    specifications: [
      { label: 'Charge utile', value: '500 kg' }, { label: 'Dimensions', value: '1350 × 920 mm (base)' },
      { label: 'Prix', value: 'Sur devis' }, { label: 'Source', value: 'mobile-industrial-robots.com' },
    ],
  }),
  base({
    id: 'mir600', slug: 'mir600', name: 'MiR600', brand: 'Mobile Industrial Robots', model: 'MiR600',
    categorySlug: 'amr', sellerId: 's-mir', country: 'Denmark',
    description: "AMR polyvalent certifié IP52, souvent associé à un bras collaboratif UR20/UR30 dans la solution combinée MC600.",
    features: ['Certifié IP52 (environnements agroalimentaires)', 'Base pour combiné mobile manipulator MC600'],
    specifications: [
      { label: 'Charge utile', value: '600 kg' }, { label: 'Indice de protection', value: 'IP52' },
      { label: 'Prix', value: 'Sur devis' }, { label: 'Source', value: 'mobile-industrial-robots.com' },
    ],
  }),
  base({
    id: 'mir1000', slug: 'mir1000', name: 'MiR1000', brand: 'Mobile Industrial Robots', model: 'MiR1000',
    categorySlug: 'amr', sellerId: 's-mir', country: 'Denmark',
    description: "AMR le plus puissant de la gamme historique MiR pour le transport de palettes lourdes sans infrastructure de sécurité externe.",
    features: ['Transport de palettes 1000 kg', 'Aucune infrastructure de sécurité externe requise'],
    specifications: [
      { label: 'Charge utile', value: '1000 kg' }, { label: 'Prix', value: 'Sur devis' },
      { label: 'Source', value: 'mobile-industrial-robots.com' },
    ],
  }),
  base({
    id: 'mir1350', slug: 'mir1350', name: 'MiR1350', brand: 'Mobile Industrial Robots', model: 'MiR1350',
    categorySlug: 'amr', sellerId: 's-mir', country: 'Denmark',
    description: "L'AMR le plus puissant jamais produit par MiR : conforme aux plus hauts standards robotiques du marché pour la logistique lourde.",
    features: ['Le plus puissant AMR de la gamme MiR', 'Conformité aux standards robotiques les plus exigeants'],
    specifications: [
      { label: 'Charge utile', value: '1350 kg' }, { label: 'Prix', value: 'Sur devis' },
      { label: 'Source', value: 'mobile-industrial-robots.com' },
    ],
  }),
  base({
    id: 'omron-ld60', slug: 'omron-ld-60', name: 'OMRON LD-60', brand: 'OMRON Robotics', model: 'LD-60',
    categorySlug: 'amr', sellerId: 's-omron', country: 'Japan',
    description: "AMR compact pour les postes de travail légers et les espaces restreints, avec version ESD pour l'électronique.",
    features: ['Format compact, vitesse de déplacement rapide', 'Version ESD disponible (composants sensibles)'],
    specifications: [
      { label: 'Charge utile', value: '60 kg' }, { label: 'Sécurité', value: '2 scanners laser de sécurité 360°' },
      { label: 'Prix', value: 'Sur devis' }, { label: 'Source', value: 'robotics.omron.com' },
    ],
  }),
  base({
    id: 'omron-ld90', slug: 'omron-ld-90', name: 'OMRON LD-90', brand: 'OMRON Robotics', model: 'LD-90',
    categorySlug: 'amr', sellerId: 's-omron', country: 'Japan',
    description: "Version à plus forte capacité du LD-60, avec accroche automatique et compatibilité modules de transport personnalisés.",
    features: ['Accroche automatique en station de charge', 'Modules de transport personnalisables'],
    specifications: [
      { label: 'Charge utile', value: '90 kg' }, { label: 'Prix', value: 'Sur devis' },
      { label: 'Source', value: 'robotics.omron.com' },
    ],
  }),
  base({
    id: 'omron-ld250', slug: 'omron-ld-250', name: 'OMRON LD-250', brand: 'OMRON Robotics', model: 'LD-250',
    categorySlug: 'amr', sellerId: 's-omron', country: 'Japan',
    description: "AMR haute capacité de la gamme LD, pour le transport de charges plus lourdes en environnement logistique dense.",
    features: ['Navigation dans allées étroites', 'Intégration AS/RS et convoyeurs'],
    specifications: [
      { label: 'Charge utile', value: '250 kg' }, { label: 'Prix', value: 'Sur devis' },
      { label: 'Source', value: 'robotics.omron.com' },
    ],
  }),

  // ───────────────────────── QUADRUPÈDES (10) ─────────────────────────
  base({
    id: 'unitree-go2-air', slug: 'unitree-go2-air', name: 'Unitree Go2 Air', brand: 'Unitree Robotics', model: 'Go2 Air',
    categorySlug: 'quadrupeds', sellerId: 's-unitree', country: 'China',
    description: "Version d'entrée de gamme du Go2, idéale pour la découverte de la robotique quadrupède et les usages ludiques.",
    features: ['LiDAR 4D omnidirectionnel', 'Suivi automatique ("side-follow")', 'App smartphone de contrôle'],
    specifications: [
      { label: 'Poids', value: '≈ 15 kg' }, { label: 'Vitesse max.', value: '≈ 3,7 m/s' },
      { label: 'Prix', value: '≈ 1 600 $' }, { label: 'Source', value: 'unitree.com' },
    ],
    price: 1600, priceOnRequest: false, currency: 'USD', warrantyMonths: 12,
  }),
  base({
    id: 'unitree-go2-pro', slug: 'unitree-go2-pro', name: 'Unitree Go2 Pro', brand: 'Unitree Robotics', model: 'Go2 Pro',
    categorySlug: 'quadrupeds', sellerId: 's-unitree', country: 'China',
    description: "Version intermédiaire avec autonomie et capacités accrues : escaliers, terrains accidentés, figures acrobatiques.",
    features: ['Franchissement d\u2019escaliers et terrains accidentés', 'Figures acrobatiques (saut, danse)'],
    specifications: [
      { label: 'Poids', value: '≈ 15 kg' }, { label: 'Prix', value: '≈ 2 800 $' },
      { label: 'Source', value: 'unitree.com' },
    ],
    price: 2800, priceOnRequest: false,
  }),
  base({
    id: 'unitree-go2-edu', slug: 'unitree-go2-edu', name: 'Unitree Go2 EDU', brand: 'Unitree Robotics', model: 'Go2 EDU',
    categorySlug: 'quadrupeds', sellerId: 's-unitree', country: 'China',
    description: "Version recherche/développement du Go2 : accès SDK complet, ROS2, calculateur Jetson Orin embarqué, charge utile augmentée.",
    features: ['SDK complet + ROS2', 'Calculateur NVIDIA Jetson Orin embarqué', 'Batterie 15 000 mAh (2 à 4h)'],
    specifications: [
      { label: 'Charge utile', value: 'jusqu\u2019à 12 kg' }, { label: 'Poids', value: '≈ 15 kg' },
      { label: 'Prix', value: '≈ 3 790 $' }, { label: 'Source', value: 'unitree.com' },
    ],
    price: 3790, priceOnRequest: false,
  }),
  base({
    id: 'unitree-b2', slug: 'unitree-b2', name: 'Unitree B2', brand: 'Unitree Robotics', model: 'B2',
    categorySlug: 'quadrupeds', sellerId: 's-unitree', country: 'China',
    description: "Quadrupède industriel de Unitree : charge utile et vitesse largement supérieures au Go2, IP67 pour l'inspection extérieure.",
    features: ['Le plus rapide de sa catégorie (jusqu\u2019à 6 m/s)', 'Compute embarqué Jetson Orin', 'SDK complet ROS2'],
    specifications: [
      { label: 'Charge utile', value: '40 kg' }, { label: 'Poids', value: '60 kg' },
      { label: 'Indice de protection', value: 'IP67' }, { label: 'Autonomie', value: '4-5 h' },
      { label: 'Vitesse max.', value: '6 m/s' }, { label: 'Prix indicatif', value: '≈ 25 000 – 30 000 $' },
      { label: 'Source', value: 'unitree.com' },
    ],
    price: 27500, priceOnRequest: false,
  }),
  base({
    id: 'boston-dynamics-spot', slug: 'boston-dynamics-spot', name: 'Boston Dynamics Spot', brand: 'Boston Dynamics', model: 'Spot',
    categorySlug: 'quadrupeds', sellerId: 's-bdyn', country: 'United States',
    description: "Référence mondiale de l'inspection robotisée en entreprise : plus de 1500 unités déployées, écosystème logiciel Orbit très mature.",
    features: ['5 paires de caméras stéréo (détection 360°)', 'Batterie interchangeable (charge en <60s)', 'Logiciel de flotte Orbit + Autowalk'],
    specifications: [
      { label: 'Charge utile', value: '14 kg' }, { label: 'Poids', value: '≈ 33 kg' },
      { label: 'Indice de protection', value: 'IP54' }, { label: 'Autonomie', value: '≈ 90 min (batterie interchangeable)' },
      { label: 'Vitesse max.', value: '1,6 m/s' }, { label: 'Prix', value: 'Sur devis (configurations à partir de ≈ 75 000 $)' },
      { label: 'Source', value: 'bostondynamics.com' },
    ],
  }),
  base({
    id: 'boston-dynamics-spot-arm', slug: 'boston-dynamics-spot-arm', name: 'Boston Dynamics Spot + Arm', brand: 'Boston Dynamics', model: 'Spot with Arm',
    categorySlug: 'quadrupeds', sellerId: 's-bdyn', country: 'United States',
    description: "Spot équipé du bras manipulateur 6 axes en option : seul quadrupède de série capable d'ouvrir des portes et de manipuler des vannes.",
    features: ['Bras manipulateur 6 axes en option', 'Seul quadrupède de série avec manipulation intégrée'],
    specifications: [
      { label: 'Charge utile (bras)', value: '≈ 11 kg' }, { label: 'Indice de protection', value: 'IP54' },
      { label: 'Prix', value: 'Sur devis' }, { label: 'Source', value: 'bostondynamics.com' },
    ],
  }),
  base({
    id: 'anybotics-anymal-d', slug: 'anybotics-anymal-d', name: 'ANYbotics ANYmal D', brand: 'ANYbotics', model: 'ANYmal D',
    categorySlug: 'quadrupeds', sellerId: 's-anybotics', country: 'Switzerland',
    description: "Quadrupède suisse (spin-off ETH Zurich) dédié à l'inspection autonome de sites industriels (gaz, thermique, acoustique).",
    features: ['LiDAR 360° + 6 caméras de profondeur', 'Retour autonome au poste de charge', 'Charge utile d\u2019inspection modulaire (+10 kg)'],
    specifications: [
      { label: 'Charge utile additionnelle', value: '10 kg' }, { label: 'Prix', value: 'Sur devis' },
      { label: 'Source', value: 'anybotics.com' },
    ],
  }),
  base({
    id: 'deep-robotics-x20', slug: 'deep-robotics-x20', name: 'Deep Robotics X20', brand: 'Deep Robotics', model: 'X20',
    categorySlug: 'quadrupeds', sellerId: 's-deeprobotics', country: 'China',
    description: "Quadrupède robuste conçu pour les patrouilles de sous-stations électriques, l'inspection de pipelines et les interventions d'urgence.",
    features: ['Conçu pour patrouilles de sous-stations électriques', 'Résistant aux conditions extérieures difficiles'],
    specifications: [
      { label: 'Indice de protection', value: 'IP66' }, { label: 'Prix', value: 'Sur devis' },
      { label: 'Source', value: 'deeprobotics.us' },
    ],
  }),
  base({
    id: 'ghost-robotics-vision60', slug: 'ghost-robotics-vision-60', name: 'Ghost Robotics Vision 60', brand: 'Ghost Robotics', model: 'Vision 60',
    categorySlug: 'quadrupeds', sellerId: 's-ghost', country: 'United States',
    description: "Q-UGV tout-terrain modulaire (jambes, batteries, capteurs interchangeables), utilisé pour la sécurité, la défense et l'inspection.",
    features: ['Modules interchangeables (jambes, batteries, capteurs)', 'Navigation en \u201cmode aveugle\u201d (boue, pluie, neige)', 'SDK Ghost OS + ROS/ROS2'],
    specifications: [
      { label: 'Charge utile', value: '10-14 kg' }, { label: 'Autonomie', value: 'jusqu\u2019à 3h15 en mouvement continu' },
      { label: 'Prix indicatif', value: '≈ 150 000 $' }, { label: 'Source', value: 'ghostrobotics.io' },
    ],
    price: 150000, priceOnRequest: false,
  }),
  base({
    id: 'xiaomi-cyberdog2', slug: 'xiaomi-cyberdog-2', name: 'Xiaomi CyberDog 2', brand: 'Xiaomi Robotics', model: 'CyberDog 2',
    categorySlug: 'quadrupeds', sellerId: 's-xiaomi', country: 'China',
    description: "Quadrupède grand public ultra-compact de Xiaomi, orienté recherche et développement à bas coût.",
    features: ['Format compact et léger', 'Plateforme ouverte pour développeurs'],
    specifications: [
      { label: 'Poids', value: '≈ 8,9 kg' }, { label: 'Prix indicatif', value: '≈ 1 540 $ (tarif international)' },
      { label: 'Source', value: 'mi.com' },
    ],
    price: 1540, priceOnRequest: false,
  }),

  // ───────────────────────── ÉDUCATIFS (10) ─────────────────────────
  base({
    id: 'niryo-ned2', slug: 'niryo-ned2', name: 'Niryo Ned2', brand: 'Niryo', model: 'Ned2',
    categorySlug: 'educational', sellerId: 's-niryo', country: 'France',
    description: "Bras collaboratif 6 axes open-source français, pensé pour l'enseignement secondaire, supérieur et la formation Industrie 4.0.",
    features: ['Open-source (ROS Noetic, Raspberry Pi 4)', 'Programmation Blockly, Python ou C++ via NiryoStudio', 'Calibration automatique'],
    specifications: [
      { label: 'Charge utile', value: '0,3 kg' }, { label: 'Portée', value: '440-490 mm' },
      { label: 'Répétabilité', value: '± 0,5 mm' }, { label: 'Axes', value: '6' },
      { label: 'Prix', value: 'Sur devis' }, { label: 'Source', value: 'niryo.com' },
    ],
  }),
  base({
    id: 'dobot-magician', slug: 'dobot-magician', name: 'Dobot Magician', brand: 'Dobot', model: 'Magician',
    categorySlug: 'educational', sellerId: 's-dobot', country: 'China',
    description: "Bras robotique compact multifonction (préhenseur, ventouse, stylo, laser) très utilisé dans l'enseignement STEM.",
    features: ['4 outils interchangeables inclus', 'Compatible Blockly, Python, ROS'],
    specifications: [
      { label: 'Charge utile', value: '0,5 kg' }, { label: 'Portée', value: '≈ 320 mm' },
      { label: 'Poids', value: '≈ 4,6 kg' }, { label: 'Prix indicatif', value: '≈ 1 400 $' },
      { label: 'Source', value: 'dobot-robots.com' },
    ],
    price: 1400, priceOnRequest: false,
  }),
  base({
    id: 'dobot-cr5', slug: 'dobot-cr5', name: 'Dobot CR5', brand: 'Dobot', model: 'CR5',
    categorySlug: 'educational', sellerId: 's-dobot', country: 'China',
    description: "Cobot compact pour la transition entre la formation et de premières applications industrielles légères.",
    features: ['Programmation par apprentissage manuel', 'Format compact pour paillasse de laboratoire'],
    specifications: [
      { label: 'Charge utile', value: '5 kg' }, { label: 'Portée', value: '900 mm' },
      { label: 'Prix', value: 'Sur devis' }, { label: 'Source', value: 'dobot-robots.com' },
    ],
  }),
  base({
    id: 'mycobot-280', slug: 'elephant-robotics-mycobot-280', name: 'Elephant Robotics myCobot 280', brand: 'Elephant Robotics', model: 'myCobot 280',
    categorySlug: 'educational', sellerId: 's-elephant', country: 'China',
    description: "Le plus compact des cobots 6 axes du marché, tient dans la main : très utilisé en recherche, prototypage et enseignement.",
    features: ['Format ultra-compact (tient dans la main)', 'Compatible Raspberry Pi / Jetson Nano / M5Stack'],
    specifications: [
      { label: 'Charge utile', value: '0,25 kg' }, { label: 'Portée', value: '280 mm' },
      { label: 'Poids', value: '≈ 0,85 kg' }, { label: 'Prix indicatif', value: '≈ 1 000 $' },
      { label: 'Source', value: 'elephantrobotics.com' },
    ],
    price: 1000, priceOnRequest: false,
  }),
  base({
    id: 'ufactory-xarm6', slug: 'ufactory-xarm-6', name: 'UFACTORY xArm 6', brand: 'UFACTORY', model: 'xArm 6',
    categorySlug: 'educational', sellerId: 's-ufactory', country: 'China',
    description: "Bras robotique polyvalent pour la recherche et les PME, bon compromis charge utile/portée à prix accessible.",
    features: ['SDK Python/ROS complet', 'Contrôleur de force en option'],
    specifications: [
      { label: 'Charge utile', value: '5 kg' }, { label: 'Portée', value: '700 mm' },
      { label: 'Poids', value: '≈ 12,5 kg' }, { label: 'Prix indicatif', value: '≈ 8 000 $' },
      { label: 'Source', value: 'ufactory.cc' },
    ],
    price: 8000, priceOnRequest: false,
  }),
  base({
    id: 'franka-panda', slug: 'franka-robotics-panda', name: 'Franka Robotics Panda', brand: 'Franka Robotics', model: 'Panda',
    categorySlug: 'educational', sellerId: 's-franka', country: 'Germany',
    description: "Référence dans les laboratoires de recherche en robotique et IA : 7 axes, capteurs de couple sur chaque articulation.",
    features: ['7 axes avec capteur de couple par articulation', 'Contrôle en impédance pour la manipulation fine', 'Très large communauté de recherche (ROS)'],
    specifications: [
      { label: 'Charge utile', value: '3 kg' }, { label: 'Portée', value: '855 mm' },
      { label: 'Poids', value: '≈ 18 kg' }, { label: 'Répétabilité', value: '± 0,1 mm' },
      { label: 'Prix', value: 'Sur devis' }, { label: 'Source', value: 'franka.de' },
    ],
  }),
  base({
    id: 'robotis-openmanipulator-x', slug: 'robotis-openmanipulator-x', name: 'ROBOTIS OpenManipulator-X', brand: 'ROBOTIS', model: 'OpenManipulator-X',
    categorySlug: 'educational', sellerId: 's-robotis', country: 'South Korea',
    description: "Bras open-source basé sur les servomoteurs Dynamixel, conçu pour l'enseignement de la robotique et l'intégration ROS/ROS2.",
    features: ['Open-source (matériel et logiciel)', 'Compatible ROS/ROS2 nativement', 'Servomoteurs Dynamixel'],
    specifications: [
      { label: 'Charge utile', value: '≈ 0,5 kg' }, { label: 'Portée', value: '≈ 380 mm' },
      { label: 'Prix indicatif', value: '≈ 1 300 $' }, { label: 'Source', value: 'robotis.com' },
    ],
    price: 1300, priceOnRequest: false,
  }),
  base({
    id: 'trossen-viperx-300', slug: 'trossen-interbotix-viperx-300', name: 'Trossen Interbotix ViperX 300', brand: 'Trossen Robotics', model: 'ViperX 300',
    categorySlug: 'educational', sellerId: 's-trossen', country: 'United States',
    description: "Bras robotique open-source utilisé dans de nombreux laboratoires universitaires pour la recherche en manipulation et en IA.",
    features: ['Open-source', 'Kits d\u2019intégration ROS/ROS2 prêts à l\u2019emploi'],
    specifications: [
      { label: 'Charge utile', value: '≈ 0,75 kg' }, { label: 'Prix', value: 'Sur devis' },
      { label: 'Source', value: 'trossenrobotics.com' },
    ],
  }),
  base({
    id: 'robotis-turtlebot3-burger', slug: 'robotis-turtlebot3-burger', name: 'ROBOTIS TurtleBot3 Burger', brand: 'ROBOTIS', model: 'TurtleBot3 Burger',
    categorySlug: 'educational', sellerId: 's-robotis', country: 'South Korea',
    description: "Robot mobile de référence pour l'apprentissage de ROS/ROS2 : SLAM, navigation autonome et suivi de trajectoire.",
    features: ['Plateforme officielle de référence ROS/ROS2', 'LiDAR 360° intégré', 'Open-source (matériel et logiciel)'],
    specifications: [
      { label: 'Poids', value: '≈ 1 kg' }, { label: 'Vitesse max.', value: '0,22 m/s' },
      { label: 'Prix indicatif', value: '≈ 550 $' }, { label: 'Source', value: 'robotis.com' },
    ],
    price: 550, priceOnRequest: false,
  }),
  base({
    id: 'makeblock-mbot2', slug: 'makeblock-mbot2', name: 'Makeblock mBot2', brand: 'Makeblock', model: 'mBot2',
    categorySlug: 'educational', sellerId: 's-makeblock', country: 'China',
    description: "Kit robotique STEM pour l'enseignement primaire et secondaire : programmation par blocs, IA embarquée simplifiée.",
    features: ['Programmation par blocs (mBlock)', 'Reconnaissance vocale et suivi de ligne', 'Conçu pour la salle de classe'],
    specifications: [
      { label: 'Public visé', value: 'Collège / Lycée' }, { label: 'Connectivité', value: 'Wi-Fi, Bluetooth' },
      { label: 'Prix indicatif', value: '≈ 130 $' }, { label: 'Source', value: 'makeblock.com' },
    ],
    price: 130, priceOnRequest: false,
  }),
]
