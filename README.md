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
- Header et page d'accueil traduits en 6 langues (Anglais, Français, Espagnol, Allemand, Arabe, Chinois), avec choix de langue mémorisé et sens de lecture RTL automatique pour l'arabe

## Connecter l'envoi d'e-mails (devis + revendication de fiche)

Le bouton **Demander un devis** (fiche produit) et le formulaire **Revendiquer ce profil**
(affiché sur les fiches non revendiquées) envoient désormais un vrai e-mail via
[Resend](https://resend.com), plus un enregistrement en base pour l'espace `/admin`.

1. Crée un compte sur **resend.com** (gratuit jusqu'à 3 000 e-mails/mois)
2. **Domains** → ajoute et vérifie ton domaine d'envoi (ex. `obovia.com`) via les
   enregistrements DNS demandés
3. **API Keys** → crée une clé, commençant par `re_...`
4. Sur Vercel : **Project Settings → Environment Variables**, ajoute :
   - `RESEND_API_KEY` = ta clé Resend
   - `QUOTES_FROM_EMAIL` = ex. `ROBOT MARKET <devis@obovia.com>` (doit utiliser le domaine vérifié)
   - `ADMIN_EMAIL` = l'adresse qui doit recevoir toutes les demandes
   - `SUPABASE_SERVICE_ROLE_KEY` = **Settings → API → service_role secret** dans Supabase
     (nécessaire pour que les fonctions `/api` puissent écrire dans les tables même avec RLS actif)
5. Exécute la mise à jour de `supabase/schema.sql` dans le SQL Editor (crée les tables
   `quote_requests` et `claim_requests`) — remplace `admin@obovia.com` par ta vraie adresse
   dans les policies RLS avant de l'exécuter
6. Redéploie

Une fois configuré :
- **Demander un devis** envoie un e-mail à `ADMIN_EMAIL` avec le nom du robot, les
  coordonnées de l'acheteur et un identifiant unique (`DEV-XXXXXXXX`), et enregistre la
  demande dans `quote_requests`
- Si un fabricant a **revendiqué et validé** sa fiche (`claimed: true` + `contactEmail`
  dans `src/data/sellers.ts`), il reçoit une copie de l'e-mail. **Aucun e-mail n'est
  envoyé à une adresse générique devinée pour un fabricant qui n'a pas rejoint la
  plateforme** — c'est précisément le rôle du bouton de revendication
- **Vous êtes le constructeur ? Revendiquez ce profil** envoie une notification à
  `ADMIN_EMAIL` et enregistre la demande dans `claim_requests`, visible sur `/admin`
  (nécessite d'être connecté avec le compte dont l'e-mail correspond à la policy RLS)
- Sans `RESEND_API_KEY`, les deux formulaires afficheront une erreur claire au lieu
  d'échouer silencieusement

## Catalogue (40 robots réels, 10 par catégorie)

`src/data/robots.ts` contient 40 robots réels (cobots, AMR, quadrupèdes, éducatifs)
avec leurs vraies spécifications techniques sourcées des fiches constructeur (charge
utile, portée, poids, IP, prix quand il est public). Les fabricants (`src/data/sellers.ts`)
sont marqués `isPlaceholder: true` tant qu'ils n'ont pas revendiqué leur fiche : c'est un
choix assumé — on ne prétend jamais représenter commercialement Universal Robots, FANUC,
Unitree etc. tant qu'ils n'ont pas confirmé leur identité via le formulaire de revendication.

Les visuels utilisent des photos génériques par catégorie (`src/data/images.ts`, sources
vérifiées : licence Unsplash + Wikimedia Commons) en attendant que chaque fabricant
revendique sa fiche et fournisse ses propres visuels officiels.

## Ce qui reste à connecter à une vraie base de données
- Table `robots` réelle pour que les vendeurs ajoutent leurs propres produits
- Table `orders` réelle (webhook Stripe → Supabase) pour un historique de commandes persistant
- Table `messages` réelle (actuellement en mémoire, perdue au rechargement)
- Vérification d'identité/documents vendeur avant publication
- Reversement automatique aux vendeurs (Stripe Connect) — pour l'instant Stripe encaisse sur ton compte uniquement
- Traduction complète des pages restantes (Robots, fiche produit, panier, dashboard...) — le système `src/i18n/translations.ts` + `useLanguage()` est prêt, il suffit d'y ajouter des clés page par page
