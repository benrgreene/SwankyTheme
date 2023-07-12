import { cacheDom }  from '../utils/QuerySelectors.js';
import { resizeImage } from '../utils/Images.js';

const dom = {};
const qs = {
	dialogr: 'dialogr',
	content: 'dialog-content',
};
const qsAll = {
	closeDialog: 'dialogr-close',
	dialogImg: 'dialogr-img',
};

export const setupDialogr = () => {
	const dialogrEl = document.createElement('dialog');
	dialogrEl.setAttribute(qs.dialogr, 'true');
	dialogrEl.classList.add('dialogr');
	dialogrEl.innerHTML = `
		<button dialogr-close class="dialogr__close" aria-label="close modal"></button>
		<div class="dialogr__content">
			<img dialog-content class="dialogr__image" />
		</div>
	`;
	document.body.appendChild(dialogrEl);

	cacheDom(dom, qs, qsAll);

	document.addEventListener('click', (event) => {
		if (event.target.getAttribute(qsAll.dialogImg)) {
			const oldSource = event.target.getAttribute('src');
			const altTag = event.target.getAttribute('alt');
			dom.content.setAttribute('src', oldSource.replace('_850', '_1800'));
			dom.content.setAttribute('alt', altTag);
			dom.dialogr.showModal();
		}
	});

	dom.closeDialog.forEach((closeButton) => {
		closeButton.addEventListener('click', () => dom.dialogr.close());
	})
};
