import { setupObservers } from 'scripts/utils/LazyLoad.js';

const timeBetween = 300;
const qsAll = {
  tiles: 'data-animate-tiles'
};

const setProductVisible = (slide, observer, isIntersecting) => {
  if (isIntersecting) {
    const delay = parseInt(slide.getAttribute(qsAll.tiles));
    setTimeout(() => {
      slide.style.opacity = '1';
      slide.style.transform = 'scale(1)';
    }, timeBetween * delay);
    observer.unobserve(slide);
  }
}

export const setupAnimatedTiles = () => {
  setupObservers({
    queryString: `[${qsAll.tiles}]`,
    callback: setProductVisible,
    threshold: 0.5
  });
};