import 'item-quantity-dropdown/lib/item-quantity-dropdown.min';
import 'item-quantity-dropdown/lib/item-quantity-dropdown.min.css';

const dropdownsItemsCounts = {};
const $iqDropdowns = $('.js-iqdropdown');
const iqDropdownsInitialHTMLs = {};
let lastOpenedDropdown;

// Проверка, что это dropdown для выбора количества гостей
function isGuestsDropdown(dropdown) {
  return $(dropdown).hasClass('js-iqdropdown_guests');
}

// Получение кол-ва гостей из URI
function getGuestsCounts() {
  if (window.location.search !== '') {
    const entries = {};
    window.location.search
      .substring(1)
      .split('&')
      .forEach((entry) => {
        const [key, value] = entry.split('=');
        entries[key] = value;
      });
    if (entries.guests !== '') {
      return decodeURIComponent(entries.guests).split(',');
    }
  }
  return null;
}

// Вставка количеств гостей в качестве defaultcount в каждый iqdropdown-menu-option
function setDefaultGuestsCounts(dropdown) {
  const guestsCounts = getGuestsCounts();
  if (guestsCounts !== null) {
    const $dropdownOptions = $(dropdown).find('.js-iqdropdown-menu-option');
    $dropdownOptions.each((index, element) => {
      $(element).attr('data-defaultcount', guestsCounts[index]);
    });
  }
}

