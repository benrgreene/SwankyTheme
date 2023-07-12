import React, { useState, useEffect } from 'react';

import { addEffect } from 'scripts/utils/Effects.js';
import { loadNextPage } from './utils/ProductFetch.js';

const Products = ({ data }) => {
  const [products, setProducts] = useState([]);
  const [maxProducts, setMaxProducts] = useState(0);

  useEffect(addEffect('collectionProducts', setProducts), []);
  useEffect(addEffect('collectionProductsMax', setMaxProducts), []);

  const loadMoreProducts = () => {
    loadNextPage({
      collectionID: window.state.PFSCollectionID,
      searchTerm: window.state.PFSSearchTerm,
      toLoad: 6
    });
  };

  return (
    <div className="w-full">
      <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
        {products &&
          <>
            {products.map((product, productIndex) => {
              const productJSON = JSON.stringify({
                id: product.id,
                title: product.title,
                image: product.images_info ? product.images_info[0] : { src: product.media[0].variant_image, alt: product.media[0].image_alt_text },
                handle: product.handle,
                price: product.price ? product.price : product.price_min * 100,
                metafields: product.metafields,
                tags: product.tags
              });
              return (
                <div product-tile="true"
                     props={productJSON}
                     key={`collection-product-${productIndex}`}></div>
              );
            })}
          </>
        }
      </div>

      <div className="mt-10 flex flex-col items-center justify-center">
        <p className="mb-6">Showing {products.length} of {maxProducts} Products</p>
        {products.length < maxProducts &&
          <button className="button button--secondary"
                  onClick={() => loadMoreProducts()}>
            Load More
          </button>
        }
      </div>
    </div>
  );
};

export default Products;
