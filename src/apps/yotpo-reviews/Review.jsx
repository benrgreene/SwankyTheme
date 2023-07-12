import React, { useState, useEffect } from "react";

import StarRating from './StarRating.jsx';

import { voteHistory, reviewVoteChange } from './utils/Voting.js';

const Review = ({ review }) => {
  const reviewVote = voteHistory(review.id);
  const [vote, setVote] = useState(false);

  const timestamp = new Date(Date.parse(review.createdAt));
  const formattedTime = `${timestamp.getMonth() + 1}/${timestamp.getDay() + 1}/${timestamp.getFullYear()}`;

  const castVote = (type) => {
    reviewVoteChange(review.id, type);
    if (type === vote) {
      setVote(false);
    } else {
      setVote(type);
    }
  }

  return (
    <div className="mt-3 py-4 px-6 flex flex-col-reverse lg:flex-row-reverse bg-grey-1">
      <div className="grow">
        <div className="flex justify-between">
          <h3 className="h6" dangerouslySetInnerHTML={{ __html: review.title }}></h3>
          <p className="text-xsmall">
            {formattedTime}
          </p>
        </div>
        <div className="my-4"
             dangerouslySetInnerHTML={{ __html: review.content }}></div>
        <div className="flex justify-between">
          <p></p>
          <div data-vote={vote}>
            <button className="mr-3"
                    onClick={() => castVote('down')}>
              downvote {reviewVote === 'down' ? review.votesDown + 1 : review.votesDown}
            </button>
            <button onClick={() => castVote('up')}>
              upvote {reviewVote === 'up' ? review.votesUp + 1 : review.votesUp}
            </button>
          </div>
        </div>
      </div>
      <div className="lg:w-[15rem] shrink-0 flex items-start">
        <div className="mr-6 rounded-full w-10 h-10 flex items-center justify-center h5 bg-primary">
          {review.user.displayName.charAt(0)}
        </div>
        <div>
          <p>{review.user.displayName}</p>
          {review.verifiedBuyer &&
            <p className="text-small">
              Verified Buyer
            </p>
          }
          <StarRating rating={review.score}
                      id={review.id} />
        </div>
      </div>
    </div>
  );
};

export default Review;