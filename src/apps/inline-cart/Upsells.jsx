import React, { useState, useEffect } from 'react';

import { addEffect } from 'scripts/utils/Effects.js';

import UpsellItem from './UpsellItem.jsx';

const Upsells = ({ data }) => {
  const [upsellState, setUpsellState] = useState([]);
  useEffect(addEffect('upsellState', setUpsellState), []);

  return (
    <div>
      {upsellState.length > 0 &&
        <>
          <h3 className="mb-4 text-center text-mega-green font-bold text-[.875rem] leading-[1.25rem] uppercase tracking-[0.075rem]">You might also like</h3>
          <div className="my-3 mx-14 pb-3 flex gap-x-3 scrollbar overflow-auto snap-mandatory">
            {upsellState.map((upsell, upsellIndex) =>
              <div className="min-w-[65%] snap-center"
                   key={`upsell-${upsellIndex}`}>
                {data.upsellTemplate
                  ? <div dangerouslySetInnerHTML={{ __html: window[data.upsellTemplate](upsell) }}></div>
                  : <UpsellItem data={ upsell } />
                }
              </div>
            )}
          </div>
        </>
      }
    </div>
  );
};

export default Upsells;