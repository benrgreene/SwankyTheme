# Other templates

Templates outside product, collection and page, and the sections bound to them.

## Cart — `cart.json`

| Order | Section instance | Type |
|---|---|---|
| 1 | `cart-page` | `cart-page` |

### Cart Page — `cart-page`

`src/sections/cart/cart-page.liquid`. The full cart page — line items as `<cart-item>` web
components, plus a summary panel showing original price, discount and subtotal, and a
checkout link. It reads the same Alpine `cartInfo` store as the [inline cart
drawer](../global-sections.md#inline-cart--inline-cart), so the two stay in sync.

The "Cart" heading and the "* Shipping and taxes will be calculated at checkout" note are
hardcoded in the template, not settings.

Allowed on: `cart`.

| Setting | Type | Default | Controls |
|---|---|---|---|
| `bottom_margin_mobile` | range 0–200, step 2 | 40 | Space below the section on mobile |
| `bottom_margin_desktop` | range 0–200, step 2 | 70 | Space below the section on desktop |

Cart *copy* — title, free-shipping threshold, disclaimer, empty-cart button — is not set
here. It lives on the [Inline Cart
section](../global-sections.md#inline-cart--inline-cart) and is shared by both surfaces.
Read the caveat on that page first: apart from the disclaimer text, those settings have no
consumer in the shipped code, so changing them affects neither the drawer nor this page.

### Cart Upsells — `cart-upsells`

`src/sections/cart/cart-upsells.liquid`. Rule-based product upsells: each block pairs a
**trigger** product with the product to offer when the trigger is in the cart. Driven by
`src/scripts/components/CartUpsells.js`.

Allowed on: `cart`, `search`, `product`, `collection`.

| Setting | Type | Default | Controls |
|---|---|---|---|
| `bottom_margin_mobile` | range 0–200, step 2 | 40 | Space below the section on mobile |
| `bottom_margin_desktop` | range 0–200, step 2 | 70 | Space below the section on desktop |
| `title` | text | "Recommended For You" | Heading |

**Blocks — `upsell` ("Upsell")**, one per rule:

| Setting | Type | Controls |
|---|---|---|
| `requirement` | product | The product that must be in the cart for this rule to fire |
| `upsell` | product | The product offered when it does |

### Alternate view — `cart.json-view.liquid`

`/cart?view=json-view` returns the cart serialized by `src/snippets/json/cart-json.liquid`,
including each line item's variant image from `global.variant_images`. This is how the cart
refreshes after an add, update or remove — `src/scripts/utils/Cart.js` fetches it and pushes
the result into the Alpine `cartInfo` store.

## Blog — `blog.liquid`

| Order | Section instance | Type |
|---|---|---|
| 1 | `article-list` | `article-list` |

### Article List — `article-list`

`src/sections/blog/article-list.liquid`. The blog index listing. Blocks restrict the
listing to specific tags.

Allowed on: `blog`. Maximum 2 blocks.

| Setting | Type | Default | Controls |
|---|---|---|---|
| `bottom_margin_mobile` | range 0–200, step 2 | 40 | Space below the section on mobile |
| `bottom_margin_desktop` | range 0–200, step 2 | 70 | Space below the section on desktop |

**Blocks — `tag` ("Tag")**, up to 2:

| Setting | Type | Controls |
|---|---|---|
| `tag` | text | Article tag to filter the listing by; must match the tag on the article exactly |

The Hero section also allows the `blog` template.

## Article — `article.liquid`

| Order | Section instance | Type |
|---|---|---|
| 1 | `article` | `article` |

### Article — `article`

`src/sections/blog/article.liquid`. A single blog post — title, meta, body, and the article
structured data from `src/snippets/structured-data/structured-data-article.liquid`.

Allowed on: `article`.

| Setting | Type | Default | Controls |
|---|---|---|---|
| `bottom_margin_mobile` | range 0–200, step 2 | 40 | Space below the section on mobile |
| `bottom_margin_desktop` | range 0–200, step 2 | 70 | Space below the section on desktop |

### File extension caveat for blog and article

`src/templates/blog.liquid` and `src/templates/article.liquid` contain **JSON section
bodies** but carry a `.liquid` extension:

```json
{
  "sections": { "article": { "type": "article" } },
  "order": ["article"]
}
```

Shopify only parses a template as a JSON template when the file is named `.json`. As
`.liquid`, that JSON is treated as Liquid markup and printed as literal text. Renaming them
to `blog.json` and `article.json` is what makes the section bindings above take effect.
They are documented here as the *intended* bindings.

## Home page — `index.liquid`

`src/templates/index.liquid` is a single line:

```liquid
{{ content_for_index }}
```

`content_for_index` is the pre-Online-Store-2.0 mechanism, where the home page's section
list is stored in `config/settings_data.json` rather than a JSON template. Sections
allowing `index` — Hero, 50/50, Product Recommendations, Quiz, Shop By Collections, Social
Media — are all documented on the [page template](page.md#shared-content-sections) page.

Moving the home page to an `index.json` template would bring it in line with the cart,
collection, page and product templates.

## Search — `search.liquid`

`src/templates/search.liquid` is **empty**. Search results are handled by the Collection
Grid section (which allows `search`) and the smart-search overlay in
`src/snippets/components/header/smart-search.liquid`, driven by
`src/scripts/components/Search.js`. Cart Upsells also allows `search`.

## Customer account templates

These live in `src/templates/customers/` — the one directory Gulp deliberately does **not**
flatten, because Shopify requires customer templates to stay in `customers/`.

| Template | Contents |
|---|---|
| `login.liquid` | `{% section 'login-form' %}` plus the forgot-password snippet |
| `register.liquid` | `{% section 'register-form' %}` |
| `account.liquid` | Account dashboard — greeting, default address with inline editing, order history. No sections. |
| `addresses.liquid` | Redirects to `/account/` via JS; address editing happens on the dashboard |
| `order.liquid` | Redirects to `/account/` via JS |
| `activate_account.liquid` | Empty |
| `reset_password.liquid` | Empty |

### Login Form — `login-form`

`src/sections/accounts/login-form.liquid`. No `templates` restriction; rendered by
`customers/login.liquid`.

| Setting | Type | Controls |
|---|---|---|
| `login_image` | image_picker | Image shown beside the login form |

### Register Form — `register-form`

`src/sections/accounts/register-form.liquid`. No `templates` restriction; rendered by
`customers/register.liquid`.

| Setting | Type | Controls |
|---|---|---|
| `register_image` | image_picker | Image shown beside the registration form |

The theme-wide **Accounts** setting (`settings.account_navigation`) looks like it belongs
here, but nothing reads it — see the
[global settings appendix](../global-sections.md#appendix--theme-wide-settings).

## Empty templates

`404.liquid`, `password.liquid`, `gift_card.liquid` and `search.liquid` are all empty
files. They fall back to the layout with no content of their own — so a 404 currently shows
only the header and footer. Hero, 50/50, Product Recommendations, Quiz, Shop By Collections
and Social Media all allow the `404` template, but nothing renders them until `404.liquid`
gets either a `{% section %}` tag or a `404.json` template.
