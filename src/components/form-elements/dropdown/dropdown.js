import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min';
import '../../../../node_modules/item-quantity-dropdown/lib/item-quantity-dropdown.min.css';

// Функция закрытия/открытия дропдауна
const toggleDropDown = (event) => {
  const target = event.target;
  const $openedDropdowns = $('.iqdropdown.menu-open')
  const currentDropdown = target.closest('.iqdropdown')
  const dropdownMenu = target.closest('.iqdropdown-menu')
  const dropdownControls = target.closest('.iqdropdown__controls')
  const applyButton = target.closest('.button_link:not(.button_link_clear)')
  const clearButton = target.closest('.button_link.button_link_clear')

  const closeNotAlwaysOpenedDropdowns = () => {
    for (let openedDropdown of $openedDropdowns) {
      if (!$(openedDropdown).data('always-opened')) {
        $(openedDropdown).removeClass('menu-open')
      }
    }
  }

  const setAllIQDropdownsZIndexTo1 = () => {
    $('.iqdropdown').css('z-index', 1)
  }

  if (currentDropdown && !dropdownMenu && !dropdownControls) {
    closeNotAlwaysOpenedDropdowns()
    $(currentDropdown).addClass('menu-open')
    setAllIQDropdownsZIndexTo1()
    currentDropdown.style.zIndex = '99'
    
  } else if (!currentDropdown && !clearButton || applyButton) {
    closeNotAlwaysOpenedDropdowns()
    setAllIQDropdownsZIndexTo1()
  }
}

const iqDropdownInit = (dropdown) => {
  $(dropdown).iqDropdown({
    setSelectionText(itemsCount, totalItems) {
      if (!totalItems) {
        return $(dropdown).data('placeholder');
      }

      function chooseDeclension(optionId, itemsCount) {
        const totalItemsLastDigit = parseInt(itemsCount.toString().split('').pop())

        const $option = $(`#${dropdown.id} .iqdropdown-menu-option[data-id="${optionId}"`)
        let declensionText = $option.data('name') // Если нет списка склонений, используется название элемента
        if ($option.data('declensions')) { // Если есть список склонений, выбрать нужное
          const declensionsList = $option.data('declensions')
          declensionText = declensionsList[2] //5+
          if ([2, 3, 4].indexOf(totalItemsLastDigit) != -1 && (itemsCount < 12 || itemsCount > 21)) {
            declensionText = declensionsList[1] //2-4
          } else if (itemsCount === 1 || totalItemsLastDigit === 1 && itemsCount > 20) {
            declensionText = declensionsList[0] //1
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
          return `${totalItems} ${chooseDeclension('item1', totalItems)}`
        }
      } else {
        // если выбор удобств
        let text = ''
        
        for (let i = 1; i <= Object.keys(itemsCount).length; i++) {
          if (itemsCount[`item${i}`]) {
            if (text) text += ', '
            text += `${itemsCount[`item${i}`]} ${chooseDeclension(`item${i}`, itemsCount[`item${i}`])}`
          }
        }
        
        return text
      }
    },
    onChange: (id, count, totalItems) => {
      const $buttonIncrement = $(`#${dropdown.id} [data-id='${id}'] .button-increment`)
      const $buttonDecrement = $(`#${dropdown.id} [data-id='${id}'] .button-decrement`)
      if (count === $(`#${dropdown.id} [data-id='${id}']`).data('maxcount')) {
        $buttonIncrement.prop('disabled', true)
        $buttonIncrement.addClass('button-increment_disabled')
      }
      else if (!count) {
        $buttonDecrement.prop('disabled', true)
        $buttonDecrement.addClass('button-decrement_disabled')
      }
      else {
        $buttonIncrement.removeAttr('disabled')
        $buttonDecrement.removeAttr('disabled')
        $buttonIncrement.removeClass('button-increment_disabled')
        $buttonDecrement.removeClass('button-decrement_disabled')
      }

      // Отображение/скрытие кнопки очистить
      totalItems ?
        $(`#${dropdown.id} .iqdropdown__button.button_link_clear`).removeClass('button_link_clear_hidden')
        :
        $(`#${dropdown.id} .iqdropdown__button.button_link_clear`).addClass('button_link_clear_hidden')

    },
    
  });
  
  const $options = $('.iqdropdown-menu-option', dropdown)
  for (let option of $options) { // disable '-' if item's count is 0
    if (option.dataset.defaultcount === '0') {
      const $decrementButton = $('.button-decrement', option)
      $decrementButton.prop('disabled', true)
      $decrementButton.addClass('button-decrement_disabled')
    }
  }
  $(`#${dropdown.id} .icon-decrement`).text('-');
  $(`#${dropdown.id} .icon-increment`).text('+');

  // удаление события клика по дропдауну
  $(dropdown).off('click')

  // Кнопка "очистить"
  if ($(`#${dropdown.id} .iqdropdown__controls`).length) {
    $(`#${dropdown.id} .button_link_clear`).on('click', clearFn)
  }
}


// Инициализация дропдаунов после загрузки страницы
$(function() {
  const $iqdropdowns = $('.iqdropdown')
  for (let iqdropdown of $iqdropdowns) {
    iqDropdownInit(iqdropdown)
  }
});

// Сохранение всех списков в один объект
const $iqdMenus = $('.iqdropdown-menu')
const iqdMenusHTMLs = {}
for (let iqdMenu of $iqdMenus) {
  let id = iqdMenu.parentNode.id
  iqdMenusHTMLs[id] = ($(iqdMenu).html())
}

// Функция очистки iqDropdown
const clearFn = (event) => {
  const target = event.target;
  const dropdownMenu = target.closest('.iqdropdown-menu')
  const dropdown = target.closest('.iqdropdown')
  const resetedHTML = $.parseHTML(iqdMenusHTMLs[dropdown.id])
  for (let item of resetedHTML) {
    if ($(item).hasClass('iqdropdown-menu-option')) {
      $(item).attr('data-defaultcount', '0')
    }
  }
  $(dropdownMenu).html(resetedHTML)
  $('.button_link_clear', dropdown).addClass('button_link_clear_hidden')
  iqDropdownInit(dropdown)
}

// Проверка на нажатие внутри/вне дропдауна и закрытие его
$(document).on('click', toggleDropDown)
