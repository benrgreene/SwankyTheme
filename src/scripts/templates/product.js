import { setPreviousProductLink } from 'scripts/components/ProductPositioner.js';
import { setupDialogr } from 'scripts/components/Dialogr.js';
import { fetchProductReviews } from 'scripts/components/YotpoData.js';

import 'scripts/utils/Product.js';

document.addEventListener('DOMContentLoaded', () => {
  setPreviousProductLink();
  setupDialogr();
  fetchProductReviews();
});

window.goToGallery = (index) => {
  const image = document.querySelector(`[gallery-image="gallery-image-${index}"]`);
  image.scrollIntoView({ 
    behavior: 'smooth',
    block: 'nearest' 
  });
}