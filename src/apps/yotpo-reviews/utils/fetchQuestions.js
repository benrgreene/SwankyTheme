export const getProductQuestions = ({ page = 1 }) => {
  if (window.state.yotpoAppData.displayQuestions !== 'yes') return;
  const { apiKey, productID } = window.state.yotpoAppData;
  const url = `https://api.yotpo.com/products/${apiKey}/${productID}/questions?page=${page}`;

  fetch(url)
    .then((blob) => blob.json())
    .then(({ response }) => {
      window.setState('YotpoQuestions', response);
    })
}

