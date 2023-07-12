import { cacheDom }  from 'scripts/utils/QuerySelectors.js';
import { setupObservers } from 'scripts/utils/LazyLoad.js';

const state = {
  transitionTime: 750,
  isTransitioning: false,
};

const dom = {};
const qsAll = {
  sliders: 'data-snap-slider',
  prevButtons: 'data-snap-previous',
  nextButtons: 'data-snap-next',
};
const refs = {
  slider: 'data-for-slider',
  slideOn: 'data-on-slide',
  slides: 'data-snap-slide',
  visibleSlides: 'data-visible-slide',
};


const setSlideIsVisible = (slide, observer, isIntersecting) => {
  if (isIntersecting) {
    slide.setAttribute(refs.visibleSlides, 'true');
  } else {
    slide.removeAttribute(refs.visibleSlides);
  }
};


const getSliderForButton = (button) => {
  const sliderID = button.getAttribute(refs.slider);
  return dom.sliders.find((slider) => {
    return slider.getAttribute(refs.slider) === sliderID;
  });
};


const getNewScrollPos = (current, modifier, sliderLength) => {
  const newPosition = current + modifier;
  if (newPosition < 0) return sliderLength;
  if (newPosition > sliderLength) return 0;
  return newPosition;
};


const moveSlider = (event, direction) => {
  if (state.isTransitioning) return;
  state.isTransitioning = true;
  setTimeout(() => state.isTransitioning = false, state.transitionTime);

  const slider = getSliderForButton(event.target);
  const slideOn = parseInt(slider.getAttribute(refs.slideOn)) || 0;
  const slides = document.querySelectorAll(`[${refs.slides}]`);
  const slideWidth = slides[0].getBoundingClientRect().width;
  const visibleSlides = document.querySelectorAll(`[${refs.visibleSlides}]`);

  let newSlide = slideOn + direction;
  if (newSlide < 0 ) {
    newSlide = slides.length - visibleSlides.length;
  } else if (newSlide > slides.length - visibleSlides.length) {
    newSlide = 0;
  }

  slider.scrollTo({ behavior: 'smooth', left: slideWidth * newSlide });
  slider.setAttribute(refs.slideOn, newSlide);
};


export const setupSnapSlider = () => {
  cacheDom(dom, {}, qsAll);

  dom.prevButtons.forEach((button) => {
    button.addEventListener('click', (event) => moveSlider(event, -1));
  });

  dom.nextButtons.forEach((button) => {
    button.addEventListener('click', (event) => moveSlider(event, 1));
  });

  dom.sliders.forEach((slider) => {
    setupObservers({
      queryString: `[${refs.slider}="${slider.getAttribute(refs.slider)}"] [${refs.slides}]`,
      callback: setSlideIsVisible,
      root: slider,
      threshold: 1.0
    });
  });
};