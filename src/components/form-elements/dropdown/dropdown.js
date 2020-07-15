import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min';
import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min.css';

$(document).ready(() => {
  $('.iqdropdown').iqDropdown({
    setSelectionText(itemCount, totalItems) {
      if (!totalItems) {
        return 'Сколько гостей';
      }
      const numEnd = parseInt(totalItems.toString().split('').pop())
      
      const usePlural = totalItems !== 1 && this.textPlural.length > 0;
      let text = usePlural ? this.textPlural : this.selectionText;
      if ([2, 3, 4].indexOf(numEnd) != -1 && totalItems < 12) {
        text = 'гостя'
      } else if (totalItems === 1) {
        text = 'гость'
      }

      return `${totalItems} ${text}`;
    },
    onChange: (id, count, totalItems) => {
      const buttonIncrement = $(`[data-id='${id}'] .button-increment`)
      const buttonDecrement = $(`[data-id='${id}'] .button-decrement`)
      if (count === $(`[data-id='${id}']`).data('maxcount')) {
        buttonIncrement.addClass('button-increment_disabled')
      }
      else if (!count) {
        buttonDecrement.addClass('button-decrement_disabled')
      }
      else {
        buttonIncrement.removeClass('button-increment_disabled')
        buttonDecrement.removeClass('button-decrement_disabled')
      }
    },
  });
  $('.button-decrement').addClass('button-decrement_disabled');
  $('.icon-decrement').text('-');
  $('.icon-increment').text('+');
});