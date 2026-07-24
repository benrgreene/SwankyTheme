# Collection template

Covers the collection-related custom data (metafields) and the sections available on the
collection template.

- Template file: `src/templates/collection.json`
- Alternate view: `src/templates/collection.data-view.liquid`

## Metafield definitions

**The store has no collection metafield definitions at all.** Querying
`metafieldDefinitions(ownerType: COLLECTION)` returns an empty list.

The theme nonetheless reads one collection metafield:

| Identifier | Inferred type | Purpose |
|---|---|---|
| `site_fields.enable_filtering` | Boolean | Whether the filter sidebar is shown on this collection. **Defaults to on** — the theme applies `| default: true`, so a collection with the metafield unset gets filters. Set it to `false` to hide filtering for a specific collection. |

Because there is no definition behind it, this field **cannot be edited in the Shopify
admin**. Collection metafields only appear on the collection edit page once a definition
exists; without one the value can only be set through the Admin API. The type above stays
inferred from how the theme consumes the value — there is no store definition to confirm
it against.

Note the `site_fields` namespace here, which differs from the `custom` namespace used for
product metafields.

**Used in:** `src/snippets/json/collection-json.liquid`, which emits it as `displayFilters`.
That snippet is rendered by `src/snippets/layout/dto.liquid`, so on any page with a
collection the value is published to `window.brg.collection.displayFilters`.

### It does not currently control anything

The only code reading `displayFilters` is
`src/apps/collection-grid/CollectionGrid.jsx`, which is not part of the build (see
[Front-end runtime](../README.md#front-end-runtime)). The Collection Grid section that
actually renders reads the **section setting** `display_filters` and nothing else, so
filtering is on or off for the whole template — this metafield can't currently override it
per collection.

Two switches, then, and only one of them works today:

| Control | Scope | Live? |
|---|---|---|
| `display_filters` section setting | The template as a whole | **Yes** — gates the filter sidebar in the section |
| `site_fields.enable_filtering` metafield | One collection | No — published to `window.brg`, but nothing in the build reads it |

## Template sections

`src/templates/collection.json` ships with a single section:

| Order | Section instance | Type |
|---|---|---|
| 1 | `collection-grid` | `collection-grid` |

### Collection Grid — `collection-grid`

`src/sections/collections/collection-grid.liquid`. The product grid plus filtering and
sorting, bound to the Alpine `collectionInfo` store. Products render as `<product-tile>`
web components and filters as `<filter-list>`; a "Load More" button calls
`window.performProductFetch`, which pulls the next page from the `collection.data-view`
endpoint below via `src/scripts/components/ProductGrid.js`.

Sorting is a fixed dropdown in the markup — Default, Best Selling (pre-selected), Price
high→low, Price low→high — not a setting.

Allowed on the `collection` and `search` templates.

| Setting | Type | Default | Controls |
|---|---|---|---|
| `bottom_margin_mobile` | range 0–200, step 2 | 40 | Space below the section on mobile |
| `bottom_margin_desktop` | range 0–200, step 2 | 70 | Space below the section on desktop |
| `display_filters` | checkbox | off | Whether the filter sidebar renders |

### Shared sections available on collection

| Section | Type | Documented in |
|---|---|---|
| Hero | `hero` | [Page template](page.md#hero--hero) |
| 50/50 | `fiftyfifty` | [Page template](page.md#5050--fiftyfifty) |
| Product Recommendations | `product-recs` | [Page template](page.md#product-recommendations--product-recs) |
| Quiz | `quiz-section` | [Page template](page.md#quiz--quiz-section) |
| Shop By Collections | `shop-by-collections` | [Page template](page.md#shop-by-collections--shop-by-collections) |
| Social Media | `social-media` | [Page template](page.md#social-media--social-media) |
| Cart Upsells | `cart-upsells` | [Other templates](other-templates.md#cart-upsells--cart-upsells) |

## Alternate view — `collection.data-view.liquid`

`src/templates/collection.data-view.liquid` is a JSON endpoint, not a rendered page.
Request a collection URL with `?view=data-view` and it returns:

- `title`, `handle`, `totalProductCount`
- `products` — **8 per page** (`{% paginate collection.products by 8 %}`), each serialized
  by `src/snippets/json/product-json.liquid`
- `filters` — the native Shopify filters (`collection.filters`) flattened into
  `displayType` / `filterOptionId` / `label` / `values`, with each value's `active` state

This is what powers paginated loading and filtering in the collection grid;
`src/scripts/components/ProductGrid.js` requests it at
`/collections/<handle>/?view=data-view&page=<n>`.

Three things to know when working on it:

- **`collection.data-view.liquid` is the only collection view template that exists.** Two
  other callers request a `json-view` on collections, which has no matching template file —
  `src/apps/collection-grid/utils/ProductFetch.js`
  (`/collections/<handle>/?view=json-view`) and `src/apps/inline-cart/utils/UpsellFetch.js`
  (`/collections/all?view=json-view`). Both live in the unbuilt `src/apps/` tree, so nothing
  breaks today, but the suffix would need fixing (or a `collection.json-view.liquid` adding)
  before that code could run.
- It does **not** emit `displayFilters`. There are two collection serializers: this template
  builds its payload inline, while `src/snippets/json/collection-json.liquid` is a separate
  one rendered into `window.brg.collection` by `dto.liquid`. They have drifted apart — this
  one paginates by 8 and omits `displayFilters`; the other includes `displayFilters` and
  loops all products with no pagination. If you add a field, check whether both need it.
- Like the other view templates it opens with `{% layout: none %}`; the supported syntax is
  `{% layout none %}`, without the colon.

## Third-party filtering (Boost PFS)

`src/snippets/boost/boost-pfs.liquid` and `boost-pfs-theme-config.liquid` hold an
integration for the Boost Product Filter & Search app, which reads **shop-level** metafields
owned by the app:

| Identifier | Purpose |
|---|---|
| `shop.metafields.bc-sf-filter.settings` | Boost's main settings blob |
| `shop.metafields.pfs-swatch-settings` | Swatch configuration for Boost filters |
| `shop.metafields.boostpfs-settings.default-sort-order` | Default sort order for filtered results |

These are managed by the app, not by this theme — don't edit them by hand.

**The integration is not currently active.** No layout, template or section renders
`boost-pfs` (only `boost-pfs.liquid` itself renders `boost-pfs-theme-config`), so these
snippets are inert and the shop metafields above go unread. Filtering on the storefront is
served by the theme's own Collection Grid using native Shopify filters. Enabling Boost would
mean rendering `boost-pfs` from the layout or the collection section.
