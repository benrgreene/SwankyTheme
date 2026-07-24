# Page template

Covers page-related custom data and the sections available on the page template. Because
the page template allows the widest set of sections, the **shared content sections** are
documented in full here and linked to from the other template pages.

- Template file: `src/templates/page.json`

## Metafield definitions

**The theme reads no page metafields, and the store defines none.** Searching `src/` for
`page.metafields` returns no matches, and `metafieldDefinitions(ownerType: PAGE)` returns
an empty list. Page content comes from the page body, the section settings below, and the
navigation menu chosen in the section.

## Template sections

`src/templates/page.json` ships with a single section:

| Order | Section instance | Type |
|---|---|---|
| 1 | `page-with-sidebar` | `page-with-sidebar` |

### Page-only sections

Sections restricted to `"templates": ["page"]`.

#### Page Template Content — `page-with-sidebar`

`src/sections/pages/page-with-sidebar.liquid`. Renders the page body alongside a sidebar
navigation menu, so a group of related pages (an About cluster, a help centre) shares one
nav. On mobile the sidebar collapses into a dropdown — see
`src/snippets/components/pages/page-mobile-navigation.liquid`.

The schema name is "Page Template Content", but the section `type` is `page-with-sidebar`.

| Setting | Type | Default | Controls |
|---|---|---|---|
| `bottom_margin_mobile` | range 0–200, step 2 | 40 | Space below the section on mobile |
| `bottom_margin_desktop` | range 0–200, step 2 | 70 | Space below the section on desktop |
| `page_menu` | link_list | — | The navigation menu shown in the sidebar |

#### Contact Form — `contact-form`

`src/sections/pages/contact-form.liquid`. A Shopify contact form with a configurable
subject dropdown.

| Setting | Type | Default | Controls |
|---|---|---|---|
| `bottom_margin_mobile` | range 0–200, step 2 | 40 | Space below the section on mobile |
| `bottom_margin_desktop` | range 0–200, step 2 | 70 | Space below the section on desktop |
| `contact_message` | text | — | Intro copy shown above the form |

**Blocks — `subject` ("Subject")**, one per option in the subject dropdown:

| Setting | Type | Controls |
|---|---|---|
| `title` | text | The label the customer sees in the dropdown |
| `value` | text | The value submitted with the form — what routes/labels the enquiry |

#### Styleguide — `styleguide`

`src/sections/pages/styleguide.liquid`. A development reference page rendering every
typography style, button variant, form input and component in the theme, so you can check
the current theme settings at a glance. **No settings.**

Put it on an unlisted page; it isn't meant for shoppers.

## Shared content sections

These sections allow `page` plus several other templates. Each entry notes its full
`templates` list.

### Hero — `hero`

`src/sections/page-sections/hero.liquid`. Full-width image banner with an overlaid text
box. Separate desktop and mobile images, and fine-grained control over where the text sits
and how it's styled.

Allowed on: `page`, `index`, `collection`, `product`, `404`, `blog`.

| Setting | Type | Default | Controls |
|---|---|---|---|
| `bottom_margin_mobile` | range 0–200, step 2 | 40 | Space below the section on mobile |
| `bottom_margin_desktop` | range 0–200, step 2 | 70 | Space below the section on desktop |
| `image` | image_picker | — | Desktop background image |
| `mobile_image` | image_picker | — | Mobile background image |
| `hard_height` | select — Yes / No | No | Whether to force the height below instead of letting the image set it |
| `hero_size` | range 0–100, step 1 | 50 | Desktop height, as a percentage, when `hard_height` is Yes |
| `hero_mobile_size` | range 0–100, step 1 | 50 | Mobile height, as a percentage, when `hard_height` is Yes |
| `horizontal` | select — Left / Center / Right | Center | Horizontal position of the content box |
| `vertical` | select — Top / Center / Bottom | Center | Vertical position of the content box |
| `background` | select — Black / White / Primary / Secondary | White | Fill colour of the content box |
| `text_color` | select — Black / White / Primary / Secondary | Black | Text colour inside the content box |
| `opacity` | range 0–100, step 10 | 80 | Opacity of the content box fill, so the image shows through |
| `add_blur` | select — Yes / No | Yes | Whether to blur the image behind the content box |
| `title` | text | — | Heading |
| `content` | textarea | — | Body copy |

The labels on `hero_size` and `hero_mobile_size` both read "Hero Desktop Image" in the
schema, which is misleading in the editor — they are the desktop and mobile **heights**.

### 50/50 — `fiftyfifty`

`src/sections/page-sections/fiftyfifty.liquid`. A two-column band: image on one side, text
and calls to action on the other.

Allowed on: `page`, `index`, `collection`, `product`, `404`. Maximum 2 blocks.

| Setting | Type | Default | Controls |
|---|---|---|---|
| `bottom_margin_mobile` | range 0–200, step 2 | 40 | Space below the section on mobile |
| `bottom_margin_desktop` | range 0–200, step 2 | 70 | Space below the section on desktop |
| `image` | image_picker | — | Desktop image |
| `mobile_image` | image_picker | — | Mobile image |
| `horizontal` | select — Left / Right | Left | Which side the **text** sits on; the image takes the other |
| `title` | text | — | Heading |
| `content` | textarea | — | Body copy |

