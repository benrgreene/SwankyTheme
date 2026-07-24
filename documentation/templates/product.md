# Product template

Covers the product-related custom data (metafields) and the sections available on the
product template.

- Template file: `src/templates/product.json`
- Alternate view: `src/templates/product.json-view.liquid`

## Metafield definitions

These are the metafields the theme actually reads. Definition names, validations and
descriptions are **not retrieved from store** — the types below are inferred from how the
theme consumes each value, so confirm them in Settings → Custom data → Products before
relying on them.

### Product metafields

| Identifier | Inferred type | Purpose |
|---|---|---|
| `custom.product_reviews` | Number (decimal) | The product's average star rating, 0–5. Drives the star display and the "X out of Y reviews" line, and is emitted as `ratingValue` in product structured data. |
| `custom.review_count` | Number (integer) | How many reviews the product has. Shown next to the rating and emitted as `reviewCount` in structured data. |
| `custom.product_deets` | Rich text | The long-form product description shown in the left column of the **Product Details** section. |
| `custom.product_info` | List (text or rich text) | The accordion rows in the **Product Details** section, stored as a **flat alternating list**: entry 0 is the first row's title, entry 1 is its body, entry 2 is the second row's title, and so on. See the caveat below. |
| `custom.related_variants` | List of product references | Overrides the **Product Recommendations** section on this product's page. When set, these products are shown instead of the collection chosen in the section settings. |

### Variant metafields

| Identifier | Inferred type | Purpose |
|---|---|---|
| `global.variant_images` | List of file/image references | Extra images belonging to a specific variant. Used to swap the gallery when a variant is selected, and to pick the thumbnail for a cart line item. Note the legacy `global` namespace rather than `custom`. |

### How `custom.product_info` is read

`src/sections/products/product-details.liquid` walks the list two entries at a time —
even indexes become the `<summary>` heading and odd indexes become the panel body:

```liquid
{%- assign summary_title   = index | times: 2 -%}
{%- assign summary_content = index | times: 2 | plus: 1 -%}
```

Two consequences for whoever populates this field:

- **Order matters absolutely.** Title and body must alternate, starting with a title.
- **A trailing odd entry is dropped.** The loop rounds the list length down to an even
  number, so an unpaired final entry never renders.

### Where each product metafield is used

| Identifier | Files |
|---|---|
| `custom.product_reviews` | `src/snippets/components/products/product-review-avg.liquid`, `src/snippets/components/products/product-buybox.liquid` (gates whether the rating shows at all), `src/snippets/json/product-json.liquid` (`reviewScore`), `src/snippets/structured-data/structured-data-product.liquid` |
| `custom.review_count` | `src/snippets/components/products/product-review-avg.liquid`, `src/snippets/json/product-json.liquid` (`reviewTotal`), `src/snippets/structured-data/structured-data-product.liquid` |
| `custom.product_deets` | `src/sections/products/product-details.liquid` |
| `custom.product_info` | `src/sections/products/product-details.liquid` |
| `custom.related_variants` | `src/sections/page-sections/product-recs.liquid` |
| `global.variant_images` | `src/snippets/json/variant-json.liquid`, `src/snippets/json/product-json.liquid`, `src/snippets/json/cart-json.liquid` |

## Template sections

`src/templates/product.json` ships with a single section:

| Order | Section instance | Type |
|---|---|---|
| 1 | `product-buybox` | `product-buybox` |

Everything else is added by merchants in the theme editor. Sections whose schema allows
the `product` template are listed below.

### Product-only sections

Sections restricted to `"templates": ["product"]`.

#### Product Buybox — `product-buybox`

`src/sections/products/product-buybox.liquid`. The main purchase area — it renders the
breadcrumbs, `product-gallery` and `product-buybox` snippets in a two-column grid bound to
the Alpine `productInfo` store.

It also emits a `<style>` block generating one `.swatch-<name>` rule per Color Swatch block,
using the block's image if set and its colour otherwise.

| Setting | Type | Default | Controls |
|---|---|---|---|
| `bottom_margin_mobile` | range 0–200, step 2 | 40 | Space below the section on mobile |
| `bottom_margin_desktop` | range 0–200, step 2 | 70 | Space below the section on desktop |
| `product_threshold` | number | 10 | Intended: inventory level at or below which the low-stock message appears. **Unused.** |
| `low_stock_msg` | text | "This product is running out!" | Intended: the low-stock message text. **Unused.** |
| `breadcrumbs_in_buybox` | select — Yes / No | Yes | Intended: whether breadcrumbs render inside the buybox. **Unused.** |

