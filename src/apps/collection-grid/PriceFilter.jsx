import React, { useState, useEffect, useRef } from 'react';

import { URLQueryParams } from 'scripts/utils/QuerySelectors.js';

const PriceFilter = ({ filter, filterIndex }) => {
  const initialPriceData = URLQueryParams()['pf_p_price[]'] || false;
  const filterValues = initialPriceData ? initialPriceData.split(':') : [0, 100];
  const [maxValue, setMaxValue] = useState(parseInt(filterValues[1], 10));
  const [minValue, setMinValue] = useState(parseInt(filterValues[0], 10));

  const minRef = useRef(null);
  const maxRef = useRef(null);
  const backgroundRef = useRef(null);

  const setPriceFilters = (event) => {
    setMaxValue(parseInt(maxRef.current.value, 10));
    setMinValue(parseInt(minRef.current.value, 10));

    if (minValue > maxValue) {
      if (event.target === minRef.current) {
        setTimeout(() => setMinValue(maxValue - 1), 50);
      } else if (event.target === maxRef.current) {
        setTimeout(() => setMaxValue(minValue + 1), 50);
      }
    }

    setRangeBackground();

    const newFilterState = window.state.activeFilters
    Object.keys(newFilterState).forEach((filterKey) => {
      if (filterKey.includes('pf_p_price[]')) delete newFilterState[filterKey];
    });
    newFilterState[`pf_p_price[]=${minValue}.00:${maxValue}.00`] = true;
    window.setState('activeFilters', newFilterState, true);
  }

  useEffect(() => setPriceFilters(), []);

  const getRangeInfo = () => {
    return {
      minValue: parseInt(minRef.current.value, 10),
      maxValue: parseInt(maxRef.current.value, 10),
      step: parseInt(minRef.current.step, 10),
      rangeMax: parseInt(maxRef.current.getAttribute('max'), 10),
    };
  };

  const setRangeBackground = () => {
    const rangeInfo = getRangeInfo();
    if (rangeInfo === false) return;

    const { minValue, maxValue, step } = rangeInfo;

    const minPercent = minValue / step;
    const maxPercent = 100 - maxValue / step;
    backgroundRef.current.style.left = `${minPercent}%`;
    backgroundRef.current.style.right = `${Math.max(maxPercent, 1)}%`;
  };


  return (
    <details key={`filter-${filterIndex}`}
             open={filterIndex === 0}
             className="border-b border-mid-grey px-4 lg:px-0">
      <summary className="filter-summary relative py-4 list-none cursor-pointer">
        <div className="flex justify-between items-center">
          <span className="font-bold">{filter.label}</span>
          <svg className="w-4 h-2.5 transition-all transform filter-open-icon"
               viewBox="0 0 18 10">
            <use href="#icon-chevron-down" />
          </svg>
        </div>
      </summary>
      <div className="mb-6">
        <div className="relative">
          <div className="absolute top-0.5 left-0 right-2 h-0.5 bg-grey-3"></div>
          <div className="absolute top-0.5 left-0 right-2 h-0.5 bg-grey-7"
               ref={backgroundRef}></div>
          <input data-min-price
                 className="price-slider price-slider-min absolute"
                 min="0"
                 max="100"
                 step="1"
                 type="range"
                 aria-label="min price"
                 value={minValue}
                 onChange={(event) => setPriceFilters(event)}
                 ref={minRef} />
          <input data-max-price
                 className="price-slider price-slider-max absolute"
                 min="0"
                 max="100"
                 step="1"
                 type="range"
                 aria-label="max price"
                 value={maxValue}
                 onChange={(event) => setPriceFilters(event)}
                 ref={maxRef} />
          <div className="px-1 pt-4 flex justify-between">
            <span className="">$0</span>
            <span className="">$50</span>
            <span className="">$100</span>
          </div>
        </div>
      </div>
    </details>
  );
};

export default PriceFilter;