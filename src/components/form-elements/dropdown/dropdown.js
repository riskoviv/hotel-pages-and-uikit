import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min';
import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min.css';

// Функция закрытия/открытия дропдауна
const toggleDropDown = (event) => {
  const target = event.target;
  const openedDropdowns = $('.iqdropdown.menu-open')
  const currentDropdown = target.closest('.iqdropdown')
  const dropdownMenu = target.closest('.iqdropdown-menu')
  const dropdownControls = target.closest('.iqdropdown__controls')
  const applyButton = target.closest('.button_link:not(.button_link_clear)')
  const clearButton = target.closest('.button_link.button_link_clear')

  const closeNOTForceOpenedDropdowns = () => {
    for (let openedDropdown of openedDropdowns) {
      if (!$(openedDropdown).data('force-opened')) {
        $(openedDropdown).removeClass('menu-open')
      }
    }
  }

  if (currentDropdown && !dropdownMenu && !dropdownControls) {
    closeNOTForceOpenedDropdowns()
    $(currentDropdown).addClass('menu-open')
    
  } else if (!currentDropdown && !clearButton || applyButton) {
    closeNOTForceOpenedDropdowns()

  }
}

const iqDropdownInit = (dropdown) => {
  $(dropdown).iqDropdown({
    setSelectionText(itemsCount, totalItems) {
      if (!totalItems) {
        return $(dropdown).data('title');
      }

      function chooseDeclension(optionId, itemsCount) {
        const totalItemsEnd = parseInt(itemsCount.toString().split('').pop())

        const option = $(`#${dropdown.id} .iqdropdown-menu-option[data-id="${optionId}"`)
        let declensionText = option.data('name') // Если нет списка склонений, используется название элемента
        if (option.data('declensions')) { // Если есть список склонений, выбрать нужное
          declensionText = option.data('declensions')[2] //5+
          if ([2, 3, 4].indexOf(totalItemsEnd) != -1 && (itemsCount < 12 || itemsCount > 21)) {
            declensionText = option.data('declensions')[1] //2-4
          } else if (itemsCount === 1 || totalItemsEnd === 1 && itemsCount > 20) {
            declensionText = option.data('declensions')[0] //1
          }
        }
        return declensionText
      }
        
      if ($(dropdown).hasClass('dropdown_guests')) {
        // Если это выбор кол-ва гостей
        if (itemsCount.item3 > 0) {
          // Если выбраны младенцы
          const text = chooseDeclension('item1', totalItems - itemsCount.item3)
          const textInfants = chooseDeclension('item3', itemsCount.item3)
          return `${totalItems - itemsCount.item3} ${text}, ${itemsCount.item3} ${textInfants}`
        } else {
          // Если нет младенцев
          return `${totalItems} ${chooseDeclension('item1', totalItems)}`;
        }
      } else {
        // если выбор удобств
        let text = ''
        
        for (let i = 1; i <= Object.keys(itemsCount).length; i++) {
          if (itemsCount[`item${i}`]) {
            if (text)
              text += ', '
            text += `${itemsCount[`item${i}`]} ${chooseDeclension(`item${i}`, itemsCount[`item${i}`])}`
          }
        }
        
        return text
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
  
  const options = $('.iqdropdown-menu-option', dropdown)
  for (let option of options) { // disable '-' if item's count is 0
    if (option.dataset.defaultcount === '0') {
      $('.button-decrement', option).prop('disabled', true)
      $('.button-decrement', option).addClass('button-decrement_disabled')
    }
  }
  $(`#${dropdown.id} .icon-decrement`).text('-');
  $(`#${dropdown.id} .icon-increment`).text('+');

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
$(document).click(toggleDropDown)
