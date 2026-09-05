// Sources d'images réelles pour le catalogue.
//
// IMPORTANT — lire avant de modifier ce fichier :
// Les URLs ci-dessous ont été vérifiées une à une (elles pointent vers de vraies
// photos, gratuites et libres de droit pour un usage commercial : licence Unsplash,
// ou fichiers Wikimedia Commons sous licence CC). Ce sont volontairement des visuels
// *génériques* par catégorie (un cobot, un AMR, un quadrupède, un bras éducatif) et
// non une photo officielle de chaque modèle précis — Universal Robots, FANUC, Unitree
// etc. n'autorisent pas la réutilisation libre de leurs visuels produit sans accord.
//
// Le vrai visuel "propre et officiel" de chaque robot doit venir soit :
//  1. du kit presse public du fabricant (liens listés en commentaire sous chaque
//     robot dans `robots.ts`) — à coller dans `images: []` une fois récupéré, ou
//  2. de la fonctionnalité "Revendiquer ce profil" : une fois la fiche validée,
//     le vrai fabricant peut uploader ses propres photos officielles.
//
// Tant qu'aucune image spécifique n'est fournie pour un robot, `robotImages()`
// retombe sur le visuel générique de sa catégorie ci-dessous.

export const CATEGORY_STOCK_IMAGES: Record<string, string[]> = {
  cobots: [
    'https://images.unsplash.com/photo-1716191299980-a6e8827ba10b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1606206873764-fd15e242df52?auto=format&fit=crop&w=1200&q=80',
  ],
  amr: [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1606206873764-fd15e242df52?auto=format&fit=crop&w=1200&q=80',
  ],
  quadrupeds: [
    'https://commons.wikimedia.org/wiki/Special:FilePath/SpotMini,_Boston_Dynamics,_Robot.jpg?width=1200',
    'https://commons.wikimedia.org/wiki/Special:FilePath/China_go2.JPG?width=1200',
  ],
  educational: [
    'https://images.unsplash.com/photo-1606206873764-fd15e242df52?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1716191299980-a6e8827ba10b?auto=format&fit=crop&w=1200&q=80',
  ],
}

/**
 * Retourne les images à afficher pour un robot : ses propres images si elles
 * sont définies (ex. après une revendication de fiche avec upload officiel),
 * sinon le visuel générique de sa catégorie.
 */
export function robotImages(categorySlug: string, ownImages: string[] = []): string[] {
  if (ownImages.length > 0) return ownImages
  return CATEGORY_STOCK_IMAGES[categorySlug] ?? CATEGORY_STOCK_IMAGES.cobots
}
