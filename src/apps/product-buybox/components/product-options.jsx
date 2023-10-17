import React, { useState, useEffect } from 'react';

import { addEffect } from 'scripts/utils/Effects.js';

const ProductOptions = () => {
  const [optionState, setOptionState] = useState(window.state.selectedProductOptions || []);
  useEffect(addEffect('selectedProductOptions', setOptionState), []);

  const { product } = window.brg;

  const setSelectedOption = (optionGroup, option) => {
    const newOptionState = [...optionState];
    const optionIndex = optionGroup.position - 1;
    newOptionState[optionIndex] = option;
    window.setState('selectedProductOptions', newOptionState);
  };

  return (
    <div>
      {product.options.map((optionGroup, groupIndex) =>
        <div className="mt-4"
             key={`option-group-${groupIndex}`}>
          <h2 className="mb-1 flex items-center h6">
            {optionGroup.name}
            {optionGroup.name === 'Color' &&
              <span className="ml-3 sub-regular">
                ({optionState[optionGroup.position - 1]})
              </span>
            }
          </h2>
          {optionGroup.name !== 'Color' &&
            <div className="grid grid-cols-3 gap-x-3 gap-y-4">
              {optionGroup.values.map((option, optionIndex) =>
                <button className={`relative overflow-hidden border border-big py-2 transition-all after:content-[''] after:absolute after:inset-0 after:z-[-1] ${optionState.includes(option) ? 'after:bg-primary after:opacity-70' : 'after:bg-white hover:after:bg-primary hover:after:opacity-40 after:transition-all'}`}
                        key={`variant-option-${option}`}
                        onClick={() => setSelectedOption(optionGroup, option)}>
                  <span className="relative z-1">{option}</span>
                </button>
              )}
            </div>
          }
          {optionGroup.name === 'Color' &&
            <div className="flex gap-x-3 gap-y-4">
              {optionGroup.values.map((option, optionIndex) =>
                <button className={`border-2 rounded-full w-16 h-16 bg-cover transition-all swatch-${option} ${optionState.includes(option) ? 'border-black' : 'border-grey-4 hover:border-grey-7'}`}
                        key={`variant-option-${option}`}
                        aria-label={option}
                        onClick={() => setSelectedOption(optionGroup, option)}>
                </button>
              )}
            </div>
          }
        </div>
      )}
    </div>
  );
};

export default ProductOptions;