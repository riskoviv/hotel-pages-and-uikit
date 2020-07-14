// import $ from 'jquery';
// window.$ = window.jQuery = require('jquery');
// window.iqdropdown = require('item-quantity-dropdown');
// require('item-quantity-dropdown/lib/item-quantity-dropdown.css');

import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min';
import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min.css';

$(document).ready(() => {
  $('.iqdropdown').iqDropdown({
    setSelectionText(itemCount, totalItems) {
      if (!totalItems) {
        return 'Сколько гостей';
      }
      const usePlural = totalItems !== 1 && this.textPlural.length > 0;
      const text = usePlural ? this.textPlural : this.selectionText;
      return `${totalItems} ${text}`;
    },
    onChange: (id, count, totalItems) => {
      // console.log(maxCount);
      $('.button-increment').addClass('button-increment_disabled');
      // if (count === maxCount) {
      //   $(`${id} .button-increment`).addClass('button-increment_disabled')
      // }
      // else if (count === minCount) {
      //   $(`${id} .button-decrement`).addClass('button-decrement_disabled')
      // }
    },
  });
  $('.icon-decrement').text('-');
  $('.icon-increment').text('+');
});