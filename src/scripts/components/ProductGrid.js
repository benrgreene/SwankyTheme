import { URLQueryParams } from 'scripts/utils/QuerySelectors.js';

const collectionState = {
  aborter: false,
};

window.clearFilter = (filter) => {
  const filterCheckboxEl = document.querySelector(`input[id="${filter}"]:checked`) || false;
  if (filterCheckboxEl) {
    filterCheckboxEl.click();
  }
};

window.clearAllFilters = () => {
  const filterCheckboxEls = document.querySelectorAll(`[data-collection-filters-container] input:checked`) || [];
  [...filterCheckboxEls].forEach((el) => el.click());
}

const shopifyProductFetch = (setURL, getFilters, collectionID, searchTerm, pageOn) => {
  if (collectionState.aborter) collectionState.aborter.abort();
  collectionState.aborter = new AbortController();
  const signal = collectionState.aborter.signal;

  const filterQuery = Alpine.store('collectionInfo').activeFilters.join('&');
  const searchQuery = searchTerm ? `&q=${searchTerm}` : '';
  const sortByEl = document.querySelector('[data-sort-by]') || false;
  const sortBy = sortByEl ? sortByEl.value : false;
  const fullSearchQuery = `${filterQuery}${searchQuery}${sortBy ? '&sort_by=' + sortBy : ''}`;
  const collectionURL = `/collections/${collectionID}/?view=data-view&page=${pageOn}&${fullSearchQuery}`;
  const displayURL = `${window.location.origin}${window.location.pathname}?${fullSearchQuery}`;

  return fetch(collectionURL, { signal })
    .then((blob) => blob.json())
    .then((collectionInfo) => {
      collectionState.aborter = false;

      const currentProducts = Alpine.store('collectionInfo').products || [];
      const handlesFound = [];
      const newProducts = pageOn === 1 ? [...collectionInfo.products] : [...currentProducts, ...collectionInfo.products].filter((product) => {
        if (handlesFound.includes(product.handle)) return false;
        handlesFound.push(product.handle);
        return true;
      });
      Alpine.store('collectionInfo').setProducts(newProducts);
      Alpine.store('collectionInfo').setProductsCount(collectionInfo.totalProductCount);
      if (getFilters) {
        Alpine.store('collectionInfo').setFilters(collectionInfo.filters);
      }
      if (setURL) {
        history.pushState({}, 'title', displayURL);
      }
      Alpine.store('collectionInfo').setPageOn(pageOn + 1);
    });
};

export const performProductFetch = ({ getFilters = false, collectionID = false, searchTerm = false, setURL = false, pageLimit = false }) => {
  const pageOn = Alpine.store('collectionInfo').pageOn || 1;
  return shopifyProductFetch(setURL, getFilters, collectionID, searchTerm, pageOn);
};
window.performProductFetch = performProductFetch;

export const loadNextPage = ({ collectionID = false, searchTerm = false, toLoad = 6 }) => {
  const pageOn = window.state.collectionProducts.length / toLoad + 1;
  shopifyProductFetch(true, false, collectionID, searchTerm, pageOn);
};

export const setupActiveFilters = () => {
  const url = new URL(window.location.href);
  const allParams = new URLSearchParams(url.search);
  const filters = [];
  for (const [key, value] of allParams) {
    filters.push(`${key}=${value}`);
  }
  Alpine.store('collectionInfo').activeFilters = filters;
};