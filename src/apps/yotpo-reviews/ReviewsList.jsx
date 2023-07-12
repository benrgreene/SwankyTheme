import React, { useState, useEffect } from "react";

import Review from './Review.jsx';

import { addEffect } from 'scripts/utils/Effects.js';

const ReviewsList = () => {
  const [currentReviews, setCurrentReviews] = useState(window.state.yotpoCurrentReviews || false);

  useEffect(addEffect('yotpoCurrentReviews', setCurrentReviews), []);

  return (
    <div className="ccontain">
      {currentReviews &&
        <div>
          {currentReviews.map((review, reviewIndex) =>
            <Review key={`product-review-${reviewIndex}`}
                    review={review} />
          )}
        </div>
      }
    </div>
  );
};

export default ReviewsList;