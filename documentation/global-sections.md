# Global sections

Sections that appear on every page of the store, regardless of template.

## How globals work in this theme

This theme has **no section groups** — there are no `sections/*-group.json` files. The four
global sections are rendered directly from `src/layout/theme.liquid`:

```liquid
{%- section 'site-header' -%}

<main id="MainContent">
  {{ content_for_layout }}
</main>

{%- section 'site-footer' -%}
{%- section 'inline-cart' -%}
{%- section 'product-badges' -%}
```

Two practical consequences:

- **Their position is fixed in code.** Merchants can edit each section's settings in the
  theme editor, but cannot reorder them or add other sections around them without a code
  change. Converting `header-group.json` / `footer-group.json` section groups would remove
  that limitation.
- **They are always present on every template**, including cart, account and 404 pages.

`src/layout/checkout.liquid` is empty; checkout uses Shopify's own rendering.

---

## Site Header — `site-header`

`src/sections/globals/site-header.liquid`. The sticky top bar: announcement strip, desktop
navigation, logo, and the search / account / cart icons. Rendered with a `<header>` tag and
the classes `sticky top-0 z-10`.

Search opens the overlay in `src/snippets/components/header/smart-search.liquid`; the cart
icon opens the [Inline Cart](#inline-cart--inline-cart) drawer. Both are driven by Alpine
stores (`layoutInfo`, `cartInfo`).

| Setting | Type | Controls |
|---|---|---|
| `announce_text` | text | Announcement bar message. Include the literal word `TIMER` and it is replaced with a live countdown. |
| `announce_timer` | text | The countdown's end date. Must be formatted `Month D, YYYY` — e.g. `November 11, 2023`. |
| `main_menu` | link_list | The navigation menu rendered in the desktop header |

### About the announcement countdown

When `announce_timer` is set, the section converts it to a remaining-seconds value and
swaps `TIMER` in the announcement text for a countdown element formatted
`%d days, %h hours & %M minutes` (rendered by the `@bva/countdown` package). Both settings
must be filled in for a countdown to appear: no `announce_timer` means the word `TIMER` is
printed literally.

The date is parsed by Liquid's `date` filter, so an unparseable string yields a broken
countdown rather than an error. Note the end date has no time component — it resolves to
midnight at the start of that day.

### Header navigation

The desktop menu is rendered by `src/snippets/components/header/desktop-menu.liquid` from
the `main_menu` link list. The dropdown structure comes from the **menu's own nesting in
Shopify admin** (Navigation → your menu), not from theme settings — so to change what
appears under a top-level item, edit the menu, not the section.

---

## Site Footer — `site-footer`

`src/sections/globals/site-footer.liquid`. Rendered with a `<footer>` tag. Two bands:

1. **Email signup** — heading, body copy and a newsletter form that tags subscribers
   `newsletter`. The heading and copy come from the theme-wide **Email Signup** settings
   (`settings.email_title`, `settings.email_content`), *not* from this section — see the
   [appendix](#appendix--theme-wide-settings).
2. **Copyright bar** — the current year with the hardcoded name "Flannel Badger", plus a
   row of policy links.

| Setting | Type | Controls |
|---|---|---|
| `terms_list` | link_list | The links in the copyright bar — typically privacy policy, terms of service, refund policy |

The copyright name is hardcoded in the template rather than exposed as a setting or read
from `shop.name`; changing it requires a code edit.

---

## Inline Cart — `inline-cart`

`src/sections/globals/inline-cart.liquid`. The slide-out cart drawer, opened by the header
cart icon. Composed of the `cart-header`, `cart-items` and `cart-atc` snippets, with state
held in the Alpine `cartInfo` store and line items rendered by the `<cart-item>` web
component. Add/update/remove go through `src/scripts/components/InlineCart.js` and
`src/scripts/utils/Cart.js`.

> **Most of the settings below are not currently read by anything.** Only
> **`disclaimer_text`** has a consumer in the shipped code
> (`src/snippets/components/cart/cart-atc.liquid`). Specifically:
>
> | Setting | Status |
> |---|---|
> | `cart_title` | Unused — `cart-header.liquid` hardcodes the heading "My Cart" |
> | `threshold`, `threshold_text`, `threshold_reached_text` | Unused — no free-shipping bar is rendered |
> | `disclaimer_text` | **Used**, in `cart-atc.liquid` |
> | `continue_shopping_text`, `continue_shopping_url`, `continue_shopping_type` | Unused — there is no empty-cart state in the Liquid |
>
> The features these settings describe are implemented in `src/apps/inline-cart/` — a React
> version of the cart that reads them from a `props` attribute on `#InlineCart`. That code
> is **not part of the build** (see [Front-end runtime](README.md#front-end-runtime)), and
> the section renders `#InlineCart` without a `props` attribute in any case. They are
> documented here as
> the schema defines them, because that is what a merchant sees in the theme editor — but
> changing them currently has no effect on the storefront apart from the disclaimer.

**Cart page copy is shared from here.** The [Cart Page
section](templates/other-templates.md#cart-page--cart-page) has no content settings of its
own, so any wiring added here should cover both surfaces.

### General

| Setting | Type | Default | Controls |
|---|---|---|---|
| `cart_title` | text | "My Cart" | Heading at the top of the drawer |

### Free shipping threshold

| Setting | Type | Default | Controls |
|---|---|---|---|
| `threshold` | number | 75 | Cart total at which free shipping unlocks, in the store's currency |
| `threshold_text` | text | "Spend another $$TOTAL to get free shipping" | Progress message shown below the threshold. `$TOTAL` is replaced with the remaining amount. |
| `threshold_reached_text` | text | "You qualify for free shipping!" | Message shown once the threshold is met |

The default `threshold_text` contains `$$TOTAL` — a literal `$` followed by the `$TOTAL`
placeholder. Write the currency symbol you want in front of the placeholder yourself.

Two things to carry over if this gets reimplemented in Liquid/Alpine. The reference
implementation in `src/apps/inline-cart/FreeShipping.jsx` substitutes a **raw number**, not
a money-formatted string —

```js
return data.thresholdMessage.replace('$TOTAL', toGo / 100.00);
```

— so it produces "Spend another $12.5", not "$12.50". And it treats `threshold` as
**cents**, comparing it against the cart price in cents and displaying `threshold / 100`,
while the section setting is a plain number defaulting to `75`. Reconcile the units, or a
threshold of 75 will mean $0.75.

In any case these settings only control the **message**. The actual free shipping discount
is configured in Shopify's shipping settings; if the two disagree, the drawer will promise
something checkout doesn't honour.

### Cart disclaimer

| Setting | Type | Default | Controls |
|---|---|---|---|
| `disclaimer_text` | text | "*Shipping and taxes will be calculated at checkout." | Small print above the checkout button |

### Empty cart

| Setting | Type | Default | Controls |
|---|---|---|---|
| `continue_shopping_text` | text | — | Label for the button shown when the cart is empty |
| `continue_shopping_url` | url | — | Where that button goes |
| `continue_shopping_type` | select — Secondary / Tertiary / Outline | Secondary | Button style |

### Upsells

Upsell rules are not configured here — they live on the [Cart Upsells
section](templates/other-templates.md#cart-upsells--cart-upsells), which is a template-level
section rather than part of the drawer.

---

## Product Badges — `product-badges`

`src/sections/globals/product-badges.liquid`. Renders no visible markup of its own. It maps
**product tags to badges** and publishes that map to an Alpine store (`badgeStore`) that
product tiles across the site read to decide which badge to show.

Because it's a global section, one configuration covers every product tile everywhere —
collection grids, recommendations, upsells and search.

**No section-level settings.** All configuration is in blocks.

**Blocks — `badge` ("Product Badge")**, one per badge:

| Setting | Type | Default | Controls |
|---|---|---|---|
| `tag` | text | — | The product tag that triggers this badge. Must match the tag in Shopify admin exactly, including case. |
| `color` | select — Black / Dark Grey / Grey / Primary / Secondary | Black | Badge background |
| `text_color` | select — Black / Primary / Secondary / White | White | Badge text colour |

### Matching behaviour

The store's lookup returns the **first** badge whose tag appears in the product's tags:

```js
getBadge (productBadges) {
  return this.badges.find((badge) => productBadges.includes(badge.tag));
}
```

So a product carrying two badge tags shows only one — the one whose block sits highest in
the block list. Order the blocks by priority; a "Sold Out" or "Sale" badge you always want
to win belongs at the top.

The `text_color` setting is labelled "Badge  Text Color" (double space) in the schema.

---

## Appendix — theme-wide settings

Not sections, but several sections read these, so they're recorded here. Configured under
Theme settings in the editor; defined in `src/config/settings_schema.json`.

Theme identity: **The Swanky Theme**, version 0.1.0, author Ben Greene.

### Theme Settings

| Setting | Type | Used by |
|---|---|---|
| `site_favicon` | image_picker | `src/snippets/layout/theme-head.liquid` |

### Accounts

| Setting | Type | Used by |
|---|---|---|
| `account_navigation` | link_list | **Nothing.** The setting is defined but no template or snippet reads `settings.account_navigation`. |

### Theme Colors

Sixteen colour settings rendered into CSS custom properties by
`src/snippets/layout/theme-colors.liquid` and consumed by Tailwind via
`tailwind.config.js`. The `primary` / `secondary` / `tertiary` names used in section
settings (Hero backgrounds, badge colours, collection tile titles) resolve to these.

| Setting | Default | Setting | Default |
|---|---|---|---|
| `primary_color` | `#67C4AA` | `grey_one_color` | `#FAFAFA` |
| `primary_active_color` | `#529D88` | `grey_two_color` | `#F7F7F7` |
| `secondary_color` | `#B572E1` | `grey_three_color` | `#E4E4E4` |
| `secondary_active_color` | `#915BB4` | `grey_four_color` | `#DEDEDE` |
| `tertiary_color` | `#B572E1` | `grey_five_color` | `#D9D9D9` |
| `tertiary_active_color` | `#915BB4` | `grey_six_color` | `#C1C2C3` |
| `error_color` | `#D64123` | `grey_seven_color` | `#A7A7A7` |
| | | `grey_eight_color` | `#575656` |
| | | `grey_nine_color` | `#333333` |

The tertiary defaults are identical to the secondary defaults, so tertiary and secondary
look the same until they're changed.

### Theme Fonts

`font_import` takes the raw `<link>`/`<style>` HTML from Google Fonts (or wherever the
fonts are hosted); the family settings then reference the families it loads.

| Setting | Type | Controls |
|---|---|---|
| `font_import` | textarea | Font-loading HTML injected into `<head>` |
| `h1_font` … `h6_font` | text | Font family per heading level |
| `h1_mobile_size` / `h1_desktop_size` … `h6_*` | range 16–100 | Font size per heading level and breakpoint |
| `body_font` | text | Body font family |
| `input_font` | text | Form input font family |
| `button_font` | text | Button font family |

Heading size defaults: H1 32/60, H2 26/45, H3 24/40, H4–H6 20/28 (mobile/desktop, px).

### Theme Styling

| Setting | Type | Default | Controls |
|---|---|---|---|
| `border_radius_base` | range 0–50 | 0 | Base corner radius, in px |

Applied by `src/assets/theme-styling.css.liquid`, which derives a small scale from it:
`.border-small` is half the value, `.border-regular` is the value, `.border-big` is double.
It is also applied directly to `input`, `select` and `.button`.

### Email Signup

| Setting | Type | Default | Controls |
|---|---|---|---|
| `email_title` | text | "Signup to our Email" | Heading in the footer signup band |
| `email_content` | textarea | "Get emails about new releases, sales, and other fun things going on!" | Copy below it |

### Development Settings

| Setting | Type | Default | Controls |
|---|---|---|---|
| `display_preview` | select — Yes / No | Yes | Whether Shopify's preview bar shows. Set to No and the layout adds a `hide-preview-bar` class. |
| `is_development_theme` | select — Yes / No | No | Marks the theme as a dev theme; gates the dev-only scripts in `src/snippets/layout/dev-scripts.liquid`. |

Set `is_development_theme` to **No** on production themes.
