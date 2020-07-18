import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min';
import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min.css';

// Функция закрытия/открытия дропдауна
const closeDropDown = (event) => {
  const target = event.target;
  const dropdown = $('.iqdropdown.dropdown_guests')
  const dropdownSelection = target.closest('.iqdropdown-selection')
  const applyButton = target.closest('.button_link:not(.button_link_clear)')
  const clearButton = target.closest('.button_link.button_link_clear')

  if ((dropdownSelection || applyButton) && !clearButton) {
    dropdown.toggleClass('menu-open')
  } else if (!clearButton) {
    dropdown.removeClass('menu-open')
  }
}


/*
  *********************************************
  =============================================
  *********************************************
*/

const iqDropdownInit = () => {
  $('.iqdropdown.dropdown_guests').iqDropdown({
    setSelectionText(itemsCount, totalItems) {
      if (!totalItems) {
        return $('.iqdropdown').data('title');
      }

      function checkDeclension(optionId, itemsCount) {
        const totalItemsEnd = parseInt(itemsCount.toString().split('').pop())

        const option = $(`.iqdropdown-menu-option[data-id="${optionId}"`)
        let declensionText = option.data('declensions')[2] //'младенцев'
        if ([2, 3, 4].indexOf(totalItemsEnd) != -1 && (itemsCount < 12 || itemsCount > 21)) {
          declensionText = option.data('declensions')[1] //'младенца'
        } else if (itemsCount === 1 || totalItemsEnd === 1 && itemsCount > 20) {
          declensionText = option.data('declensions')[0] //'младенец'
        }
        return declensionText
      }
      
      if (itemsCount.item3 > 0) {
        const text = checkDeclension('item1', totalItems - itemsCount.item3)
        const textInfants = checkDeclension('item3', itemsCount.item3)
        return `${totalItems - itemsCount.item3} ${text}, ${itemsCount.item3} ${textInfants}`
      } else {
        return `${totalItems} ${checkDeclension('item1', totalItems)}`;
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

      // Отображение/скрытие кнопки очистить
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

  // удаление события клика по дропдауну
  $('.iqdropdown.dropdown_guests').off('click')

  // Кнопка "очистить"
  if ($('.iqdropdown__controls').length) {
    $('.iqdropdown.dropdown_guests .button_link_clear').click(clearFn)
  }
}


// Инициализация дропдауна после загрузки страницы
$(document).ready(function () {
  iqDropdownInit()
});

const idqMenuHTML = $('.iqdropdown-menu').html()

// Функция очистки iqDropdown
const clearFn = () => {
  $('.iqdropdown.dropdown_guests .iqdropdown-menu').html(idqMenuHTML)
  iqDropdownInit()
}

// Проверка на нажатие вне дропдауна и закрытие его
$(document).click(closeDropDown)
