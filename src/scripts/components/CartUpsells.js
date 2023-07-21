import { cacheDom }  from 'scripts/utils/QuerySelectors.js';

const dom = {};
const qs = {
  upsellGrid: 'data-cart-upsells'
};

const createElementFromHTML = (htmlString) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

const getNewUpsellContent = () => {
  const sectionID = dom.upsellGrid.getAttribute(qs.upsellGrid);
  const productID = Alpine.store('cartInfo').cart.items[0].product.id;
  fetch(`/recommendations/products?product_id=${productID}&section_id=${sectionID}`)
    .then((blob) => blob.text())
    .then((content) => {
      const htmlContent = createElementFromHTML(content);
      const productGrid = htmlContent.querySelector(`[${qs.upsellGrid}]`);
      dom.upsellGrid.innerHTML = productGrid.innerHTML;
    });
};

export const setupCartUpsells = () => {
  cacheDom(dom, qs);

  if (dom.upsellGrid) {
    getNewUpsellContent();
    document.addEventListener('cartUpdated', getNewUpsellContent);
  }
};