import React from "react";

const StarRating = ({ rating, id }) => {
  const halfRatingCheck = rating - 1;
  const keys = [...Array(5).keys()];

  const getIconName = (index) => {
    if (index <= rating && index <= halfRatingCheck) return 'icon-star-full';
    if (index < rating && index > halfRatingCheck) return 'icon-star-half';
    return 'icon-star-empty';
  }

  return (
    <span className="inline-flex items-center text-primary">
      {keys.map((keyName, index) =>
        <svg className="w-4 h-4" key={`star-key-${id}-${index}`}>
          <use href={`#${getIconName(index)}`} />
        </svg>
      )}
    </span>
  );
};

export default StarRating;