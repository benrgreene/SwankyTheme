import React, { useState, useEffect } from 'react';

import { addEffect } from 'scripts/utils/Effects.js';
import { resizeImage } from 'scripts/utils/Images.js';
import { getProductBadge } from 'scripts/utils/Product.js';

const Gallery = () => {
  const { product } = window.brg;
  const badge = getProductBadge(product);

  const [selectedVariant, setSelectedVariant] = useState(window.state.selectedVariant || false);

  useEffect(addEffect('selectedVariant', (newSelected) => {
    setTimeout(() => setSelectedVariant(newSelected), 100);
  }), []);

  const media = (selectedVariant && selectedVariant.images.length > 0) ? selectedVariant.images : product.media;

  return (
    <div className="relative overflow-hidden">
      {badge &&
        <p className={`absolute top-2 left-6 px-3 py-1 text-small bg-grey-3 text-${badge.color}`}>
          {badge.tag}
        </p>
      }
      <div className="pb-2 grid grid-cols-2 gap-x-4 gap-y-6">
        {media.map((media, mediaIndex) =>
          <img className={`w-[70vw] lg:w-full h-full snap-center object-cover ${mediaIndex === 0 ? 'col-span-2' : ''}`}
               dialogr-img="true"
               src={resizeImage(media.variant_image, 'x700')}
               alt={media.image_alt_text}
               key={`image-${mediaIndex}`} />
        )}
      </div>
    </div>
  );
};

export default Gallery;