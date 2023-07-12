import React, { useState, useEffect } from "react";

import StarRating from './StarRating.jsx';
import WriteAReview from './WriteAReview.jsx';

import { addEffect } from 'scripts/utils/Effects.js';

const BottomLine = () => {
  const [appState, setAppState] = useState(window.state.yotpoAppData || {});
  const [reviewState, setReviewState] = useState(window.state.yotpoReviewData || false);

  useEffect(addEffect('yotpoAppData', setAppState), []);
  useEffect(addEffect('yotpoReviewData', setReviewState), []);

  return (
    <div className="ccontain">
      <h2 className="h3 text-center">
        Reviews for {appState.productName}
      </h2>
      {reviewState &&
        <div className="flex items-center justify-center">
          <span>
            {reviewState.bottomline.averageScore.toFixed(1)}
          </span>
          <StarRating rating={reviewState.bottomline.averageScore}
                      id={appState.productID} />
          <span>
            {reviewState.bottomline.totalReview} reviews
          </span>
        </div>
      }
      <div className="flex justify-between items-center">
        <div className="flex gap-x-4">
          <button onClick={() => window.setState('yotpoSelectedPane', 'reviews')}>
            Reviews
          </button>
          {appState.displayQuestions === 'yes' &&
            <button onClick={() => window.setState('yotpoSelectedPane', 'questions')}>
              Questions
            </button>
          }
          </div>
        <WriteAReview />
      </div>
    </div>
  );
};

export default BottomLine;