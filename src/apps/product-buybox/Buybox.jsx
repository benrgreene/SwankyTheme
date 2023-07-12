import React, { useState, useEffect } from 'react';

import { addEffect } from 'scripts/utils/Effects.js';

import Gallery from './components/gallery.jsx';
import BuyboxContent from './components/buybox-content.jsx';

// Set the default state for selected options
const { product } = window.brg;
const defaultVariantID = product.defaultVariant;
const defaultVariant = product.variants.find((variant) => variant.id === defaultVariantID);
const defaultOptions = defaultVariant.options;
window.setState('selectedVariant', defaultVariant);
window.setState('selectedProductOptions', defaultOptions);

const Buybox = ({ data }) => {
  return (
    <div className="mt-4 ccontain">
      <div className="grid gap-y-16 gap-x-12 lg:grid-cols-[1fr,28rem]">
        <Gallery />
        <BuyboxContent showBreadcrumbs={data.showBreadcrumbs} 
        			   productThreshold={data.productThreshold}
        			   lowStockMessage={data.lowStockMessage} />
      </div>
    </div>
  );
};

export default Buybox;