function setSelectionText(dropdown, itemsCount, totalItems) {
  const $selectionText = $(dropdown).find('.js-iqdropdown-selection');
  if (totalItems === 0) {
    $selectionText.text($(dropdown).data('placeholder'));
    return;
  }

  let selectionText = '';

  function chooseDeclension(optionId, optionItemsCount) {
    const totalItemsLastDigit = parseInt(
      optionItemsCount.toString().split('').pop(),
      10,
    );

    const $option = $(`#${dropdown.id} .js-iqdropdown-menu-option[data-id="${optionId}"`);
    let declensionText = $option.data('name'); // Если нет списка склонений, используется название элемента
    if ($option.data('declensions')) { // Если есть список склонений, выбрать нужное
      const declensionsList = $option.data('declensions');
      [, , declensionText] = declensionsList; // 5+
      const isTotalItemsEndsWith2to4 = [2, 3, 4].indexOf(totalItemsLastDigit) !== -1;
      if (isTotalItemsEndsWith2to4 && (optionItemsCount < 12 || optionItemsCount > 21)) {
        [, declensionText] = declensionsList; // 2-4
      } else if (optionItemsCount === 1 || (totalItemsLastDigit === 1 && optionItemsCount > 20)) {
        [declensionText] = declensionsList; // 1
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
    for (let i = 1; i <= Object.keys(itemsCount).length; i += 1) {
      if (itemsCount[`item${i}`] > 0) {
        if (selectionText !== '') { selectionText += ', '; }
        selectionText
          += `${itemsCount[`item${i}`]} ${chooseDeclension(`item${i}`, itemsCount[`item${i}`])}`;
      }
    }

    $selectionText.text(selectionText);
  }

  dropdownsItemsCounts[dropdown.id].selectionText = selectionText;
}

function initIqDropdown(dropdown) {
  const showOrHideClearButton = (totalItems) => {
    // Отображение/скрытие кнопки очистить
    const $clearButton = $(`#${dropdown.id} .js-button_clear`);
    if (totalItems > 0) {
      $clearButton.removeClass('button_hidden');
    } else {
      $clearButton.addClass('button_hidden');
    }
  };

  $(dropdown).iqDropdown({
    // eslint-disable-next-line consistent-return
    setSelectionText(itemsCount, totalItems) {
      showOrHideClearButton(totalItems);
      dropdownsItemsCounts[dropdown.id] = {
        itemsCount,
        totalItems,
      };
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
  $options.each(function disableDecrementButtons() {
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

  const composeHTMLFromArray = (arrayOfNodes = []) => {
    const container = $('<div></div>');
    $(arrayOfNodes).each(function appendNodesToContainer() {
      container.append(this);
    });
    return container.html();
  };

  // Функция сохранения выбранных значений
  function applyFn(event) {
    const { target } = event;
    const currentDropdown = target.closest('.js-iqdropdown');
    const dropdownHTML = $.parseHTML(iqDropdownsInitialHTMLs[currentDropdown.id]);
    const { itemsCount } = dropdownsItemsCounts[currentDropdown.id];
    const { totalItems } = dropdownsItemsCounts[currentDropdown.id];
    const $iqdMenu = dropdownHTML[2];
    const $menuOptions = $($iqdMenu).find('.js-iqdropdown-menu-option');
    const $dropdownInput = $(currentDropdown).parent().find('.js-iqdropdown__input');

    $($dropdownInput).val(Object.values(itemsCount));

    $menuOptions.each((index, element) => {
      $(element).attr('data-defaultcount', `${itemsCount[`item${index + 1}`]}`);
    });

    iqDropdownsInitialHTMLs[currentDropdown.id] = composeHTMLFromArray(dropdownHTML);

    $(currentDropdown).html(iqDropdownsInitialHTMLs[currentDropdown.id]);
    initIqDropdown(currentDropdown);
    setSelectionText(
      currentDropdown,
      itemsCount,
      totalItems,
    );
  }

  // Функция очистки iqDropdown
  function clearFn(event) {
    const { target } = event;
    const currentDropdown = target.closest('.js-iqdropdown');
    const dropdownHTML = $.parseHTML(iqDropdownsInitialHTMLs[currentDropdown.id]);
    const $iqdMenu = dropdownHTML[2];

    $($iqdMenu).find('.js-iqdropdown-menu-option').attr('data-defaultcount', '0');

    iqDropdownsInitialHTMLs[currentDropdown.id] = composeHTMLFromArray(dropdownHTML);
    $(currentDropdown).html(iqDropdownsInitialHTMLs[currentDropdown.id]);
    initIqDropdown(currentDropdown);
    setSelectionText(currentDropdown, 0, 0);
  }

  // Если есть блок с кнопками "очистить" и "применить", создать обработчики нажатий
  if ($(`#${dropdown.id} .js-iqdropdown__controls`).length > 0) {
    $(`#${dropdown.id} .js-button_clear`).on('click', clearFn);
    $(`#${dropdown.id} .js-button_link`).on('click', applyFn);
  }
}

// Инициализация dropdown'ов после загрузки страницы
$(() => {
  $iqDropdowns.each(function initAllDropdowns() {
    if (isGuestsDropdown(this)) {
      setDefaultGuestsCounts(this);
    }
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
function toggleDropDown(event) {
  const { target } = event;
  const $openedDropdowns = $('.js-iqdropdown.menu-open');
  const currentDropdown = target.closest('.js-iqdropdown');
  const dropdownMenu = target.closest('.js-iqdropdown-menu');
  const dropdownControls = target.closest('.js-iqdropdown__controls');
  const applyButton = target.closest('.js-button_link');
  const clearButton = target.closest('.js-button_link_clear');

  const closeNotAlwaysOpenedDropdowns = () => {
    $openedDropdowns.each(function closeDropdowns() {
      if (!$(this).data('always-opened')) {
        $(this).removeClass('menu-open');
      }
    });
  };

  const displayAllIQDropdownsBelow = () => {
    $iqDropdowns.removeClass('iqdropdown_above');
    $iqDropdowns.addClass('iqdropdown_below');
  };

  const isDropdownPressed = currentDropdown && !dropdownMenu && !dropdownControls;
  const isClickedOutsideOfDropdownOrOnApply = (!currentDropdown && !clearButton) || applyButton;
  const isDropdownHasControls = $(lastOpenedDropdown).find('.js-iqdropdown__controls').length > 0;

  function openClickedDropdownAndCloseOthers() {
    closeNotAlwaysOpenedDropdowns();
    $(currentDropdown).addClass('menu-open');
    displayAllIQDropdownsBelow();
    $(currentDropdown).addClass('iqdropdown_above');
    $(currentDropdown).removeClass('iqdropdown_below');
  }

  if (isDropdownPressed) {
    openClickedDropdownAndCloseOthers();
    lastOpenedDropdown = currentDropdown;
  } else if (isClickedOutsideOfDropdownOrOnApply) {
    closeNotAlwaysOpenedDropdowns();
    displayAllIQDropdownsBelow();
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
}

// Проверка на нажатие внутри/вне дропдауна и закрытие его
$(document).on('click', toggleDropDown);
