import React, { useState, useEffect } from 'react';

import { addEffect } from 'scripts/utils/Effects.js';
import { addToCart } from 'scripts/utils/Cart.js';

const AddToCart = () => {
  const [quantity, setQuantity] = useState(1);
  const [optionState, setOptionState] = useState(window.state.selectedProductOptions || []);

  useEffect(addEffect('productQuantity', setQuantity), []);
  useEffect(addEffect('selectedProductOptions', setOptionState), []);

  const { product } = window.brg;
  const selectedVariant = product.variants.find((variant) => {
    return optionState.reduce((allMatch, option) => {
      return allMatch && variant.options.includes(option);
    }, true);
  });

  window.setState('selectedVariant', selectedVariant);

  const addItemToCart = () => {
    addToCart({
      id: selectedVariant.id,
      quantity: quantity,
    });
  };

  return (
    <div className="mt-6 flex items-stretch">
      <div className="mr-2 border rounded-[1.25rem] flex items-center">
        <button className="py-3 px-4 h-full"
                aria-label="decrease quantity"
                onClick={() => window.setState('productQuantity', Math.max(1, quantity - 1))}>
          <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><g stroke="#1E4027" strokeWidth="1.25" fill="none" fillRule="evenodd" strokeLinecap="round"><path d="M12.538 7H1.462"/></g></svg>
        </button>
        <span className="pt-px">
          {quantity}
        </span>
        <button className="py-3 px-4 h-full"
                aria-label="increase quantity"
                onClick={() => window.setState('productQuantity', quantity + 1)}>
          <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><g stroke="#1E4027" strokeWidth="1.25" fill="none" fillRule="evenodd" strokeLinecap="round"><path d="M12.538 7H1.462M7 1.462v11.076"/></g></svg>
        </button>
      </div>
      <button className="button button--atc button--short w-full"
              disabled={!selectedVariant || selectedVariant.available === false}
              onClick={addItemToCart}>
        {selectedVariant ? (selectedVariant.available ? 'Add To Cart' : 'Out Of Stock') : 'Product Unavailable'}
      </button>
    </div>
  );
};

export default AddToCart;