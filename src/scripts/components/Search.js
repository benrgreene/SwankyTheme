const searchSite = (searchTerm) => {
  fetch(`/search/suggest.json?q={${searchTerm}}`)
    .then((blob) => blob.json())
    .then((results) => {
      Alpine.store('layoutInfo').setSearchResults(results.resources.results);
    });
};
window.searchSite = searchSite;