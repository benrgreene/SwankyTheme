# Metaobjects

**The theme does not reference any metaobjects.**

A full search of `src/` for `metaobject`, `metaobject_reference` and `metaobjects[...]`
returns no matches — in Liquid, in the React apps under `src/apps/`, or in the JSON
snippets under `src/snippets/json/`. No section or block setting uses a `metaobject` or
`metaobject_list` setting type either.

All custom data the theme reads is stored in **metafields**, which are documented per
resource:

- [Product metafields](templates/product.md#metafield-definitions)
- [Collection metafields](templates/collection.md#metafield-definitions)
- [Page metafields](templates/page.md#metafield-definitions)

## Store-side status

**Not retrieved from store.** Metaobject *definitions* live in the store (Settings →
Custom data → Metaobjects), not in theme files, and reading them requires Admin API
credentials with definition read scopes. Those were not available when this page was
generated, so it is possible the store has metaobject definitions that the theme simply
doesn't consume yet.

What this page can state with confidence is the theme-side fact: **nothing in this theme
renders metaobject data.** If you add a metaobject definition and wire it into a section,
add a page for it here at `documentation/metaobjects/<type>.md` listing its fields (key,
name, type, required) and where the theme uses it.
