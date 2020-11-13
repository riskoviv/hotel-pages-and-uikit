import 'item-quantity-dropdown/lib/item-quantity-dropdown.min';
import 'item-quantity-dropdown/lib/item-quantity-dropdown.min.css';

const dropdownsItemsCounts = {};
const $iqDropdowns = $('.js-iqdropdown');
const iqDropdownsInitialHTMLs = {};
let lastOpenedDropdown;

// Инициализация dropdown'ов после загрузки страницы
$(function () {
  $iqDropdowns.each(function () {
    iqDropdownsInitialHTMLs[this.id] = $(this).html();
    initIqDropdown(this);
    setSelectionText(
      this,
      dropdownsItemsCounts[this.id].itemsCount,
      dropdownsItemsCounts[this.id].totalItems,
    );
  });
});

// Функция закрытия/открытия дропдауна
const toggleDropDown = (event) => {
  const target = event.target;
  const $openedDropdowns = $('.js-iqdropdown.menu-open');
  const currentDropdown = target.closest('.js-iqdropdown');
  const dropdownMenu = target.closest('.js-iqdropdown-menu');
  const dropdownControls = target.closest('.js-iqdropdown__controls');
  const applyButton = target.closest('.js-button_link');
  const clearButton = target.closest('.js-button_link_clear');

  const closeNotAlwaysOpenedDropdowns = () => {
    $openedDropdowns.each(function () {
      if (!$(this).data('always-opened')) {
        $(this).removeClass('menu-open');
      }
    })
  };

  const setAllIQDropdownsZIndexTo1 = () => {
    $iqDropdowns.css('z-index', 1);
  };

  const isDropdownPressed = currentDropdown && !dropdownMenu && !dropdownControls;
  const isClickedOutsideOfDropdownOrOnApply =
    (!currentDropdown && !clearButton) || applyButton;
  const isDropdownHasControls =
    $(lastOpenedDropdown).find('.js-iqdropdown__controls').length > 0;

  if (isDropdownPressed) {
    closeNotAlwaysOpenedDropdowns();
    $(currentDropdown).addClass('menu-open');
    setAllIQDropdownsZIndexTo1();
    currentDropdown.style.zIndex = '99';
    lastOpenedDropdown = currentDropdown;
  } else if (isClickedOutsideOfDropdownOrOnApply) {
    closeNotAlwaysOpenedDropdowns();
    setAllIQDropdownsZIndexTo1();
    if (!applyButton && lastOpenedDropdown && isDropdownHasControls) {
      $(lastOpenedDropdown).html(iqDropdownsInitialHTMLs[lastOpenedDropdown.id]);
      initIqDropdown(lastOpenedDropdown);
      setSelectionText(
        lastOpenedDropdown,
        dropdownsItemsCounts[lastOpenedDropdown.id].itemsCount,
        dropdownsItemsCounts[lastOpenedDropdown.id].totalItems,
      );
      lastOpenedDropdown = null;
    }
  }
};

// Проверка, что это dropdown для выбора количества гостей
function isGuestsDropdown(dropdown) {
  return $(dropdown).hasClass('js-iqdropdown_guests');
}

const setSelectionText = (dropdown, itemsCount, totalItems) => {
  const $selectionText = $(dropdown).find('.js-iqdropdown-selection');
  if (totalItems === 0) {
    $selectionText.text($(dropdown).data('placeholder'));
    return;
  }

  let selectionText = '';

  function chooseDeclension(optionId, itemsCount) {
    const totalItemsLastDigit = parseInt(
      itemsCount.toString()
        .split('')
        .pop()
    );

    const $option = $(`#${dropdown.id} .js-iqdropdown-menu-option[data-id="${optionId}"`);
    let declensionText = $option.data('name'); // Если нет списка склонений, используется название элемента
    if ($option.data('declensions')) { // Если есть список склонений, выбрать нужное
      const declensionsList = $option.data('declensions');
      declensionText = declensionsList[2]; //5+
      const isTotalItemsEndsWith2to4 = [2, 3, 4].indexOf(totalItemsLastDigit) != -1;
      if (isTotalItemsEndsWith2to4 && (itemsCount < 12 || itemsCount > 21)) {
        declensionText = declensionsList[1]; //2-4
      } else if (itemsCount === 1 || (totalItemsLastDigit === 1 && itemsCount > 20)) {
        declensionText = declensionsList[0]; //1
      }
    }
    return declensionText;
  }

  if (isGuestsDropdown(dropdown)) {
    // Если это выбор кол-ва гостей
    if (itemsCount.item3 > 0) {
      // Если выбраны младенцы
      const text = chooseDeclension('item1', totalItems - itemsCount.item3);
      const textInfants = chooseDeclension('item3', itemsCount.item3);
      selectionText = `${totalItems - itemsCount.item3} ${text}, ${itemsCount.item3} ${textInfants}`;
      $selectionText.text(selectionText);
    } else {
      // Если нет младенцев
      selectionText = `${totalItems} ${chooseDeclension('item1', totalItems)}`;
      $selectionText.text(selectionText);
    }
  } else {
    // если выбор удобств
    for (let i = 1; i <= Object.keys(itemsCount).length; i++) {
      if (itemsCount[`item${i}`] > 0) {
        if (selectionText !== '') selectionText += ', ';
        selectionText +=
          `${itemsCount[`item${i}`]} ${chooseDeclension(`item${i}`, itemsCount[`item${i}`])}`;
      }
    }

    $selectionText.text(selectionText);
  }

  dropdownsItemsCounts[dropdown.id].selectionText = selectionText;
};

