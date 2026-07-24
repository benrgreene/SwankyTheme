import { cacheDom }  from '../utils/QuerySelectors.js';

const dom = {};
const qsAll = {
  hazySrcsets: 'data-hazy-srcset',
  hazySrc: 'data-hazy-src'
};

export const setupHazyImages = () => {
  cacheDom(dom, {}, qsAll);

  dom.hazySrcsets.forEach((img) => {
    img.setAttribute('srcset', img.getAttribute(qsAll.hazySrcsets));
  });

  dom.hazySrc.forEach((img) => {
    img.setAttribute('src', img.getAttribute(qsAll.hazySrc));
  });
};