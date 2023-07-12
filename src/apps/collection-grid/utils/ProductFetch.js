import { URLQueryParams } from 'scripts/utils/QuerySelectors.js';

const buildBoostFetchURL = (collectionID, searchTerm, getFilters = false) => {
  const boostInfo = window.boostPFSAppConfig;
  const filterQuery = Object.keys(window.state.activeFilters).join('&');
  const collectionScope = collectionID ? `&collection_scope=${collectionID}` : '';
  const searchQuery = searchTerm ? `&q=${searchTerm}` : '';
  const sortQuery = `&sort=${window.state.productSort || 'manual'}`;
  const fullSearchQuery = `${filterQuery}${searchQuery}${getFilters ? '&build_filter_tree=true' : ''}${collectionScope}${sortQuery}`;
  const collectionURL = `${searchTerm ? boostInfo.api.searchUrl : boostInfo.api.filterUrl}?shop=${boostInfo.shop.domain}&${fullSearchQuery}`;
  return { fullSearchQuery, collectionURL };
};

const boostProductFetch = (setURL, getFilters, collectionID, searchTerm, pageLimit = 18) => {
  const { fullSearchQuery, collectionURL } = buildBoostFetchURL(collectionID, searchTerm, getFilters);

  fetch(`${collectionURL}&limit=${pageLimit}`)
    .then((blob) => blob.json())
    .then((collectionInfo) => {
      // not clearing has issues with sort changes
      window.setState('collectionProducts', []);
      // update our URL
      const collectionDisplayURL = `${window.location.origin}${window.location.pathname}?limit=${pageLimit}&${fullSearchQuery}`;
      if (setURL) history.replaceState({}, 'title', collectionDisplayURL.replaceAll('&&', '&'));
      // set our active filters - should only run on initial collection grid component loading
      if (getFilters) {
        window.setState('collectionFilters', collectionInfo.filter);
        const newActiveFilters = {};
        collectionInfo.filter.options.forEach((filter) => {
          if (filter.filterType === 'price') return;
          filter.values.forEach((filterVal) => {
            const filterKey = `${filter.filterType}=${filterVal.key}`;
            if (window.location.search.includes(filterKey)) {
              newActiveFilters[filterKey] = true;
            }
          });
        });
        window.setState('activeFilters', newActiveFilters);
      }
      setTimeout(() => {
        window.setState('collectionProductsMax', collectionInfo.total_product);
        window.setState('collectionProducts', collectionInfo.products);
      }, 10);
    });
};

const shopifyProductFetch = (setURL, getFilters, collectionID, searchTerm, pageOn) => {
  const filterQuery = Object.keys(window.state.activeFilters).join('&');
  const searchQuery = searchTerm ? `&q=${searchTerm}` : '';
  const sortBy = window.state.productSort ? `&sort_by=${window.state.productSort}` : '';
  const fullSearchQuery = `${filterQuery}${searchQuery}${sortBy}`;
  const collectionURL = `/collections/${collectionID}/?view=json-view&page=${pageOn}&${fullSearchQuery}`;
  const displayURL = `${window.location.origin}${window.location.pathname}?${fullSearchQuery}`;

  fetch(collectionURL)
    .then((blob) => blob.json())
    .then((collectionInfo) => {
      const currentProducts = window.state.collectionProducts || [];
      const handlesFound = [];
      const newProducts = [...currentProducts, ...collectionInfo.products].filter((product) => {
        if (handlesFound.includes(product.handle)) return false;
        handlesFound.push(product.handle);
        return true;
      });
      window.setState('collectionProductsMax', collectionInfo.totalProductCount);
      window.setState('collectionProducts', newProducts);
      if (getFilters) {
        window.setState('collectionFilters', collectionInfo.filters);
      }
      if (setURL) {
        history.pushState({}, 'title', displayURL);
      }
    });
};

export const performProductFetch = ({ getFilters = false, collectionID = false, searchTerm = false, setURL = false, pageLimit = false }) => {
  const boostInfo = window.boostPFSAppConfig;

  if (boostInfo) {
    const productsToLoad = pageLimit || URLQueryParams()['limit'] || 18;
    boostProductFetch(setURL, getFilters, collectionID, searchTerm, productsToLoad);
  } else {
    const pageOn = window.state.pageOn || 1;
    shopifyProductFetch(setURL, getFilters, collectionID, searchTerm, pageOn);
  }
}

export const loadNextPage = ({ collectionID = false, searchTerm = false, toLoad = 6 }) => {
  const boostInfo = window.boostPFSAppConfig;

  if (boostInfo) {
    const { fullSearchQuery, collectionURL } = buildBoostFetchURL(collectionID, searchTerm);
    const pageOn = window.state.collectionProducts.length / toLoad + 1;

    fetch(`${collectionURL}&page=${pageOn}&limit=${toLoad}`)
      .then((blob) => blob.json())
      .then((response) => {
        const currentProducts = window.state.collectionProducts;
        const newProducts = [...currentProducts, ...response.products];
        window.setState('collectionProducts', newProducts);

        const collectionDisplayURL = `${window.location.origin}${window.location.pathname}?limit=${newProducts.length}&${fullSearchQuery}`;
        history.replaceState({}, 'title', collectionDisplayURL);
        sessionStorage.setItem('collectionProductJSON', JSON.stringify(newProducts));
      });
  } else {
    const pageOn = window.state.collectionProducts.length / toLoad + 1;
    shopifyProductFetch(true, false, collectionID, searchTerm, pageOn);
  }
}
