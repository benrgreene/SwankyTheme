import React, { useState, useEffect } from 'react';

import { getProductBadge } from 'scripts/utils/Product.js';
import { addEffect } from 'scripts/utils/Effects.js';

import { resizeImage } from 'scripts/utils/Images.js';

const ProductTitle = (props) => {
  const { id, title, image, handle, price, tags, description, reviewScore } = props.data;

  const badgeToDisplay = getProductBadge({ tags: tags });
  const halfRatingCheck = reviewScore - 1;
  const keys = [...Array(5).keys()];

  const getIconName = (index) => {
    if (index <= reviewScore && index <= halfRatingCheck) return 'icon-star-full';
    if (index < reviewScore && index > halfRatingCheck) return 'icon-star-half';
    return 'icon-star-empty';
  }

  return (
    <article>
      <a className="group no-underline"
         href={`/products/${handle}`}>
        <figure className="relative">
          <picture className="relative block w-full h-0 pb-[100%] overflow-hidden">
            <img className="absolute top-0 left-0 right-0 h-full object-cover transform scale-100 group-hover:scale-105 transition duration-300"
                 src={image ? image.src : ''}
                 alt={image && image.alt ? image.alt : title} />
          </picture>
          <figcaption className="mt-4">
            {badgeToDisplay &&
              <p className={`absolute top-2 right-6 px-3 py-1 text-small bg-grey-3 text-${badgeToDisplay.color}`}>
                {badgeToDisplay.tag}
              </p>
            }
            {reviewScore &&
              <span className="inline-flex items-center text-primary">
                {keys.map((keyName, index) =>
                  <svg className="w-5 h-5" viewBox="0 0 576 512" key={`star-key-${id}-${index}`}>
                    <use href={`#${getIconName(index)}`} />
                  </svg>
                )}
              </span>
            }
            <p className="sub-regular">
              {title}
            </p>
            {description &&
              <p className="mt-2 text-small text-dark-grey hidden"
                 dangerouslySetInnerHTML={{ __html: description }}>
              </p>
            }
            <p className="mt-2 sub-regular">
              {`$${(price / 100.0).toFixed(2)}`}
            </p>
          </figcaption>
        </figure>
      </a>
    </article>
  );
};

export default ProductTitle;