const initIqDropdown = (dropdown) => {
  const showOrHideClearButton = (totalItems) => {
    // Отображение/скрытие кнопки очистить
    const $clearButton = $(`#${dropdown.id} .js-button_link_clear`);
    totalItems > 0
      ? $clearButton.removeClass('button_link_clear_hidden')
      : $clearButton.addClass('button_link_clear_hidden');
  };

  $(dropdown).iqDropdown({
    setSelectionText(itemsCount, totalItems) {
      showOrHideClearButton(totalItems);
      dropdownsItemsCounts[dropdown.id] = {
        itemsCount,
        totalItems,
      }
      // проверка на класс js-iqdropdown_preferences, т. к. у dropdown этого типа нет блока кнопок 
      if ($(dropdown).hasClass('js-iqdropdown_preferences')) {
        setSelectionText(dropdown, itemsCount, totalItems);
      } else {
        return dropdownsItemsCounts[dropdown.id].selectionText;
      }
    },
    onChange: (id, count, totalItems) => {
      showOrHideClearButton(totalItems);
      const $buttonIncrement = $(`#${dropdown.id} [data-id='${id}'] .button-increment`);
      const $buttonDecrement = $(`#${dropdown.id} [data-id='${id}'] .button-decrement`);
      const maxCount = $(`#${dropdown.id} [data-id='${id}']`).data('maxcount');
      if (count === maxCount) {
        $buttonIncrement.prop('disabled', true);
        $buttonIncrement.addClass('button-increment_disabled');
      } else if (count === 0) {
        $buttonDecrement.prop('disabled', true);
        $buttonDecrement.addClass('button-decrement_disabled');
      } else {
        [$buttonIncrement, $buttonDecrement].forEach((button) => {
          button.removeAttr('disabled');
        });
        $buttonIncrement.removeClass('button-increment_disabled');
        $buttonDecrement.removeClass('button-decrement_disabled');
      }
    },
  });

  const $options = $(dropdown).find('.js-iqdropdown-menu-option');
  $options.each(function () {
    if (this.dataset.defaultcount === '0') {
      // disable '-' if item's count is 0
      const $decrementButton = $(this).find('.button-decrement');
      $decrementButton.prop('disabled', true);
      $decrementButton.addClass('button-decrement_disabled');
    }
  });
  
  $(`#${dropdown.id} .icon-decrement`).text('-');
  $(`#${dropdown.id} .icon-increment`).text('+');

  // удаление события клика по дропдауну
  $(dropdown).off('click');

  // Если есть блок с кнопками "очистить" и "применить", создать обработчики нажатий
  if ($(`#${dropdown.id} .js-iqdropdown__controls`).length > 0) {
    $(`#${dropdown.id} .js-button_link_clear`).on('click', clearFn);
    $(`#${dropdown.id} .js-button_link`).on('click', applyFn);
  }
};

const composeHTMLFromArray = (arrayOfNodes = []) => {
  const container = $('<div></div>');
  $(arrayOfNodes).each(function () {
    container.append(this);
  });
  return container.html();
};

// Функция сохранения выбранных значений
const applyFn = (event) => {
  const target = event.target;
  const dropdown = target.closest('.js-iqdropdown');
  const dropdownHTML = $.parseHTML(iqDropdownsInitialHTMLs[dropdown.id]);
  const itemsCount = dropdownsItemsCounts[dropdown.id].itemsCount;
  const totalItems = dropdownsItemsCounts[dropdown.id].totalItems;
  const $iqdMenu = dropdownHTML[2];
  const $menuOptions = $($iqdMenu).find('.js-iqdropdown-menu-option');
  const $dropdownInput = $(dropdown).parent().find('.js-iqdropdown__input');

  $($dropdownInput).val(Object.values(itemsCount));

  $menuOptions.each(function (index, element) {
    $(element).attr('data-defaultcount', `${itemsCount[`item${index + 1}`]}`);
  })

  iqDropdownsInitialHTMLs[dropdown.id] = composeHTMLFromArray(dropdownHTML);

  $(dropdown).html(iqDropdownsInitialHTMLs[dropdown.id]);
  initIqDropdown(dropdown);
  setSelectionText(
    dropdown,
    itemsCount,
    totalItems,
  );
};

// Функция очистки iqDropdown
const clearFn = (event) => {
  const target = event.target;
  const dropdown = target.closest('.js-iqdropdown');
  const dropdownHTML = $.parseHTML(iqDropdownsInitialHTMLs[dropdown.id]);
  const $iqdMenu = dropdownHTML[2];

  $($iqdMenu).find('.js-iqdropdown-menu-option').attr('data-defaultcount', '0');

  iqDropdownsInitialHTMLs[dropdown.id] = composeHTMLFromArray(dropdownHTML);
  $(dropdown).html(iqDropdownsInitialHTMLs[dropdown.id]);
  initIqDropdown(dropdown);
  setSelectionText(dropdown, 0, 0);
};

// Проверка на нажатие внутри/вне дропдауна и закрытие его
$(document).on('click', toggleDropDown);
