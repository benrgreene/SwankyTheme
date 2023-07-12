import { updateCart, removeFromCart } from 'scripts/utils/Cart.js';

window.removeItemFromCart = (item) => {
  Alpine.store('cartInfo').setCartUpdating(true);
  removeFromCart(item)
    .then(() => Alpine.store('cartInfo').setCartUpdating(false));
};

window.increaseCartQuantity = (item) => {
  Alpine.store('cartInfo').setCartUpdating(true);
  updateCart({
    key: item.key,
    quantity: item.quantity + 1,
  })
    .then(() => Alpine.store('cartInfo').setCartUpdating(false));
};

window.decreaseCartQuantity = (item) => {
  Alpine.store('cartInfo').setCartUpdating(true);
  updateCart({
    key: item.key,
    quantity: item.quantity - 1,
  })
    .then(() => Alpine.store('cartInfo').setCartUpdating(false));
};