import { addToCart } from './Cart.js';

const getProductImages = (product, selectedVariant) => {
	if (selectedVariant && selectedVariant.images.length > 0) {
		return selectedVariant.images;
	}
	return product.media;
};

window.addProductToCart = () => {
	const { selectedVariant } = Alpine.store('productInfo');
	addToCart({
		id: selectedVariant.id,
		quantity: 1,
	});
}

window.setVariantFromOptions = (options) => {
	const { product } = Alpine.store('productInfo');
	const selectedValues = Object.values(options);
	const variant = product.variants.find((variant) => {
		return selectedValues.every((value) => variant.options.includes(value));
	});
	
	if (variant) {
		const { origin, pathname } = window.location;
		window.history.replaceState({}, '', `${origin}${pathname}?variant=${variant.id}`);
	}
	Alpine.store('productInfo').setImages(getProductImages(product, variant));
	Alpine.store('productInfo').setSelectedVariant(variant ? variant : { available: false });
};

document.addEventListener('DOMContentLoaded', () => {
	const { product, selectedVariant } = Alpine.store('productInfo');
	Alpine.store('productInfo').setImages(getProductImages(product, selectedVariant));	
});