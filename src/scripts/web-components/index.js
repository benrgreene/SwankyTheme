const createWebCompClass = (idToPull, attributesToObserve = [], attributesToUpdate = []) => {
	return class extends HTMLElement {
		constructor () {
			super();
		}

		static get observedAttributes() { 
	    return attributesToObserve;
	  }

	  setInnerHTMLForAttribute = (attribute) => {
	  	const attributeValue = this.getAttribute(attribute);
      const elementsToUpdate = this.querySelectorAll(`[data-item-${attribute}]`) || [];
      elementsToUpdate.forEach((el) => el.innerHTML = attributeValue);
	  }

	  setAttrsForAttribute = (attribute) => {
	  	const attributeValue = this.getAttribute(attribute);
    	const elementsToUpdate = this.querySelectorAll(`[data-attr-${attribute}]`) || [];
    	elementsToUpdate.forEach((el) => {
    		const attributeToSet = el.getAttribute(`data-attr-${attribute}`);
    		el.setAttribute(attributeToSet, attributeValue);
    	});
	  }

	  attributeChangedCallback (attribute, oldValue, newValue) {
      this.setInnerHTMLForAttribute(attribute);
	    this.setAttrsForAttribute(attribute);
	  }

		connectedCallback() {
			const template = document.querySelector(`#${idToPull}`);
			this.innerHTML = '';
			this.appendChild(template.content.cloneNode(true));

			// set inner html for elements watching observed attributes
			attributesToObserve.forEach((attribute) => {
	      this.setInnerHTMLForAttribute(attribute);
	    });

			// set any data attributes based on observed attributes
	    attributesToUpdate.forEach((attribute) => {
	    	this.setAttrsForAttribute(attribute);
	    });
		}
	}
}

document.addEventListener("DOMContentLoaded", () => {
	customElements.define('cart-item', createWebCompClass('component-cart-item'));
	customElements.define('filter-list', createWebCompClass('component-filter-list'));

	customElements.define(
		'product-tile', 
		createWebCompClass(
			'component-product-tile',
			['title', 'price', 'href', 'image'],
			['title', 'href', 'image']
		)
	);
});