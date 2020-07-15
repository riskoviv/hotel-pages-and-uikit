import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min';
import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min.css';

const iqdInitialHTML = 
  `
  <p class="iqdropdown-selection" data-selection-text="гость" data-text-plural="гостей"></p>
  <div class="iqdropdown-menu">
    <div class="iqdropdown-menu-option" data-id="item1" data-maxcount="5">
      <div>
        <p class="iqdropdown-item">Взрослые</p>
      </div>
    </div>
    <div class="iqdropdown-menu-option" data-id="item2" data-maxcount="5">
      <div>
        <p class="iqdropdown-item">Дети</p>
      </div>
    </div>
    <div class="iqdropdown-menu-option" data-id="item3" data-maxcount="3">
      <div>
        <p class="iqdropdown-item">Младенцы</p>
      </div>
    </div>
    <div class="iqdropdown__controls">
      <button class="iqdropdown__button button button_link button_link_clear button_link_clear_hidden">Очистить</button>
      <button class="iqdropdown__button button button_link">Применить</button>
    </div>
  </div>
  `

// Функция очистки iqDropdown
const clearFn = () => {
  $('.iqdropdown#guestsSelect').html(iqdInitialHTML)
  iqDropdownInit()
}

const closeDropDown = (event) => {
  const target = event.target;
  const dropdown = target.closest('.iqdropdown#guestsSelect .iqdropdown-selection')
  const iqdropdownMenu = target.closest('.iqdropdown#guestsSelect .iqdropdown-menu')
  const applyButton = target.closest('.iqdropdown#guestsSelect .button_link:not(.button_link_clear)')
  const clearButton = target.closest('.iqdropdown#guestsSelect .button_link_clear')
  console.log('dropdown: ', dropdown);
  console.log('iqdropdownMenu: ', iqdropdownMenu);
  console.log('applyButton: ', applyButton);
  console.log('clearButton: ', clearButton);
  
  if (dropdown) {
    $('.iqdropdown#guestsSelect').toggleClass('menu-open')
  }  
  if (!dropdown && !iqdropdownMenu && !clearButton || applyButton) {
    $('.iqdropdown#guestsSelect').removeClass('menu-open')
  }
}

/*
  *********************************************
  *********************************************
*/

const iqDropdownInit = () => {
  $('.iqdropdown#guestsSelect').iqDropdown({
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
        
        let textInfants = 'младенцев'
        if ([2, 3, 4].indexOf(infantsCountEnd) != -1 && (infantsCount < 12 || infantsCount > 21)) {
          textInfants = 'младенца'
        } else if (infantsCount === 1 || infantsCountEnd === 1 && infantsCount > 20) {
          textInfants = 'младенец'
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
        buttonIncrement.addClass('button-increment_disabled')
      }
      else if (!count) {
        buttonDecrement.prop('disabled', true)
        buttonDecrement.addClass('button-decrement_disabled')
      }
      else {
        buttonIncrement.removeAttr('disabled')
        buttonDecrement.removeAttr('disabled')
        buttonIncrement.removeClass('button-increment_disabled')
        buttonDecrement.removeClass('button-decrement_disabled')
      }

      totalItems ?
        $('.iqdropdown__button.button_link_clear').removeClass('button_link_clear_hidden')
        :
        $('.iqdropdown__button.button_link_clear').addClass('button_link_clear_hidden')

    },
    
  });
  $('.button-decrement').prop('disabled', true);
  $('.button-decrement').addClass('button-decrement_disabled');
  $('.icon-decrement').text('-');
  $('.icon-increment').text('+');

  const dropdown = $('.iqdropdown#guestsSelect')
  dropdown.off('click')

  // Кнопка "очистить"
  $('.iqdropdown#guestsSelect .button_link_clear').click(clearFn)
    
}

$(document).ready(iqDropdownInit);

// Кнопка "очистить"
$('.iqdropdown#guestsSelect .button_link_clear').click(clearFn)
// Проверка на нажатие вне дропдауна
$(document).click(closeDropDown)