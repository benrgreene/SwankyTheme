// Style loading
import '../../styles/theme.css';

// web components
import 'scripts/web-components/index.js';

//Components & Utils
import { setupObservers } from 'scripts/utils/LazyLoad.js';
import { setupFormFields } from 'scripts/components/FormErrors.js';
import { setupSnapSlider } from 'scripts/components/SnapSlider.js';
import { setupAnimatedTiles } from 'scripts/components/AnimatedProducts.js';
import { setupCartUpsells } from 'scripts/components/CartUpsells.js';
import { setupQuizSection } from 'scripts/components/QuizSection.js';

import 'scripts/components/Search.js';
import 'scripts/components/InlineCart.js';
import 'scripts/utils/Images.js';

import Timer from '@bva/countdown';

document.addEventListener("DOMContentLoaded", () => {
  setupObservers({});
  Timer.setup({});
  setupFormFields();
  setupSnapSlider();
  setupAnimatedTiles();
  setupCartUpsells();
  setupQuizSection();
});
