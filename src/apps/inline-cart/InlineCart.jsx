import React, { useState, useEffect } from 'react';

import { addEffect } from 'scripts/utils/Effects.js';
import { money } from './utils/helpers';
import { setupFetchUpsells } from './utils/UpsellFetch.js';

import FreeShipping from './FreeShipping.jsx';
import CartHeader from './CartHeader.jsx';
import CartItems from './CartItems.jsx';
import Upsells from './Upsells.jsx';

setupFetchUpsells();

// Add event listeners for opening cart
['openCart', 'addToCart'].forEach((eventName) => {
  document.addEventListener(eventName, () => {
    window.setState('cartOpen', true);
  });
});

// Add event listeners for closing the cart
['closeCart', 'keydown'].forEach((eventName) => {
  document.addEventListener(eventName, (event) => {
    if (event.keyCode && event.keyCode !== 27) return;
    window.setState('cartOpen', false)
  });
});

const InlineCart = ({ data }) => {
  const [openState, setOpenState] = useState(false);
  const [cartState, setCartState] = useState(window.state.cartState || {});

  useEffect(addEffect('cartState', setCartState), []);
  useEffect(addEffect('cartOpen', (isOpen) => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    setOpenState(isOpen);
  }), []);

  const getCartPrice = (cartState) => {
    return cartState.items.reduce((price, item) => {
      return price + item.price * item.quantity;
    }, 0);
  }

  return (
    <aside className={`fixed top-4 bottom-4 rounded-[1.25rem] flex flex-col max-h-screen max-w-[calc(100vw-32px)] w-[30rem] z-[101] transition-all duration-200 ${openState ? 'right-4' : 'right-cart'}`}>
      {openState &&
        <button className="absolute -top-4 -bottom-4 -right-4 w-[150vw] bg-black opacity-50 z-[-1]"
                aria-label="close cart"
                onClick={() => window.setState('cartOpen', false)}></button>
      }

      <CartHeader data={ data } />
      {cartState.item_count > 0 &&
        <FreeShipping data={ data } />
      }

      <div className="pb-6 grow overflow-auto h-full bg-white">
        <CartItems data={ data } />

        {cartState.item_count > 0 &&
          <Upsells data={ data } />
        }
      </div>

      <div style={{ backgroundColor: data.disclaimerBackground, color: data.disclaimerTextColor, boxShadow: '0 0 20px 0 rgba(0,0,0,0.1)' }}
           className="rounded-b-[1.25rem] py-6 px-4 left-0 right-0 bottom-0 flex flex-col items-center">
        <a className="button button--atc w-full"
           href="/checkout">
          Checkout
            {cartState.total_price
                ? ` - $${money(getCartPrice(cartState))}`
                : ''
            }
        </a>
        {data.disclaimerText &&
          <p className="mt-4 text-center small-text text-dark-grey font-light">
            {data.disclaimerText}
          </p>
        }
      </div>
    </aside>
  );
}

export default InlineCart;
