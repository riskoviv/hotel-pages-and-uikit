// import $ from 'jquery';
// window.$ = window.jQuery = require('jquery');
// window.iqdropdown = require('item-quantity-dropdown');
// require('item-quantity-dropdown/lib/item-quantity-dropdown.css');

import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min';
import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min.css';

$(document).ready(() => {
  $('.iqdropdown').iqDropdown();
});