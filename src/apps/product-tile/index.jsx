import React from "react";
import * as ReactDOM from 'react-dom/client';
import ProductTile from "./ProductTile.jsx";

const appAttribute = 'product-tile';

document.addEventListener("DOMContentLoaded", () => {
  const observeRoot = document.querySelector('#MainContent');
  const config = { childList: true, subtree: true };
  const observer = new MutationObserver(observerCallback);
  observer.observe(observeRoot, config);

  const productTiles = document.querySelectorAll(`[${appAttribute}]`);
  productTiles.forEach((tile) => setupProductTile(tile));
});


const observerCallback = (mutationList, observer) => {
  mutationList.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.hasAttribute(appAttribute)) setupProductTile(node);
    });
  });
};


const setupProductTile = (productTileEl) => {
  const propsRaw = productTileEl.getAttribute('props');
  const props = JSON.parse(propsRaw);

  const root = ReactDOM.createRoot(productTileEl);
  root.render(<ProductTile data={props} />);
};
