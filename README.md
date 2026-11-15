![CI](https://github.com/ibrah224/countries-explorer/actions/workflows/ci.yml/badge.svg)

# 🌍 Countries Explorer

Application web pour **découvrir n'importe quel pays du monde** : fiche d'identité, carte, classements mondiaux, histoire, religion et hymne national, au même endroit.

🔗 **Démo en ligne : [countries-explorer-snowy.vercel.app](countries-explorer-snowy.vercel.app)**

![Aperçu de l'application](docs/screenshot.png)

## Fonctionnalités

- **Liste des pays** avec recherche en direct (pays ou capitale) et filtre par région
- **Page détail** à cinq onglets :
  - **Général** : capitale, population, superficie, gouvernement, langues, monnaie, fuseaux horaires, pays voisins et carte interactive
  - **Classements** : rang mondial en population, PIB, PIB par habitant, espérance de vie, accès à internet et alphabétisation
  - **Histoire** : résumé de l'article Wikipédia, en français quand il existe
  - **Religion** : résumé de l'article Wikipédia, en français quand il existe
  - **Hymne** : lecteur audio de l'hymne national et présentation
- Navigation entre pays voisins en un clic

## Sources de données

| Besoin | Source |
|---|---|
| Fiche du pays | [REST Countries](https://restcountries.com) |
| Classements | [API de la Banque mondiale](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392) |
| Histoire, religion, texte de l'hymne | [Wikipédia](https://www.wikipedia.org) |
| Enregistrement de l'hymne | [Wikimedia Commons](https://commons.wikimedia.org) |
| Carte | [OpenStreetMap](https://www.openstreetmap.org) et [Leaflet](https://leafletjs.com) |

## Technologies

- **Angular** (composants autonomes, signals) et **TypeScript**
- **RxJS** pour les appels asynchrones
- **Leaflet** pour la carte
- **SCSS** pour le style
- **GitHub** pour le code, **Vercel** pour l'hébergement et le déploiement continu

## Architecture

```
src/app/
├── components/
│   └── country-map/        # carte Leaflet réutilisable
├── models/
│   └── country.ts          # types des données pays
├── pages/
│   ├── country-list/       # liste, recherche, filtre
│   └── country-detail/     # fiche à onglets
└── services/
    ├── countries.ts        # lecture des données pays
    ├── worldbank.ts        # calcul des classements
    ├── wikipedia.ts        # histoire, religion, hymne (texte)
    └── anthem.ts           # recherche de l'enregistrement audio
public/
└── countries.json          # données pays (générées par le script)
scripts/
└── fetch-countries.mjs     # télécharge les données depuis REST Countries
```

## Choix techniques

**Données pays dans un fichier local.** L'API REST Countries exige une clé secrète. L'utiliser directement dans l'application l'exposerait à tous les visiteurs. Un script télécharge donc les données une fois, avec la clé, dans `public/countries.json`. Avantages : la clé reste privée, le site est rapide et il ne dépend pas de la disponibilité de l'API.

**Classements calculés côté application.** La Banque mondiale fournit la valeur de chaque pays, pas le rang. L'application récupère la valeur de tous les pays, les trie, puis détermine la position du pays consulté. Les agrégats (Monde, Afrique, etc.) sont exclus en croisant avec la liste des vrais pays, et les données manquantes s'affichent « N/D ».

## Lancer le projet en local

Prérequis : [Node.js](https://nodejs.org) et Angular CLI.

```bash
git clone https://github.com/ibrah224/countries-explorer.git
cd countries-explorer
npm install
ng serve
```

Ouvrir [http://localhost:4200](http://localhost:4200).

## Mettre à jour les données

Créer un compte et une clé sur [restcountries.com](https://restcountries.com), puis, à la racine du projet.

PowerShell (Windows) :

```powershell
$env:RC_KEY="votre_cle"; node scripts/fetch-countries.mjs
```

Bash (macOS, Linux) :

```bash
RC_KEY="votre_cle" node scripts/fetch-countries.mjs
```

La clé n'est jamais écrite dans un fichier du projet.

## Déploiement

Chaque `git push` sur `main` déclenche un déploiement automatique sur Vercel. Le fichier `vercel.json` redirige toutes les routes vers `index.html`, ce qui permet de recharger une page comme `/country/GIN` sans erreur 404.

## Limites connues

- Les données pays correspondent à la date du dernier téléchargement, pas au temps réel.
- Tous les pays n'ont pas un enregistrement d'hymne libre de droits sur Wikimedia Commons.
- Les classements dépendent des données disponibles à la Banque mondiale (certains pays ou certaines années manquent).
- Histoire et religion affichent l'introduction de l'article Wikipédia, avec un lien vers l'article complet.

## Crédits et licences

Données © REST Countries, Banque mondiale (CC BY 4.0), contributeurs de Wikipédia et Wikimedia Commons (licences libres, voir chaque fichier), © contributeurs OpenStreetMap.

## Auteur

**Barry Thierno Ibrahima** : étudiant en génie informatique.