# Metaobjects

The store defines **three metaobjects**. **None of them are read by this theme.**

A full search of `src/` for `metaobject`, `metaobject_reference` and `metaobjects[...]`
returns no matches — in Liquid, in the React apps under `src/apps/`, or in the JSON
snippets under `src/snippets/json/`. No section or block setting uses a `metaobject` or
`metaobject_list` setting type either.

So everything below is **store-side data that currently has no consumer in the theme**.
It is documented here because the definitions exist, hold real entries, and in two cases
shadow functionality the theme implements a different way (see
[Quiz metaobjects vs. the quiz section](#quiz-metaobjects-vs-the-quiz-section)).

All custom data the theme actually reads is stored in **metafields**, documented per
resource:

- [Product metafields](templates/product.md#metafield-definitions)
- [Collection metafields](templates/collection.md#metafield-definitions)
- [Page metafields](templates/page.md#metafield-definitions)

## Quiz Answer — `quiz_answer`

Display name field: `answer_one`. No description set on the definition.

| Key | Name | Type | Required | Purpose |
|---|---|---|---|---|
| `answer_one` | Answer One | Single line text | Yes | The answer to the first quiz question |
| `answer_two` | Answer Two | Single line text | Yes | The answer to the second quiz question |
| `answer_three` | Answer Three | Single line text | Yes | The answer to the third quiz question |
| `recommended_products` | Recommended Products | List of product references | Yes | The products to recommend for this answer combination |

## Quiz Questions — `quiz_questions`

Display name field: `question_one`. No description set on the definition.

| Key | Name | Type | Required | Purpose |
|---|---|---|---|---|
| `question_one` | Question One | Single line text | Yes | First question shown in the quiz |
| `question_two` | Question Two | Single line text | Yes | Second question shown in the quiz |
| `question_three` | Question Three | Single line text | Yes | Third question shown in the quiz |

## Reviews — `reviews`

Definition description: *"its a review yappa"*. Display name field: `name`.

Every field is optional, so entries can be partially filled.

| Key | Name | Type | Required | Purpose |
|---|---|---|---|---|
| `name` | Name | Single line text | No | Reviewer's name; also the entry's display name |
| `title` | Title | Single line text | No | Review headline |
| `review_text` | Review Text | Multi-line text | No | Body of the review |
| `location` | Location | Single line text | No | Where the reviewer is from |

Note this is **separate** from the product review *metafields*
(`custom.product_reviews`, `custom.review_count`, `reviews.rating`) documented on the
[product page](templates/product.md#metafield-definitions). Those hold aggregate scores on
each product; this metaobject holds individual written reviews. Nothing in the theme
renders either the individual reviews or the `reviews.*` aggregates today.

## Quiz metaobjects vs. the quiz section

The two quiz metaobjects describe the same feature as the **Quiz** section
(`src/sections/page-sections/quiz-section.liquid`), but the theme does not use them —
it stores the same data in section and block settings instead:

| Data | Store metaobject | Theme equivalent (what actually renders) |
|---|---|---|
| The three questions | `quiz_questions.question_one/two/three` | Section settings `question_one`, `question_two`, `question_three` |
| An answer combination | `quiz_answer.answer_one/two/three` | `quiz_answer` **block** settings `answer_one`, `answer_two`, `answer_three` |
| What to recommend | `quiz_answer.recommended_products` (list of products) | `quiz_answer` block setting `recommendation` (single product) |

The block type in the section schema is literally `quiz_answer` — the same handle as the
metaobject — so these were almost certainly two attempts at one feature.

Two practical consequences:

- **Editing the metaobject entries changes nothing on the storefront.** To change the
  live quiz, edit the section and its blocks in the theme customizer.
- The metaobject models `recommended_products` as a **list**, while the section block
  allows a **single** `recommendation`. If the quiz is ever finished, the metaobject is
  the more capable model.

Bear in mind the quiz section is itself unfinished — see
[Quiz](templates/page.md#quiz--quiz-section) for what does and doesn't work.

## Adding a metaobject to the theme

If you wire one of these up (or add a new definition), document it here with its fields
(key, name, type, required) and where the theme reads it. Once this page outgrows a single
file, split it to `documentation/metaobjects/<type>.md`, one page per type.
