import React, { useState, useEffect } from 'react';

import SubscriptionUpsell from './SubscriptionUpsell.jsx';

import { updateCart, removeFromCart } from 'scripts/utils/Cart.js';
import { money } from './utils/helpers';

const CartItem = ({ data }) => {
  const { props, item, itemIndex } = data;

  const cleanedOptions = (item) => {
    if (!item.options_with_values) return [];
    return item.options_with_values.filter((option) => {
      return option.value !== 'Default Title';
    });
  };

  const updateLineItem = (item, quantity) => {
    updateCart({ key: item.key, quantity });
  };

  const getSelectedPlan = (lineItem) => {
    return lineItem.selling_plan_allocation ? lineItem.selling_plan_allocation.selling_plan.name.replace('Delivery every ', '') : 'One-time';
  };

  return (
    <div className={`my-6 mx-6 border-b pb-6 ${data.cartProcessing ? 'opacity-40 pointer-events-none' : ''}`}
         style={{ borderColor: item.dividerLine }}>
      <div className="flex">
        <a className="shrink-0"
           href={`/products/${item.product.handle}/`}>
          <img src={item.image}
               alt={item.title}
               className="mr-3 h-20 w-20 object-contain object-center bg-light-grey mix-blend-multiply" />
        </a>
        <div className="grow">
          <div className="mb-2.5 w-full flex justify-between items-center">
            <a className="no-underline"
               href={`/products/${item.product.handle}/`}>
              <h3 className="text-base"
                  style={{ color: props.itemTitle }}>
                {item.product.title}
              </h3>
            </a>
            <button className="group"
                    aria-label={`remove ${item.product.title} from cart`}
                    onClick={() => {data.setCartProcessing(true); updateLineItem(item, 0)}}>
              <span className="inline group-hover:hidden text-mega-green"
                    dangerouslySetInnerHTML={{ __html: props.removeIcon }} />
              <span className="hidden group-hover:inline text-dark-grey"
                    dangerouslySetInnerHTML={{ __html: props.removeHoverIcon }} />
            </button>
          </div>
          {cleanedOptions(item).map((option, optionIndex) =>
            <p className={`text-small text-${data.itemOption}`}
               key={`item-${itemIndex}-option-${optionIndex}`}>
              <span className="font-bold">{option.name}</span>: {option.value}
            </p>
          )}
          {item.product.selling_plan.length > 0 &&
            <p className={`small-text text-${item.itemOption}`}>
              {getSelectedPlan(item)}
            </p>
          }
          <div className="mt-3 mb-1 w-full flex justify-between items-center">
            <div className="border flex items-center rounded-sm">
              <button className="py-3 px-3"
                      aria-label="decrease quantity"
                      onClick={() => {data.setCartProcessing(true); updateLineItem(item, item.quantity - 1)}}>
                <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><g stroke="#1E4027" strokeWidth="1.25" fill="none" fillRule="evenodd" strokeLinecap="round"><path d="M12.538 7H1.462"/></g></svg>
              </button>
              <span className="pt-px">
                {item.quantity}
              </span>
              <button className="py-3 px-3"
                      aria-label="increase quantity"
                      onClick={() => {data.setCartProcessing(true); updateLineItem(item, item.quantity + 1)}}>
                <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><g stroke="#1E4027" strokeWidth="1.25" fill="none" fillRule="evenodd" strokeLinecap="round"><path d="M12.538 7H1.462M7 1.462v11.076"/></g></svg>
              </button>
            </div>

            {(item.variant.compare_at_price && item.variant.compare_at_price > item.variant.price) ?
                <p className="flex flex-col items-end text-base">
                  <span className="font-bold">${money(item.price * item.quantity)}</span>
                  <span className="small-text line-through">${money(item.variant.compare_at_price * item.quantity)}</span>
                </p>
              :
                <p className="text-base font-bold">
                  ${money(item.price * item.quantity)}
                </p>
            }
          </div>
        </div>
      </div>
      {item.product.selling_plan.length > 0 &&
        <SubscriptionUpsell data={ item } swapSubscription={() => data.setCartProcessing(true)} />
      }
    </div>
  );
};

export default CartItem;
