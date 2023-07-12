export const fetchProductReviews = ({ pageOn = 1 }) => {
  const { apiKey, productID } = window.state.yotpoAppData;
  const url = `https://api-cdn.yotpo.com/v3/storefront/store/${apiKey}/product/${productID}/reviews?page=${pageOn}`;

  fetch(url)
    .then((blob) => blob.json())
    .then((response) => {
      console.log(response);
      window.setState('yotpoCurrentReviews', response.reviews);
      window.setState('yotpoReviewData', response);
    })
};