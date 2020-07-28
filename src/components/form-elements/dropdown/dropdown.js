import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min';
import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min.css';

// Функция закрытия/открытия дропдауна
const toggleDropDown = (event) => {
  const target = event.target;
  const dropdownOpen = $('.iqdropdown.menu-open')
  const dropdown = target.closest('.iqdropdown')
  const dropdownSelection = target.closest('.iqdropdown-selection')
  const dropdownControls = target.closest('.iqdropdown__controls')
  const applyButton = target.closest('.button_link:not(.button_link_clear)')
  const clearButton = target.closest('.button_link.button_link_clear')

  if ((dropdownSelection || applyButton) && !clearButton) {
    $(dropdown).toggleClass('menu-open')
    $(dropdownOpen[0]).removeClass('menu-open')
  } else if (!clearButton && !dropdownControls) {
    $(dropdownOpen[0]).removeClass('menu-open')
  }
}


/*
  *********************************************
  =============================================
  *********************************************
*/

const iqDropdownInit = (dropdown) => {
  $(dropdown).iqDropdown({
    setSelectionText(itemsCount, totalItems) {
      if (!totalItems) {
        return $(dropdown).data('title');
      }

      function chooseDeclension(optionId, itemsCount) {
        const totalItemsEnd = parseInt(itemsCount.toString().split('').pop())

        const option = $(`#${dropdown.id} .iqdropdown-menu-option[data-id="${optionId}"`)
        let declensionText = option.data('declensions')[2] //5+
        if ([2, 3, 4].indexOf(totalItemsEnd) != -1 && (itemsCount < 12 || itemsCount > 21)) {
          declensionText = option.data('declensions')[1] //2-4
        } else if (itemsCount === 1 || totalItemsEnd === 1 && itemsCount > 20) {
          declensionText = option.data('declensions')[0] //1
        }
        return declensionText
      }
      
      if (itemsCount.item3 > 0) {
        const text = chooseDeclension('item1', totalItems - itemsCount.item3)
        const textInfants = chooseDeclension('item3', itemsCount.item3)
        return `${totalItems - itemsCount.item3} ${text}, ${itemsCount.item3} ${textInfants}`
      } else {
        return `${totalItems} ${chooseDeclension('item1', totalItems)}`;
      }
    },
    onChange: (id, count, totalItems) => {
      const buttonIncrement = $(`#${dropdown.id} [data-id='${id}'] .button-increment`)
      const buttonDecrement = $(`#${dropdown.id} [data-id='${id}'] .button-decrement`)
      if (count === $(`#${dropdown.id} [data-id='${id}']`).data('maxcount')) {
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
        $(`#${dropdown.id} .iqdropdown__button.button_link_clear`).removeClass('button_link_clear_hidden')
        :
        $(`#${dropdown.id} .iqdropdown__button.button_link_clear`).addClass('button_link_clear_hidden')

    },
    
  });
  $('.button-decrement').prop('disabled', true);
  $('.button-decrement').addClass('button-decrement_disabled');
  $('.icon-decrement').text('-');
  $('.icon-increment').text('+');

  // удаление события клика по дропдауну
  $('.iqdropdown').off('click')

  // Кнопка "очистить"
  if ($(`#${dropdown.id} .iqdropdown__controls`).length) {
    $(`#${dropdown.id} .button_link_clear`).click(clearFn)
  }
}


// Инициализация дропдауна после загрузки страницы
$(document).ready(function () {
  const iqdropdowns = $('.iqdropdown')
  for (let iqdropdown of iqdropdowns) {
    iqDropdownInit(iqdropdown)
  }
});

const iqdMenus = $('.iqdropdown-menu')
const iqdMenusHTMLs = {}
for (let iqdMenu of iqdMenus) {
  let id = iqdMenu.parentNode.id
  iqdMenusHTMLs[id] = ($(iqdMenu).html())
}


// Функция очистки iqDropdown
const clearFn = (event) => {
  const target = event.target;
  const dropdownMenu = target.closest('.iqdropdown-menu')
  const dropdown = target.closest('.iqdropdown')
  $(dropdownMenu).html(iqdMenusHTMLs[dropdown.id])
  iqDropdownInit(dropdown)
}

// Проверка на нажатие внутри/вне дропдауна и закрытие его
$('.iqdropdown-selection').click(toggleDropDown)
