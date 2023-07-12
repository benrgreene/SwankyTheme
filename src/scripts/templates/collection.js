import { performProductFetch, setupActiveFilters } from 'scripts/components/ProductGrid';

document.addEventListener('DOMContentLoaded', () => {
  setupActiveFilters();
	performProductFetch({
		getFilters: true,
		collectionID: window.brg.collection.handle,
	});
});