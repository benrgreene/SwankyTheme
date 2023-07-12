export const fetchJSON = (url) => {
  return fetch(url)
          .then((blob) => blob.json());
};

export const fetchHTML = (url) => {
  return fetch(url)
          .then((blob) => blob.text());
};

export const fetchJSONTemplate = ({type = "products", handle}) => {
  return fetchJSON(`/${type}/${handle}?view=json`);
};
