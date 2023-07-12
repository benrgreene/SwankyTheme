import { cacheDom } from 'scripts/utils/QuerySelectors.js';

const dom = {};
const qs = {
  forgotPassword: 'data-forgot-password',
  passwordModal: 'data-forgot-modal'
};
const qsAll = {
  closeModal: 'data-close-forgot-modal'
}

export const setupLoginForm = () => {
	cacheDom(dom, qs, qsAll);

  dom.forgotPassword && dom.forgotPassword.addEventListener('click', () => {
    if (dom.passwordModal) {
      dom.passwordModal.show();
    }
  });

  dom.closeModal.forEach((closeButton) => {
    closeButton.addEventListener('click', (event) => {
      event.preventDefault();
      dom.passwordModal.close();
    });
  });
};
