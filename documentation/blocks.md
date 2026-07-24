# Theme blocks

Blocks defined in `src/blocks/` — Online Store 2.0 **theme blocks**, which are reusable
across sections and can nest inside one another.

These are a different thing from the `blocks` array inside a section's `{% schema %}`.
Those are *section blocks*, scoped to the one section that declares them, and they are
documented alongside their section:

- [Product Buybox › `color-swatch`](templates/product.md#product-buybox--product-buybox)
- [Contact Form › `subject`](templates/page.md#contact-form--contact-form)
- [50/50 › `cta`](templates/page.md#5050--fiftyfifty)
- [Quiz › `quiz_answer`](templates/page.md#quiz--quiz-section)
- [Shop By Collections › `collection_tile`](templates/page.md#shop-by-collections--shop-by-collections)
- [Social Media › `image`](templates/page.md#social-media--social-media)
- [Cart Upsells › `upsell`](templates/other-templates.md#cart-upsells--cart-upsells)
- [Article List › `tag`](templates/other-templates.md#article-list--article-list)
- [Product Badges › `badge`](global-sections.md#product-badges--product-badges)

## Contents

- [Menu Parent Item — `menu-parent`](#menu-parent-item--menu-parent)

## Menu Parent Item — `menu-parent`

**File:** `src/blocks/menu-parent.liquid`

A container block representing one top-level item in a navigation menu, with a
configurable background colour. It accepts nested theme blocks via
`{%- content_for 'blocks' -%}` and a `"blocks": [{"type": "@theme"}]` schema entry, so any
theme block can be dropped inside it to build out a mega-menu column.

| Setting | Type | Controls |
|---|---|---|
| `background` | `color_background` | Background of the menu item container. Accepts a solid colour or a CSS gradient. |

### Status: scaffold, not yet in use

This block is **not referenced by any section**. Nothing in `src/sections/` declares
`"type": "@theme"` blocks or renders `menu-parent`, and the live header navigation is built
by `src/snippets/components/header/desktop-menu.liquid` from the `main_menu` link list
instead — see [Site Header](global-sections.md#site-header--site-header).

Its body is placeholder markup:

```liquid
<div class="menu-parent-item"
     style="background-color: {{ block.settings.background }};">
  I'm a parent menu item
  {%- content_for 'blocks' -%}
</div>
```

The literal string "I'm a parent menu item" will render as-is wherever the block is used,
so replace it before wiring this into a section. To make the block available, a section
needs `"blocks": [{"type": "@theme"}]` (or an explicit `{"type": "menu-parent"}`) in its
schema plus a `{% content_for 'blocks' %}` tag in its body.

One further note: `background` uses the `color_background` setting type, whose value is a
CSS background shorthand and can be a gradient. Assigning it to the `background-color`
property, as the placeholder markup does, will not render a gradient — use `background`
instead if gradients are wanted.

## Build note

`src/blocks/` is flattened into `dist/blocks/` by Gulp, so a block's `type` is its filename
without directory or extension. Unlike the rest of `dist/`, **`dist/blocks/` is not
gitignored** and its compiled output is committed — see `.gitignore`.
