# Swanky Theme Documentation

Reference documentation for the custom data model (metafields, metaobjects) and the
section/block architecture of the Swanky Theme.

It is written for two audiences at once:

- **Merchants and content editors** who populate the data and configure sections in the
  theme editor — each page explains what a field or setting is *for*.
- **Developers** maintaining the theme — every page keeps the concrete identifiers
  (`namespace.key`, section `type`, file paths) needed to actually work with the data.

## Contents

| Page | Covers |
|------|--------|
| [Metaobjects](metaobjects.md) | The store's three metaobject definitions — none currently read by the theme |
| [Product template](templates/product.md) | Product metafields + product template sections |
| [Collection template](templates/collection.md) | Collection metafields + collection template sections |
| [Page template](templates/page.md) | Page metafields + page template sections |
| [Other templates](templates/other-templates.md) | Cart, blog, article, index, search and customer templates |
| [Global sections](global-sections.md) | Header, footer, inline cart and badge sections rendered on every page |
| [Theme blocks](blocks.md) | Blocks in `src/blocks/` |

## How this repo is laid out

This is a **build-step theme**, not a theme you edit in place. Authoring happens in `src/`,
and Gulp compiles a deployable theme into `dist/`:

```
src/
├── assets/      → dist/assets/     (flattened)
├── blocks/      → dist/blocks/     (flattened)
├── config/      → dist/config/     (flattened)
├── layout/      → dist/layout/     (flattened)
├── sections/    → dist/sections/   (flattened)
├── snippets/    → dist/snippets/   (flattened)
├── templates/   → dist/templates/  (NOT flattened — customer templates keep their subdirectory)
├── apps/        → React apps — NOT built or shipped, see below
├── scripts/     → JS entry points, bundled by webpack
└── styles/      → CSS, compiled by PostCSS/Tailwind
```

`gulp build` runs the copy plus the webpack bundle and deploys via Theme Kit; `gulp watch`
adds file watching and Browsersync. See `gulpfile.js` and `webpack.config.js`.

**The flattening matters when you read this documentation.** `src/sections/` and
`src/blocks/` use subdirectories purely for authoring convenience — Gulp strips them. A
section's `type` (the name you use in a JSON template or a `{% section %}` tag) is just its
**filename without the directory or extension**. So `src/sections/page-sections/quiz-section.liquid`
is referenced as `quiz-section`, not `page-sections/quiz-section`.

A consequence worth knowing: because everything is flattened into one directory, section
and snippet filenames must be unique across the whole of `src/`.

## Front-end runtime

Storefront interactivity is **Alpine.js plus custom elements**, not a framework app:

- **Alpine stores** hold shared state — `cartInfo`, `collectionInfo`, `productInfo`,
  `layoutInfo`, `badgeStore`. Sections opt in with `x-data="{ cart: $store.cartInfo }"` and
  render with `x-for` / `x-text` / `x-show`.
- **Web components** render repeated items. `src/scripts/web-components/index.js` defines
  `<cart-item>`, `<filter-list>` and `<product-tile>` from a generic factory that clones a
  `<template>` rendered by the matching snippet in `src/snippets/web-components/`.
- **Bundles.** Webpack builds one entry per file in `src/scripts/templates/` (`product`,
  `collection`, `cart`, `page`, `account`, `index`) plus `src/scripts/layouts/layout.js`,
  output as `<name>.build.js`.

### `src/apps/` is not in the build

`src/apps/` holds React implementations of the buybox, collection grid, inline cart,
product tile, email signup and Yotpo reviews. **None of it ships:**

- `react` and `react-dom` are not in `package.json` — not as dependencies or devDependencies.
- No file under `src/scripts/` imports from `src/apps/`, and webpack's only entry points are
  the `src/scripts/` files above. Nothing pulls the `.jsx` tree into a bundle.
- The mount points the apps look for — `#ProductBuybox`, `#CollectionGrid`, `#CartPage`,
  `#YotpoReviews`, `#EmailSignup` — do not exist in any Liquid file. (`#InlineCart` and
  `#MainContent` do, but the apps that target them are still unbundled.)

Treat `src/apps/` as a **previous implementation kept for reference**. Where these pages
cite it, they say so explicitly — it is useful as a spec for behaviour that the Liquid and
Alpine code has not reimplemented yet, but it is not what runs on the storefront.

One loose end in the live code: `src/sections/products/product-reviews.liquid` renders a
`<product-reviews>` element, but no `customElements.define('product-reviews', …)` exists —
only `cart-item`, `filter-list` and `product-tile` are registered.

## Where this data comes from

Two sources, both read directly:

- **The theme source in `src/`** — section settings, block settings, template bindings and
  metafield/metaobject **usage**.
- **The connected store** (`ben-greenes-test-store.myshopify.com`) via the Admin API —
  metafield and metaobject **definitions**: their display names, types, required flags and
  descriptions as configured in Settings → Custom data.

Definition names and types on these pages are therefore read from the store, not inferred.
The one exception is `site_fields.enable_filtering`, which the theme reads but the store
has no definition for — see
[Collection metafields](templates/collection.md#metafield-definitions).

Because both sides were read, these pages can also flag data that exists on **only** one
side — definitions no merchant edit will ever surface on the storefront, such as the
[unused metaobjects](metaobjects.md) and the
[product definitions the theme ignores](templates/product.md#defined-on-products-but-unused-by-the-theme).

### Refreshing the store side

The definitions were fetched with the Shopify CLI:

```bash
shopify store auth --store ben-greenes-test-store.myshopify.com --scopes read_metaobject_definitions,read_products,read_content
shopify store execute --store ben-greenes-test-store.myshopify.com --query '...'
```

This needs Shopify CLI 4.x (`store` commands don't exist in 3.x). Without an authenticated
session the sync falls back to theme-only data and marks definition details
**"not retrieved from store"** rather than guessing.
