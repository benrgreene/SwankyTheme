import React, { useState, useEffect } from "react";

import BottomLine from './BottomLine.jsx';
import ReviewsList from './ReviewsList.jsx';
import Pagination from './Pagination.jsx';
import Questions from './Questions.jsx';

import { fetchProductReviews } from './utils/fetchReviews.js';
import { getProductQuestions } from './utils/fetchQuestions.js';

import { addEffect } from 'scripts/utils/Effects.js';

const YotpoReviewsApp = ({ data }) => {
  const [selectedPane, setSelectedPane] = useState('reviews');
  useEffect(addEffect('yotpoSelectedPane', setSelectedPane), []);

  window.setState('yotpoAppData', data);
  fetchProductReviews({});
  getProductQuestions({});

  return (
    <div>
      <BottomLine />

      {(selectedPane === 'questions' && data.displayQuestions === 'yes') &&
        <div>
          <Questions />
        </div>
      }
      {selectedPane === 'reviews' &&
        <div>
          <ReviewsList />
          <Pagination />
        </div>
      }
    </div>
  );
};

export default YotpoReviewsApp;