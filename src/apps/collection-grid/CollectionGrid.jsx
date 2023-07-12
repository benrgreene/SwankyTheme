import React, { useState, useEffect } from 'react';

import { addEffect } from 'scripts/utils/Effects.js';
import { performProductFetch } from './utils/ProductFetch.js';

import CollectionInfo from './CollectionInfo.jsx';
import Filters from './Filters.jsx';
import Products from './Products.jsx';

window.state.activeFilters = {};

const CollectionGrid = ({ data }) => {
  window.setState('PFSCollectionID', data.collectionID);
  window.setState('PFSSearchTerm', data.searchTerm || false);

  useEffect(() => {
    performProductFetch({
      getFilters: true,
      collectionID: data.collectionID,
      searchTerm: data.searchTerm || false
    });
  }, []);

  const doGeneralProductFetch = () => {
    window.setState('collectionProducts', []);
    window.setState('pageOn', 1);
    performProductFetch({
      collectionID: data.collectionID,
      searchTerm: window.state.PFSSearchTerm || false,
      setURL: true
    });
  }

  useEffect(addEffect('activeFilters', doGeneralProductFetch), []);
  useEffect(addEffect('PFSSearchTerm', doGeneralProductFetch), []);
  useEffect(addEffect('productSort', doGeneralProductFetch), []);

  const shouldDisplayFilters = () => {
    const toReturn = (typeof window.brg.isSearch !== 'undefined' && window.brg.isSearch) || (typeof window.brg.collection !== 'undefined' && window.brg.collection && window.brg.collection.displayFilters !== false);
    return toReturn;
  };

  return (
    <div>
      <CollectionInfo />
      <div className="ccontain">
        <div className="flex w-full gap-x-20 items-start">
          {shouldDisplayFilters() &&
            <Filters />
          }
          <Products />
        </div>
      </div>
    </div>
  );
};

export default CollectionGrid;
