import React, { useState, useEffect } from 'react';

import CartItems from './CartItems.jsx';
import OrderSummary from './OrderSummary.jsx';
import Upsells from './Upsells.jsx';

import { addEffect } from 'scripts/utils/Effects.js';

const CartPage = ({ data }) => {
  const [cartState, setCartState] = useState(window.state.cartState || {});
  useEffect(addEffect('cartState', setCartState), []);

  return (
    <div className="mx-auto py-20 max-w-[66rem]">
      <h1 className="mx-6 mb-6 h3">
        My Cart {cartState ? `(${cartState.item_count})` : ''}
      </h1>
      <div className="grid lg:grid-cols-3 gap-x-10 items-start">
        <div className="lg:col-span-2">
          {cartState && cartState.item_count > 0 &&
            <hr className="mx-6"/>
          }
          <CartItems data={ data } />
        </div>
        <OrderSummary />
      </div>
    </div>
  );
};

export default CartPage;