The last three settings appear in the theme editor but have no consumer — `product_threshold`,
`low_stock_msg` and `breadcrumbs_in_buybox` occur only in this section's `{% schema %}` and
are not read by any Liquid file. Breadcrumbs currently render unconditionally, above the
buybox, via `{% render 'product-breadcrumbs' %}`, and no low-stock message is output.

**Blocks — `color-swatch` ("Color Swatch")**, one per colour you want to render as a swatch
rather than a plain option button:

| Setting | Type | Controls |
|---|---|---|
| `swatch_name` | text | The option value this swatch maps to — must match the product option value exactly |
| `swatch_color` | color | Flat colour fill for the swatch |
| `swatch_image` | image_picker | Image fill for the swatch, for patterns or textures |

#### Product Details — `product-details`

`src/sections/products/product-details.liquid`. Two-column detail block: long description
on the left from `custom.product_deets`, an accordion on the right from
`custom.product_info`. Both columns come **entirely from metafields** — the section itself
has no content settings beyond the heading, so it renders empty if the metafields are unset.

| Setting | Type | Default | Controls |
|---|---|---|---|
| `bottom_margin_mobile` | range 0–200, step 2 | 40 | Space below the section on mobile |
| `bottom_margin_desktop` | range 0–200, step 2 | 70 | Space below the section on desktop |
| `title` | text | "Product Details" | Heading above the left column |

#### Product Reviews — `product-reviews`

`src/sections/products/product-reviews.liquid`. Renders a `<product-reviews>` element once
`productInfo.productReviews.bottomline` is populated. Review data is fetched client-side
from Yotpo by `src/scripts/components/YotpoData.js`, so the section exposes only spacing.

**This section renders nothing at present.** The `<product-reviews>` custom element is never
registered — `src/scripts/web-components/index.js` defines only `cart-item`, `filter-list`
and `product-tile` — so the element stays empty. A fuller reviews UI (list, ratings
breakdown, Q&A, write-a-review) exists in `src/apps/yotpo-reviews/`, but that code is not
part of the build; see [Front-end runtime](../README.md#front-end-runtime).

| Setting | Type | Default | Controls |
|---|---|---|---|
| `bottom_margin_mobile` | range 0–200, step 2 | 40 | Space below the section on mobile |
| `bottom_margin_desktop` | range 0–200, step 2 | 70 | Space below the section on desktop |

### Shared sections available on product

These are documented in full on the page where they are most at home; the product template
is one of several they allow.

| Section | Type | Documented in |
|---|---|---|
| Hero | `hero` | [Page template](page.md#hero--hero) |
| 50/50 | `fiftyfifty` | [Page template](page.md#5050--fiftyfifty) |
| Product Recommendations | `product-recs` | [Page template](page.md#product-recommendations--product-recs) |
| Quiz | `quiz-section` | [Page template](page.md#quiz--quiz-section) |
| Shop By Collections | `shop-by-collections` | [Page template](page.md#shop-by-collections--shop-by-collections) |
| Social Media | `social-media` | [Page template](page.md#social-media--social-media) |
| Spacer | `spacer` | [Page template](page.md#spacer--spacer) |
| Cart Upsells | `cart-upsells` | [Other templates](other-templates.md#cart-upsells--cart-upsells) |

**Product Recommendations behaves differently here.** On a product page it checks
`product.metafields.custom.related_variants` first and falls back to the section's
collection setting only when that metafield is empty.

## Alternate view — `product.json-view.liquid`

`src/templates/product.json-view.liquid` is a JSON endpoint, not a rendered page. Request
any product URL with `?view=json-view` and it returns the product serialized by
`src/snippets/json/product-json.liquid` — id, title, price, options, variants (including
`global.variant_images`), and the review metafields. This lets client-side code fetch
product data without a Storefront API call.

Two things to know when working on it:

- The helper `fetchJSONTemplate` in `src/scripts/utils/Fetch.js` requests
  `/${type}/${handle}?view=json` — suffix `json`, not `json-view`. No `product.json.liquid`
  template exists, so that URL would fall through to the normal product template rather
  than returning JSON. Nothing currently imports `Fetch.js`, so this is latent rather than
  broken today — but fix the suffix before using the helper.
- The file opens with `{% layout: none %}`. The supported Liquid syntax for suppressing the
  layout is `{% layout none %}`, without the colon.