**Blocks — `cta` ("CTA")**, up to 2 (the section's `max_blocks`):

| Setting | Type | Default | Controls |
|---|---|---|---|
| `cta_text` | text | — | Button or link label |
| `cta_url` | url | — | Destination |
| `cta_type` | select — Primary / Secondary / Focus Link | Focus Link | Visual style |

### Product Recommendations — `product-recs`

`src/sections/page-sections/product-recs.liquid`. A row of **up to 4** product tiles.

Allowed on: `page`, `index`, `collection`, `product`, `404`.

| Setting | Type | Default | Controls |
|---|---|---|---|
| `bottom_margin_mobile` | range 0–200, step 2 | 40 | Space below the section on mobile |
| `bottom_margin_desktop` | range 0–200, step 2 | 70 | Space below the section on desktop |
| `title` | text | "Products You May Like" | Heading |
| `collection` | collection | — | Collection to pull products from |

**On a product page the `custom.related_variants` metafield wins.** If the product being
viewed has that metafield set, its products replace the chosen collection entirely; the
collection setting is only the fallback. See
[Product metafields](product.md#metafield-definitions).

### Quiz — `quiz-section`

`src/sections/page-sections/quiz-section.liquid`. A three-question product finder. Each
answer block is one complete answer path — a specific answer to each of the three
questions, plus the product to recommend when a shopper picks that combination.

> **This section is unfinished.** The Liquid renders the three dropdowns and publishes the
> answer combinations to `window.quizAnswers`, but `src/scripts/components/QuizSection.js`
> only caches the DOM elements and `console.log`s that array — there is no matching logic.
> In practice: questions two and three start with a `hidden` wrapper and nothing reveals
> them, and the `recommendation` product is never rendered (`block.settings.recommendation`
> has no consumer in any Liquid file). Note too that `window.quizAnswers` carries only the
> three answers per block, not the recommended product, so wiring up the result needs the
> product added to that payload.

Allowed on: `page`, `index`, `collection`, `product`, `404`.

| Setting | Type | Controls |
|---|---|---|
| `bottom_margin_mobile` | range 0–200, step 2 (default 40) | Space below the section on mobile |
| `bottom_margin_desktop` | range 0–200, step 2 (default 70) | Space below the section on desktop |
| `title` | text | Heading |
| `content` | textarea | Intro copy |
| `question_one` | text | First question |
| `question_two` | text | Second question |
| `question_three` | text | Third question |

**Blocks — `quiz_answer` ("Quiz Answer")**, one per answer combination:

| Setting | Type | Controls |
|---|---|---|
| `answer_one` | text | Answer to question one |
| `answer_two` | text | Answer to question two |
| `answer_three` | text | Answer to question three |
| `recommendation` | product | Product recommended for this combination |

The three dropdowns are built by collecting the answers across **all** blocks and removing
duplicates, so you don't create a block per option — you create one block per *complete
path*, repeating answer text between blocks wherever paths overlap. Answer text is matched
literally, so "Dry skin" and "dry skin" become two separate options.

### Shop By Collections — `shop-by-collections`

`src/sections/page-sections/shop-by-collections.liquid`. A grid of collection tiles, each
using the collection's own feature image with a styled title bar over it.

Allowed on: `page`, `index`, `collection`, `product`, `404`.

| Setting | Type | Default | Controls |
|---|---|---|---|
| `bottom_margin_mobile` | range 0–200, step 2 | 40 | Space below the section on mobile |
| `bottom_margin_desktop` | range 0–200, step 2 | 70 | Space below the section on desktop |
| `title` | text | "Shop By Collections" | Heading |

**Blocks — `collection_tile` ("Collection")**, one per tile:

| Setting | Type | Default | Controls |
|---|---|---|---|
| `collection` | collection | — | Collection to link to; its feature image becomes the tile image |
| `title_color` | select — White / Black / Primary / Secondary / Tertiary | Primary | Colour of the tile title |
| `title_background` | select — White / Black / Primary / Primary-Active / Secondary / Secondary-Active / Tertiary / Tertiary-Active | Black | Fill behind the tile title |
| `title_opacity` | range 0–100, step 10 | 80 | Opacity of that fill |

A tile with no feature image on its collection renders with an empty image area — set one
on the collection itself.

### Social Media — `social-media`

`src/sections/page-sections/social-media.liquid`. A manually curated Instagram-style image
row. Images are uploaded here, not pulled from Instagram — the URL is only where the row
links.

Allowed on: `page`, `index`, `collection`, `product`, `404`. Maximum 8 blocks.

| Setting | Type | Controls |
|---|---|---|
| `bottom_margin_mobile` | range 0–200, step 2 (default 40) | Space below the section on mobile |
| `bottom_margin_desktop` | range 0–200, step 2 (default 70) | Space below the section on desktop |
| `title` | text | Heading |
| `content` | textarea | Body copy |
| `instagram_url` | url | Instagram profile the section links to |

**Blocks — `image` ("Image")**, up to 8:

| Setting | Type | Controls |
|---|---|---|
| `image` | image_picker | The image to show in the row |

The preset is named "Social Medai" in the schema — a typo that appears in the section
picker in the theme editor. It doesn't affect the section `type`, which is `social-media`.

### Spacer — `spacer`

`src/sections/page-sections/spacer.liquid`. Pure vertical whitespace, for when two adjacent
sections need more breathing room than their own bottom margins provide.

Allowed on: `page`, `product`.

| Setting | Type | Default | Controls |
|---|---|---|---|
| `bottom_margin_mobile` | range 0–200, step 2 | 40 | Height on mobile |
| `bottom_margin_desktop` | range 0–200, step 2 | 70 | Height on desktop |

## A note on the spacing settings

Nearly every section exposes `bottom_margin_mobile` and `bottom_margin_desktop`. They are
rendered by the shared `spacer` snippet (`src/snippets/components/general/spacer.liquid`),
which each section calls at the end:

```liquid
{%- render 'spacer',
      _mobile_space: section.settings.bottom_margin_mobile,
      _desktop_space: section.settings.bottom_margin_desktop -%}
```

Values are in pixels, 0–200 in steps of 2. Note this is separate from the **Spacer
section**, which uses the same snippet as its entire body.
