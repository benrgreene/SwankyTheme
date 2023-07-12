import React from "react";
import * as ReactDOM from 'react-dom/client';

import CollectionGrid from "./CollectionGrid.jsx";
import { loadNextPage, performProductFetch } from './utils/ProductFetch.js';
import { URLQueryParams } from 'scripts/utils/QuerySelectors.js';
import { scrollToLastProduct } from 'scripts/components/ProductPositioner.js';

document.addEventListener("DOMContentLoaded", () => {
  const collectionGrid = document.querySelector('#CollectionGrid');
  const propsRaw = collectionGrid.getAttribute('props');
  const props = JSON.parse(propsRaw);

  const root = ReactDOM.createRoot(collectionGrid);
  root.render(<CollectionGrid data={props} />);

  const limit = URLQueryParams()['limit'] || 18;
  const productJSON = sessionStorage.getItem('collectionProductJSON');

  performProductFetch({
    getFilters: true,
    collectionID: props.collectionID,
    searchTerm: props.searchTerm || false
  });

  if (limit > 70 && productJSON) {
    const abortController = window.listenToState(() => {
      const products = JSON.parse(productJSON);
      const href = window.location.href;
      abortController.abort();
      setTimeout(() => {
        history.replaceState({}, 'title', href.replace('limit=18', `limit=${products.length}`));
        window.setState('collectionProducts', products);
        scrollToLastProduct();
      }, 500);
    }, 'collectionProducts');
  }

  window.listenToState((isOpen) => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, 'filtersOpen');
});

