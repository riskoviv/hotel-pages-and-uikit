import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min';
import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min.css';

$(document).ready(() => {
  $('.iqdropdown').iqDropdown({
    setSelectionText(guestsCount, totalGuests) {
      if (!totalGuests) {
        return 'Сколько гостей';
      }

      const infantsCount = guestsCount.item3

      const checkGuests = (totalItems) => {
        const totalItemsEnd = parseInt(totalItems.toString().split('').pop())
        const infantsCountEnd = parseInt(infantsCount.toString().split('').pop())
        const usePlural = totalItems !== 1 && this.textPlural.length > 0;

        let text = usePlural ? this.textPlural : this.selectionText;
        if ([2, 3, 4].indexOf(totalItemsEnd) != -1 && (totalItems < 12 || totalItems > 21)) {
          text = 'гостя'
        } else if (totalItems === 1 || totalItemsEnd === 1 && totalItems > 20) {
          text = 'гость'
        }
        
        let textInfants = ''
        if ([2, 3, 4].indexOf(infantsCountEnd) != -1 && (infantsCount < 12 || infantsCount > 21)) {
          textInfants = 'младенца'
        } else if (infantsCount === 1 || infantsCountEnd === 1 && infantsCount > 20) {
          textInfants = 'младенец'
        } else {
          textInfants = 'младенцев'
        }

        return [text, textInfants]
      }
      
      if (infantsCount > 0) {
        const text = checkGuests(totalGuests - infantsCount)[0]
        const textInfants = checkGuests(totalGuests - infantsCount)[1]
        return `${totalGuests - infantsCount} ${text}, ${infantsCount} ${textInfants}`
      } else {
        return `${totalGuests} ${checkGuests(totalGuests)[0]}`;
      }
    },
    onChange: (id, count, totalItems) => {
      const buttonIncrement = $(`[data-id='${id}'] .button-increment`)
      const buttonDecrement = $(`[data-id='${id}'] .button-decrement`)
      if (count === $(`[data-id='${id}']`).data('maxcount')) {
        buttonIncrement.prop('disabled', true)
      }
      else if (!count) {
        buttonDecrement.prop('disabled', true)
      }
      else {
        buttonIncrement.removeAttr('disabled')
        buttonDecrement.removeAttr('disabled')
      }
    },
  });
  $('.button-decrement').prop('disabled', true);
  $('.icon-decrement').text('-');
  $('.icon-increment').text('+');
});