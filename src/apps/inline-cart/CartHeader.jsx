import React, { useState, useEffect } from 'react';

import { addEffect } from 'scripts/utils/Effects.js';

const CartHeader = ({ data }) => {
  const [openState, setOpenState] = useState(false);
  useEffect(addEffect('cartOpen', setOpenState), []);

  return (
    <header className="relative rounded-t-[1.25rem] py-4 px-4 text-center bg-secondary text-white">
      <h2 className="text-center h4">
        {data.title}
      </h2>
      <button aria-label="close cart"
              className="absolute top-1/2 right-8 -translate-y-2/4"
              onClick={() => window.setState('cartOpen', false)}>
        <svg className="w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
      </button>
    </header>
  );
};

export default CartHeader;