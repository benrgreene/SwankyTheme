import React, { useState, useEffect } from 'react';

import { addEffect } from 'scripts/utils/Effects.js';

import ProductOptions from './product-options.jsx';
import AddToCart from './add-to-cart.jsx';

const BuyboxContent = ({ showBreadcrumbs, productThreshold, lowStockMessage }) => {
  const [selectedVariant, setSelectedVariant] = useState(window.state.selectedVariant || false);
  const [quantity, setQuantity] = useState(1);

  useEffect(addEffect('selectedVariant', (newSelected) => {
    setTimeout(() => setSelectedVariant(newSelected), 200);
  }), []);

  useEffect(addEffect('productQuantity', setQuantity), []);

  const { product, collection } = window.brg;
  const halfRatingCheck = product.reviewScore - 1;
  const keys = [...Array(5).keys()];

  const getIconName = (index) => {
    if (index <= product.reviewScore && index <= halfRatingCheck) return 'icon-star-full';
    if (index < product.reviewScore && index > halfRatingCheck) return 'icon-star-half';
    return 'icon-star-empty';
  }

  return (
    <div>
      <div className="lg:sticky lg:top-[6.75rem]">
        {showBreadcrumbs === 'true' &&
          <ul className="mb-4 flex items-center">
            <li>
              <a href="/">Home</a>
              <span className="inline-block mx-2">/</span>
            </li>
            <li>
              <a href={`/collections/${collection ? collection.handle : 'all'}/`}>
                {collection ? collection.title : 'All Products'}
              </a>
              <span className="inline-block mx-2">/</span>
            </li>
            <li>
              {product.title}
            </li>
          </ul>
        }
        <h1 className="h2 fancypants">
          {product.title}
        </h1>

        {(selectedVariant && selectedVariant.availableCount <= productThreshold && selectedVariant.availableCount > 0) &&
          <p className="mt-4 text-large">
            {lowStockMessage}
          </p>
        }

        {product.reviewScore &&
          <div className="mt-4 inline-flex items-center gap-1 text-primary">
            {keys.map((keyName, index) =>
              <svg className="w-5 h-5 fill-primary-active" viewBox="0 0 576 512" key={`star-key-${product.id}-${index}`}>
                <use href={`#${getIconName(index)}`} />
              </svg>
            )}
          </div>
        }

        <div className="my-4"
             dangerouslySetInnerHTML={{ __html: product.description }}></div>

        {!selectedVariant &&
          <p className="my-4 sub-large text-black">
            ${(quantity * product.price / 100.0).toFixed(2)}
          </p>
        }
        {selectedVariant &&
          <div className="my-4 flex items-center">
            <p className={`sub-large ${selectedVariant.comparePrice ? 'text-secondary' : 'text-black'}`}>
              ${(quantity * selectedVariant.price / 100.0).toFixed(2)}
            </p>
            {selectedVariant.comparePrice &&
              <p className="ml-2 sub-regular text-grey-6 line-through">
                ${(quantity * selectedVariant.comparePrice / 100.0).toFixed(2)}
              </p>
            }
          </div>
        }

        {product.options[0].name !== 'Title' &&
          <ProductOptions />
        }
        <AddToCart />
      </div>
    </div>
  );
};

export default BuyboxContent;