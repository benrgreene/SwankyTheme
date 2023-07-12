import React, { useState, useEffect } from "react";

import { addEffect } from 'scripts/utils/Effects.js';
import { fetchProductReviews } from './utils/fetchReviews.js';

const Pagination = () => {
  const [reviewState, setReviewState] = useState(window.state.yotpoReviewData || false);
  useEffect(addEffect('yotpoReviewData', setReviewState), []);

  const pageOn = reviewState ? reviewState.pagination.page : false;
  const maxPages = reviewState ? Math.ceil(reviewState.pagination.total * 1.0 / reviewState.pagination.perPage) : 0;
  const pageArray = [...Array(maxPages).keys()];

  const setPage = (pageNumber) => {
    const safePageNumber = Math.max(1, Math.min(pageNumber, maxPages));
    fetchProductReviews({
      pageOn: pageNumber
    });
  };

  return (
    <div className="mt-6 ccontain flex items-center justify-between">
      {reviewState &&
        <>
          <button onClick={() => setPage(pageOn - 1)}>
            prev
          </button>

          <div className="flex items-center gap-x-5">
            {pageArray.map((buttonOn) =>
              <button onClick={() => setPage(buttonOn + 1)}
                      className={`text-black hover:text-grey-7 ${Math.abs(pageOn - buttonOn - 1) > 2 ? 'hidden' : ''} lg:inline`}
                      key={`yotpo-pagination-${buttonOn}`}>
                {buttonOn + 1}
              </button>
            )}
          </div>

          <button onClick={() => setPage(pageOn + 1)}>
            next
          </button>
        </>
      }
    </div>
  );
};

export default Pagination;