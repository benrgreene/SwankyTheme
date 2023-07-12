import React, { useState, useEffect } from 'react';

const ListFilter = ({ filter, filterIndex }) => {

  const setFilter = (filterType, filterValue) => {
    const newFilterState = window.state.activeFilters;
    const filterName = `${filterType}=${filterValue}`;

    if (newFilterState[filterName]) {
      delete newFilterState[filterName];
    } else {
      newFilterState[filterName] = true;
    }

    window.setState('activeFilters', newFilterState, true);
  };

  const filterIsActive = (filter, filterValue) => {
    if (!window.state.collectionFilters.defaultShopifyFilters) {
      return Object.keys(window.state.activeFilters)
                   .includes(`${filter.filterType}=${filterValue.key}`);
    } else {
      return Object.keys(window.state.activeFilters)
                   .includes(`${filter.filterOptionId}=${filterValue.value}`);
    }
  };

  return (
    <details key={`filter-${filterIndex}`}
             open={filterIndex === 0}
             className={`border-b border-mid-grey px-4 lg:px-0 ${filter.values.length <= 1 ? 'hidden' : ''}`}>
      <summary className="filter-summary relative py-4 list-none cursor-pointer">
        <div className="flex justify-between items-center">
          <span className="text-mega-green font-bold tracking-[0.015rem]">{filter.label}</span>
          <svg className="w-4 h-2.5 transition-all transform filter-open-icon"
               viewBox="0 0 18 10">
            <use href="#icon-chevron-down" />
          </svg>
        </div>
      </summary>
      <div className="mb-6">
        <ul className="pl-0 list-none">
          {filter.values.map((filterValue, filterValueIndex) => {
            const filterKeyValue = filterValue.key ? filterValue.key : filterValue.value;
            const filterParamType = filterValue.key ? filter.filterType : filter.filterOptionId;
            return (
              <li className={`${filterValueIndex > 0 ? 'mt-4' : ''} flex justify-between`}
                  key={`filter-value-${filterValue.key ? filterValue.key : filterValue.value}-${filterValueIndex}`}>
                <div className="w-full check-wrap">
                  <input type="checkbox"
                    name={filter.filterType}
                    id={`${filter.filterType}-${filterValue.key ? filterValue.key : filterValue.value}`}
                    value={filterValue.key ? filterValue.key : filterValue.value}
                    checked={filterIsActive(filter, filterValue)}
                    onChange={() => setFilter(filterParamType, filterKeyValue)}/>
                  <label htmlFor={`${filter.filterType}-${filterValue.key ? filterValue.key : filterValue.value}`}
                         className={`w-full flex justify-between items-center ${filterIsActive(filter, filterValue) ? 'font-semibold' : ''}`}>
                    {filterValue.key ? filterValue.key : filterValue.label}
                    {window.boostPFSAppConfig && window.state.PFSSearchTerm === false &&
                      <span className="ml-auto">
                        ({filterValue.doc_count})
                      </span>
                    }
                  </label>
                </div>
              </li>
            )}
          )}
        </ul>
      </div>
    </details>
  );
};

export default ListFilter;