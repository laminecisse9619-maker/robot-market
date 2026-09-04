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

## Connecter Supabase (comptes + inscriptions vendeurs)

1. Crée un compte sur **supabase.com** et un nouveau projet (gratuit)
2. Dans le projet Supabase → **SQL Editor** → colle et exécute le contenu de `supabase/schema.sql`
   (crée la table `sellers` liée aux comptes utilisateurs, avec les bonnes politiques de sécurité)
3. Dans **Authentication → Providers**, vérifie que "Email" est activé (c'est le cas par défaut)
4. Dans **Settings → API**, copie l'URL du projet et la clé `anon public`
5. En local : copie `.env.example` vers `.env` et renseigne les deux valeurs
6. Sur Vercel : **Project Settings → Environment Variables** → ajoute
   `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`, puis redéploie

Tant que ces variables ne sont pas renseignées, le site fonctionne quand même :
les pages Login/Signup restent visibles mais désactivées, l'inscription vendeur
passe en "mode démo" (rien n'est sauvegardé), et le dashboard affiche des
données d'exemple. Dès que Supabase est connecté :
- **/signup** et **/login** créent de vrais comptes (email + mot de passe, avec
  email de confirmation envoyé automatiquement par Supabase)
- **/sell** et **/dashboard** exigent d'être connecté — sinon redirection vers /login
- **Sell a Robot** enregistre l'inscription dans la table `sellers`, liée au compte connecté
- **Seller Dashboard** charge uniquement la boutique du compte connecté (jamais celle d'un autre)
- L'onglet **Store Settings** du dashboard sauvegarde réellement les modifications

## Pages incluses dans cette version
- Accueil (hero, catégories, produits vedettes)
- Liste des robots avec recherche, filtres et tri
- Page produit détaillée avec spécifications
- Panier avec quantités et résumé de commande
- Inscription vendeur en plusieurs étapes (connectée à Supabase, liée au compte)
- Comptes utilisateurs (inscription + connexion via Supabase Auth, email/mot de passe)
- Annuaire des vendeurs + page boutique publique par vendeur
- Dashboard vendeur (protégé par connexion, données réelles liées au compte)
- Comparateur de robots (jusqu'à 4 robots, tableau de specs)
- Messagerie acheteur ↔ vendeur (simulée, réponses automatiques)
- Panier + parcours de paiement en 4 étapes (adresse, livraison, paiement simulé, confirmation)

## Ce qui reste à connecter à une vraie base de données
- Table `robots` réelle pour que les vendeurs ajoutent leurs propres produits
- Paiement réel (Stripe Connect recommandé — actuellement un formulaire de carte simulé, sans clé API)
- Table `orders` et `messages` réelles (actuellement en mémoire, perdues au rechargement)
- Vérification d'identité/documents vendeur avant publication
