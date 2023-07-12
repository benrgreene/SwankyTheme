import React, { useState, useEffect } from 'react';

import CartItem from './CartItem.jsx';

const CartItems = ({ data }) => {
  const [cartState, setCartState] = useState(window.state.cartState || { items: [] });
  const [cartProcessing, setCartProcessing] = useState(false);

  useEffect(() => {
    const abortController = window.listenToState((newCartState) => {
      setCartState(newCartState);
      setCartProcessing(false);
    }, 'cartState');
    return () => abortController.abort();
  }, []);

  const sortedItems = cartState.items ? cartState.items.sort((a, b) => {
    const titleScore = a.product.title.localeCompare(b.product.title);
    const optionScore = a.options_with_values[0].value.localeCompare(b.options_with_values[0].value);
    return titleScore !== 0 ? titleScore : optionScore;
  }) : [];

  return (
    <div className={(cartState.item_count && cartState.item_count > 0) ? '' : 'h-full'}>
      {(!cartState.item_count || cartState.item_count === 0) &&
        <div className="w-full h-full flex flex-col justify-center items-center">
          <p className="mb-6">
            There are no items in your cart.
          </p>
          <a href={data.continueShoppingURL}
             className={`button button--${data.continueShoppingType}`}>
            {data.continueShoppingText}
          </a>
        </div>
      }
      {cartState.items && sortedItems.map((item, itemIndex) =>
        <CartItem data={{ props: data, item: item, itemIndex: itemIndex, cartProcessing, setCartProcessing }}
                  key={`cart-item-${itemIndex}`} />
      )}
    </div>
  );
};

export default CartItems;