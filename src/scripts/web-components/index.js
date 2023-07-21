const createWebCompClass = (idToPull) => {
	return class extends HTMLElement {
		constructor () {
			super();
			const template = document.querySelector(`#${idToPull}`);
			this.appendChild(template.content.cloneNode(true));
		}
	}
}

document.addEventListener("DOMContentLoaded", () => {
	customElements.define('product-tile', createWebCompClass('component-product-tile'));
	customElements.define('filter-list', createWebCompClass('component-filter-list'));
});