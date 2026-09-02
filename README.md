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

## Connecter Supabase (inscriptions vendeurs)

1. Crée un compte sur **supabase.com** et un nouveau projet (gratuit)
2. Dans le projet Supabase → **SQL Editor** → colle et exécute le contenu de `supabase/schema.sql`
   (crée la table `sellers` avec les bonnes politiques de sécurité)
3. Dans **Settings → API**, copie l'URL du projet et la clé `anon public`
4. En local : copie `.env.example` vers `.env` et renseigne les deux valeurs
5. Sur Vercel : **Project Settings → Environment Variables** → ajoute
   `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`, puis redéploie

Tant que ces variables ne sont pas renseignées, le site fonctionne quand même :
l'inscription vendeur passe en "mode démo" (rien n'est sauvegardé) et le dashboard
affiche des données d'exemple. Dès que Supabase est connecté :
- **Sell a Robot** enregistre chaque inscription dans la table `sellers`
- **Seller Dashboard** charge la boutique la plus récemment créée depuis Supabase
  (en l'absence d'authentification, c'est temporaire — à remplacer par un filtre
  sur l'utilisateur connecté une fois l'auth ajoutée)
- L'onglet **Store Settings** du dashboard sauvegarde réellement les modifications

## Pages incluses dans cette version
- Accueil (hero, catégories, produits vedettes)
- Liste des robots avec recherche, filtres et tri
- Page produit détaillée avec spécifications
- Panier avec quantités et résumé de commande
- Inscription vendeur en plusieurs étapes (connectée à Supabase)
- Annuaire des vendeurs + page boutique publique par vendeur
- Dashboard vendeur (stats, produits, commandes, réglages boutique connectés à Supabase)
- Comparateur de robots (jusqu'à 4 robots, tableau de specs)
- Messagerie acheteur ↔ vendeur (simulée, réponses automatiques)

## Ce qui reste à connecter à une vraie base de données
- Authentification réelle (Supabase Auth recommandé — actuellement aucun login)
- Table `robots` réelle pour que les vendeurs ajoutent leurs propres produits
- Paiement réel (Stripe Connect recommandé, aucune clé API dans ce prototype)
- Table `orders` et `messages` réelles (actuellement en mémoire, perdues au rechargement)
