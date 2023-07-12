import { addToCart, removeFromCart } from './Cart.js';

export const upgradeToSubscription = (lineItem, sellingPlan) => {
  const { id, quantity, properties } = lineItem;
  removeFromCart(lineItem)
    .then((response) => {
      return addToCart({ id, quantity, properties, sellingPlan });
    });
};

export const switchToOneTime = (lineItem) => {
  const { id, quantity, properties } = lineItem;
  removeFromCart(lineItem)
    .then((response) => {
      return addToCart({ id, quantity, properties });
    });
};
