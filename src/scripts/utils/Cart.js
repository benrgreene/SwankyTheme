export const getCart = () => {
  return fetch('/cart?view=json')
    .then((blob) => blob.json())
    .then((cart) => {
      Alpine.store('cartInfo').setCartInfo(cart);
      return cart;
    });
};

export const addToCart = ({ id, quantity, properties = {}, sellingPlan = false }) => {
  const item = { id, quantity, properties };
  if (sellingPlan) {
    item.selling_plan = sellingPlan;
  }

  return fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [item]
    })
  })
    .then(() => Alpine.store('cartInfo').setCartOpen(true))
    .then((response) =>  getCart());
};

window.atc = (id) => {
  addToCart({
    id,
    quantity: 1
  }).then((newCart) => {
    console.log(newCart)
  })
}

export const updateCart = ({ key = false, variantID = false, quantity = 0, attributes = false, note = false }) => {
  const updatesBody = { updates: {} };

  if (variantID) {
    updatesBody.updates[variantID] = quantity;
  }

  if (attributes) {
    updatesBody.attributes = attributes;
  }

  if (key) {
    updatesBody.updates[key] = quantity;
  }

  if (note) {
    updatesBody.note = note;
  }

  return fetch('/cart/update.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatesBody)
  })
    .then((blob) => blob.json())
    .then((updates) => {
      return getCart();
    })
};

export const removeFromCart = (lineItem) => {
  return fetch('/cart/change.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: lineItem.key,
      quantity: 0,
    })
  })
    .then((blob) => blob.json())
    .then((data) => getCart());
};