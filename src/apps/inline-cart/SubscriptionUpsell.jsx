import React from 'react';

import { upgradeToSubscription, switchToOneTime } from '../../scripts/utils/Recharge';

const SubscriptionUpsell = (props) => {
  const lineItem = props.data;
  const planOptions = lineItem.product.selling_plan[0].selling_plans;
  const selectedPlanName = lineItem.selling_plan_allocation ? lineItem.selling_plan_allocation.selling_plan.name : false;
  const selectedPlan = lineItem.product.selling_plan[0].selling_plans.find((plan) => {
    return selectedPlanName === plan.name;
  });

  const setNewSubscriptionPlan = (event) => {
    const newPlan = event.target.value;
    if (newPlan === 'one-time') {
      switchToOneTime(lineItem);
    } else {
      upgradeToSubscription(lineItem, newPlan);
    }
  };

  return (
    <div className="mt-4">
      {selectedPlan
        ? <div className="w-full select-wrap">
            <select value={selectedPlan.id}
                    onChange={(event) => { props.swapSubscription(); setNewSubscriptionPlan(event); }}
                    className="w-full small-text">
              <optgroup label="One Time">
                <option value="one-time">
                  One Time
                </option>
              </optgroup>
              <optgroup label="Subscribe & Save">
                {planOptions.map((option, optionIndex) =>
                  <option key={`selling-plan-${optionIndex}`}
                          value={option.id}>
                    {option.name}
                  </option>
                )}
              </optgroup>
            </select>
          </div>
        : <button className="w-full button button--outline button--short small-text"
                  onClick={() => { props.swapSubscription(); upgradeToSubscription(lineItem, planOptions[0].id); }}>
            <span className="lg:hidden">Subscribe & Save 10%</span>
            <span className="hidden lg:inline">Upgrade to Subscription & Save 10%</span>
          </button>
      }
    </div>
  )
};

export default SubscriptionUpsell;