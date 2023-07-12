import React, { useState, useEffect } from 'react';

import ProductTile from 'apps/product-tile/ProductTile.jsx';

const UpsellItem = ({ data }) => {
  const productJSON = {
    id: data.id,
    title: data.title,
    image: data.feature_image ? { 'src': data.feature_image, 'alt': data.title } : data.images[0],
    handle: data.handle,
    price: data.minPrice,
    metafields: data.metafields,
    tags: data.tags,
    variants: data.variants
  };

  return (
    <div>
      {productJSON &&
        <ProductTile data={productJSON} />
      }
    </div>
  );
};

export default UpsellItem;