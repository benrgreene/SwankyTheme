import { cacheDom }  from 'scripts/utils/QuerySelectors.js';
import CustomerAddresses from './ShopifyAddressWrapper.js';

const dom = {};

const qs = {
  openAddress: 'data-edit-address',
  editModal: 'data-edit-address-modal'
};

const qsAll = {
  closeButtons: 'data-hide-address-form',
  countrySelects: 'data-country-selects',
  provinceSelects: 'data-province-selects',
};

export const setupAddresses = () => {
  cacheDom(dom, qs, qsAll);

  if (!dom.editModal) return;

  dom.openAddress.addEventListener('click', () => {
    dom.editModal.show();
    
    dom.countrySelects.forEach((select) => {
      const formId = select.dataset.formId;
      new Shopify.CountryProvinceSelector(`AddressCountry_${formId}`, `AddressProvince_${formId}`, {
        hideElement: `AddressProvinceContainer_${formId}`
      });
    });
  });

  dom.closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      dom.editModal.close();
    });
  });
};