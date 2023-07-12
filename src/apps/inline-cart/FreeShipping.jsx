import React, { useState, useEffect } from 'react';

const FreeShipping = ({ data }) => {
  const [cartState, setCartState] = useState(window.state.cartState);
  useEffect(() => {
    const abortController = window.listenToState(setCartState, 'cartState');
    return () => abortController.abort();
  }, []);

  const thresholdMet = () => {
    const haveSubProduct = cartState.items.reduce((found, item) => {
      return found || item.selling_plan_allocation;
    }, false);
    return (data.threshold > 0 && data.threshold < cartState.price) || haveSubProduct;
  }

  const cleanThresholdMessage = () => {
    const toGo = data.threshold - (cartState.price || 0);
    return data.thresholdMessage.replace('$TOTAL', toGo / 100.00);
  }

  const thresholdBarStyles = {
    width: `${thresholdMet() ? 100 : Math.min(100, cartState.price / data.threshold * 100.0)}%`,
    backgroundColor: data.thresholdBarBackground
  };

  const thresholdWrapperStyles = {
    backgroundColor: data.thresholdBackground
  };

  if (data.threshold > 0 || data.thresholdMessage !== false) {
    return (
      <div style={ thresholdWrapperStyles }
           className="py-4 px-6">
        <p className="mb-1 text-center font-bold text-sm text-mega-green">
          {thresholdMet() ? data.thresholdReachedMessage : cleanThresholdMessage()}
        </p>
        <p className="mb-2 text-center xsmall-text text-dark-grey">
          {data.thresholdSubMessage}
        </p>
        {data.threshold > 0 &&
          <div className="flex items-center">
            <p className="mt-px xsmall-text text-dark-grey">$0</p>
            <div className="mx-1 border border-mega-green rounded-[100px] h-2 w-full grow-1 overflow-hidden">
              <div style={ thresholdBarStyles }
                   className="h-full">
              </div>
            </div>
            <p className="mt-px xsmall-text text-dark-grey">${data.threshold / 100}</p>
          </div>
        }
      </div>
    );
  } else {
    return (
      <></>
    );
  }

};

export default FreeShipping;