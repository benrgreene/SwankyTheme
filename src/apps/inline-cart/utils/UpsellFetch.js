const clearCartItems = (products) => {
  const cartIDs = window.state.cartState.items.map((item) => item.product.id);
  return products.filter((product) => !cartIDs.includes(product.id));
};

export const setupFetchUpsells = () => {
  window.listenToState((isOpen) => {
    const { cartState } = window.state;
    if (!isOpen || !cartState || cartState.items.length === 0) return;

    const URL = `/recommendations/products.json?product_id=${cartState.items[0].product.id}`;
    fetch(URL)
      .then((blob) => blob.json())
      .then(({ products }) => {
        if (products.length > 0) {
          window.setState('upsellState', products);
        } else {
          fetch(`/collections/all?view=json-view`)
            .then((collectionBlob) => collectionBlob.json())
            .then((data) => {
              window.setState('upsellState', clearCartItems(data.products));
            })
        }
      });
  }, 'cartOpen');
};
