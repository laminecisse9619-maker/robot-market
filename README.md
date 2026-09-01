# ROBOT MARKET — Prototype

Marketplace de robots construite en React + TypeScript + Vite + Tailwind CSS v4.

## Démarrer en local
```
npm install
npm run dev
```

## Déployer gratuitement (Vercel)
1. Pousser ce dossier sur un dépôt GitHub
2. Sur vercel.com → "Import Project" → sélectionner le dépôt
3. Vercel détecte Vite automatiquement (build: `npm run build`, output: `dist`)
4. Une fois déployé, ajouter le domaine obevia.com dans Project Settings → Domains

## Prochaine étape : Supabase
Les données (`src/data/robots.ts`, `sellers.ts`, `categories.ts`) sont actuellement mockées.
Les types dans `src/types/index.ts` sont déjà structurés pour correspondre à de futures tables Supabase :
`robots`, `sellers`, `categories`, `orders`.

## Pages incluses dans cette version
- Accueil (hero, catégories, produits vedettes)
- Liste des robots avec recherche, filtres et tri
- Page produit détaillée avec spécifications
- Panier avec quantités et résumé de commande
- Inscription vendeur en plusieurs étapes (simulée)
- Annuaire des vendeurs + page boutique publique par vendeur
- Dashboard vendeur (stats, produits, commandes, réglages boutique)
- Comparateur de robots (jusqu'à 4 robots, tableau de specs)
- Messagerie acheteur ↔ vendeur (simulée, réponses automatiques)

## Ce qui reste à connecter à une vraie base de données
- Authentification réelle (actuellement simulée)
- Paiement réel (Stripe Connect recommandé, aucune clé API dans ce prototype)
- Persistance des commandes, messages et avis (actuellement en mémoire, perdus au rechargement)
