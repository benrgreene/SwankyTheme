import React, { useState, useEffect } from 'react';

import { addEffect } from 'scripts/utils/Effects.js';

const OrderSummary = () => {
  const [cartState, setCartState] = useState(window.state.cartState || {});
  useEffect(addEffect('cartState', setCartState), []);

  return (
    <div className="px-6 py-3 bg-grey-2">
      <h2 className="h4 text-center">
        Order Summary
      </h2>

      <div className="mt-4 border-t border-grey-7 pt-4 pb-2 flex justify-between">
        <p>Subtotal</p>
        <p>{cartState ? `$${(cartState.total_price / 100.0).toFixed(2)}` : '-'}</p>
      </div>
      <div className="py-2 flex justify-between">
        <p>Shipping</p>
        <p>TBD</p>
      </div>
      <div className="mb-4 border-b border-grey-7 py-2 flex justify-between">
        <p>Taxes</p>
        <p>TBD</p>
      </div>

      <p className="mt-6 mb-3 flex">
        <a href='/checkout/'
           className="w-full button button--primary button--short">
          Checkout
        </a>
      </p>
      <p className="mb-6 text-small">
        *Shipping & taxes calculated at checkout
      </p>
    </div>
  )
};

export default OrderSummary;