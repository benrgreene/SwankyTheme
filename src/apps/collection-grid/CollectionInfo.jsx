import React, { useState, useEffect } from 'react';

import { addEffect } from 'scripts/utils/Effects.js';

const CollectionInfo = ({ data }) => {
  const [products, setProducts] = useState([]);
  const [maxProducts, setMaxProducts] = useState(0);
  const [activeFilterState, setActiveFilterState] = useState([]);

  useEffect(addEffect('collectionProducts', setProducts), []);
  useEffect(addEffect('collectionProductsMax', setMaxProducts), []);
  useEffect(addEffect('activeFilters', (newFilters) => {
    setActiveFilterState(Object.keys(newFilters));
  }), []);

  return (
    <div>
      <div className="mb-6 lg:mb-0 border-t border-black flex lg:hidden justify-between">
        <button className="border-b border-r border-black pl-5 pr-5 w-1/2 flex justify-between items-center"
                onClick={() => window.setState('filtersOpen', true)}>
          Filters
          {activeFilterState.length > 0 ? ` (${activeFilterState.length})` : ''}
          <svg width="17" height="16" viewBox="0 0 17 16">
            <use href="#icon-filter" />
          </svg>
        </button>
        <div className="w-1/2 select-wrap">
          <select className="w-full"
                  onChange={(event) => window.setState('productSort', event.target.value)}>
            <option value="manual">Featured</option>
            <option value="best-selling">Best Selling</option>
            <option value="title-ascending">Title A-Z</option>
            <option value="title-descending">Title Z-A</option>
            <option value="price-ascending">Price Low to High</option>
            <option value="price-descending">Price High to Low</option>
          </select>
        </div>
      </div>
      <div className="ccontain mb-4 lg:mb-8 block">
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center">
          <div className="mt-4 lg:mt-0 flex justify-between w-full lg:block lg:w-auto text-xsmall text-dark-grey">
            <ul className="flex items-center">
              <li className="text-xsmall">
                <a href="/"
                   className="mr-1 no-underline">
                  Home /
                </a>
              </li>
              <li className="text-xsmall font-semibold">
                {window.brg.collectionTitle || 'Search'}
              </li>
            </ul>
            <span data-search-total>
              {maxProducts === 1 ? '1 Product' : `${maxProducts} Products` }
            </span>
          </div>
          <div className="hidden lg:block">
            <div className="select-wrap">
              <select className="min-w-[13rem]"
                      onChange={(event) => window.setState('productSort', event.target.value)}>
                <option value="manual">Featured</option>
                <option value="best-selling">Best Selling</option>
                <option value="title-ascending">Title A-Z</option>
                <option value="title-descending">Title Z-A</option>
                <option value="price-ascending">Price Low to High</option>
                <option value="price-descending">Price High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionInfo;
