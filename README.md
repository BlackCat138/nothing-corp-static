# Nothing. Corp — Site statique

Conversion du projet [cr-ateur-de-r-ves-num-riques](https://github.com/BlackCat138/cr-ateur-de-r-ves-num-riques)
(React + TypeScript + TanStack Start + Tailwind, généré via Lovable) en un site
**100 % statique HTML / CSS / JavaScript**, sans build, sans dépendances, prêt à héberger
sur GitHub Pages, Netlify, ou n'importe quel hébergement statique.

## Structure

```
.
├── index.html          Accueil
├── sites-web.html       Page "Sites Web" (forfaits + configurateur de devis)
├── audiovisuel.html     Page "Audiovisuel" (services + CTA)
├── contact.html         Page "Contact" (formulaire)
├── 404.html             Page d'erreur 404
├── css/
│   └── style.css        Feuille de style unique (design tokens, composants, responsive)
├── js/
│   └── main.js           Menu mobile, configurateur de devis, validation du formulaire, toast
└── assets/
    └── favicon.ico
```

## Ce qui a été converti

- **Routing** TanStack Router → navigation classique par fichiers `.html` (liens relatifs).
- **Tailwind CSS** → classes utilitaires réécrites en CSS classique dans `style.css`,
  en conservant les tokens de couleurs d'origine (OKLCH + `color-mix`) et les animations
  (`float`, `entrance`).
- **Composants React** (`SiteHeader`, `SiteFooter`, `Logo`, `Blob`, `QuoteConfigurator`) →
  markup HTML dupliqué sur chaque page + logique JS équivalente dans `main.js`.
- **Icônes lucide-react** → SVG inline (aucune dépendance JS externe).
- **react-hook-form + zod** (formulaire de contact) → validation manuelle en JavaScript
  vanilla, avec les mêmes règles (nom ≥ 2 caractères, email valide, message ≥ 10 caractères).
- **sonner (toasts)** → petit composant toast fait main dans `main.js`.
- **Query string** (`?type=...&message=...` transmis vers `/contact`) → conservé via
  `URLSearchParams`, pour préremplir le formulaire depuis les autres pages.

## Utilisation

Aucune installation nécessaire : ouvrez `index.html` dans un navigateur, ou déployez
le dossier tel quel (GitHub Pages, Netlify, Vercel statique, etc.).

Pour un test local avec rechargement correct des chemins relatifs :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Limites connues

- Le formulaire de contact ne fait qu'une simulation locale (aucun backend/API) —
  identique au comportement du projet d'origine.
- Les visuels du portfolio audiovisuel restent des placeholders graphiques (dégradés),
  comme indiqué sur la page d'origine.
