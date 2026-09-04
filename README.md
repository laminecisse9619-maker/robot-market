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

## Connecter Stripe (paiement réel)

1. Crée un compte sur **stripe.com** (le mode Test est gratuit et illimité, aucune vraie carte n'est débitée)
2. Dans **Developers → API keys**, copie la clé **Secret key** (commence par `sk_test_...` en mode test)
3. Sur Vercel : **Project Settings → Environment Variables** → ajoute `STRIPE_SECRET_KEY` avec cette valeur (⚠️ jamais dans le code ni dans `.env` versionné — cette clé reste côté serveur uniquement)
4. Redéploie le projet

Une fois connecté :
- Le bouton "Pay now" à l'étape 3 du checkout redirige vers une vraie page de paiement Stripe
- Carte de test à utiliser en mode Test : `4242 4242 4242 4242`, n'importe quelle date future, n'importe quel CVC
- Après paiement, Stripe redirige vers `/checkout/success` qui vérifie le paiement et vide le panier
- Sans `STRIPE_SECRET_KEY` configurée, le bouton affichera une erreur claire au lieu de simuler un faux paiement

Pour aller plus loin : passer en mode Live (vraies cartes) une fois prêt à recevoir de vrais paiements, et ajouter un webhook Stripe pour enregistrer chaque commande dans Supabase automatiquement.

## Architecture technique du paiement
Ce projet utilise les **Vercel Functions** (dossier `/api`) pour exécuter du code serveur sans avoir besoin d'un hébergeur séparé — c'est inclus gratuitement dans ton déploiement Vercel actuel :
- `api/create-checkout-session.ts` — crée la session de paiement Stripe (prix vérifiés côté serveur, jamais fait confiance au navigateur)
- `api/verify-checkout-session.ts` — vérifie qu'un paiement a bien été effectué avant de vider le panier
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
- Panier + parcours de paiement en 3 étapes (adresse, livraison, paiement réel via Stripe Checkout)

## Ce qui reste à connecter à une vraie base de données
- Table `robots` réelle pour que les vendeurs ajoutent leurs propres produits
- Table `orders` réelle (webhook Stripe → Supabase) pour un historique de commandes persistant
- Table `messages` réelle (actuellement en mémoire, perdue au rechargement)
- Vérification d'identité/documents vendeur avant publication
- Reversement automatique aux vendeurs (Stripe Connect) — pour l'instant Stripe encaisse sur ton compte uniquement
