import React, { useState, useEffect } from 'react';

import { addEffect } from 'scripts/utils/Effects.js';

import ListFilter from './ListFilter.jsx';
import PriceFilter from './PriceFilter.jsx';

const Filters = ({ data }) => {
  const [filterState, setFilterState] = useState(window.state.collectionFilters || {});
  const [activeFilterState, setActiveFilterState] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(addEffect('filtersOpen', setFiltersOpen), []);
  useEffect(addEffect('collectionFilters', setFilterState), []);
  useEffect(addEffect('activeFilters', (newFilters) => {
    setActiveFilterState(Object.keys(newFilters));
  }), []);

  const removeFilter = (filterName) => {
    const newFilterState = window.state.activeFilters;
    delete newFilterState[filterName];
    window.setState('activeFilters', newFilterState, true);
  };

  const getFilterName = (activeFilter) => {
    if (!filterState.defaultShopifyFilters) {
      const filterObject = filterState.options.find((filter) => {
        return filter.filterType === activeFilter.split('=')[0];
      });
      if (activeFilter.includes('pf_p_price')) return 'Price';
      return filterObject ? filterObject.label : '';
    }

    const filterObject = filterState.options.find((filter) => {
      return filter.filterOptionId === activeFilter.split('=')[0];
    });
    return filterObject.label;
  }

  return (
    <div className={`filters py-3 lg:py-0 fixed top-0 bottom-0 ${filtersOpen ? 'left-0' : '-left-full'} w-[90vw] flex flex-col lg:w-full lg:max-w-[20rem] lg:static transition-all z-[100] lg:z-[11] bg-white`}>
      <button aria-label="close filters"
              className={`filters-close ${filtersOpen ? 'opacity-40' : 'opacity-0' } lg:hidden absolute top-0 bottom-0 left-full w-[10vw] bg-black transition-all`}
              onClick={() => window.setState('filtersOpen', false)}></button>
      <div className="relative px-6 pt-2 lg:pt-0 pb-2 border-b-2 lg:hidden">
        <h2 className="h5">Filters</h2>
        <button className="absolute top-1/2 transform -translate-y-1/2 right-6 text-black"
                aria-label="close"
                onClick={() => window.setState('filtersOpen', false)}>
          <svg viewBox="0 0 19 19" width="30" height="30">
            <use href="#close-icon" />
          </svg>
        </button>
      </div>

      <div className="block">
        { activeFilterState.length > 0 &&
          <div className="border-t border-mid-grey pt-6 px-6 lg:px-0">
            <div className="flex justify-between items-center">
              <span className="sub-large">
                Filter By
              </span>
              <button className="text-xsmall underline"
                      onClick={() => window.setState('activeFilters', [], true)}>
                Clear All
              </button>
            </div>
            <div className="mt-4 mb-6 px-0 lg:px-1.5">
              {activeFilterState.map((activeFilter, activeFilterIndex) =>
                <div className="mb-2 flex text-small"
                     key={`active-filter-${activeFilterIndex}`}>
                  <span className="inline-block mr-1">
                    {getFilterName(activeFilter)}:
                  </span>
                  <span>
                    {activeFilter.includes('price')
                        ? activeFilter.split('=')[1].replace(':', ' - ')
                        : activeFilter.split('=')[1]
                    }
                  </span>
                  <button className="ml-auto"
                          aria-label="remove filter"
                          onClick={() => removeFilter(activeFilter)}>
                    <svg className="w-4 h-4" viewBox="0 0 19 19">
                      <use href="#close-icon" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        }
      </div>

      {(filterState.options) &&
        <div className="border-t border-mid-grey">
          {
            filterState.options.map((filter, filterIndex) => {
              const FilterTypeSelector = filter.displayType === 'range' ? PriceFilter : ListFilter;
              return (
                <FilterTypeSelector filter={ filter }
                                    key={`active-filter-${filterIndex}`}
                                    filterIndex={ filterIndex } />
              );
            })
          }
        </div>
      }
    </div>
  );
};

export default Filters;
