import { setupLoginForm } from 'scripts/components/login.js';
import { setupAddresses } from 'scripts/components/Addresses.js';

document.addEventListener('DOMContentLoaded', () => {
  setupLoginForm();
  setupAddresses();
});
