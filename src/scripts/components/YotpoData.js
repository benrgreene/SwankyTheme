const APIKEY = 'aAwwPwEU5koJPrLPvBAAo3RXaEpJlqm1KxCZMrcu';

window.formatReviewDate = (oldDate) => {
  return new Date(oldDate).toLocaleDateString();
};

const fetchPageReviews = (pageOn = 1) => {
  const { product } = window.brg;
  const url = `https://api-cdn.yotpo.com/v3/storefront/store/${APIKEY}/product/${product.id}/reviews?page=${pageOn}`;

  fetch(url)
    .then((blob) => blob.json())
    .then((response) => {
      console.log(response);
      Alpine.store('productInfo').setProductReviews(response);
    })
};

export const fetchProductReviews = () => {
  fetchPageReviews();
};