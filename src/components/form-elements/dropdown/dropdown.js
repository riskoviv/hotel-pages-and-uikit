// eslint-disable-next-line import/extensions
import 'item-quantity-dropdown/lib/item-quantity-dropdown.min.js';
import 'item-quantity-dropdown/lib/item-quantity-dropdown.min.css';

function isGuestsDropdown($dropdown) {
  return $dropdown.hasClass('js-iqdropdown_type_guests');
}

function getGuestsCountsFromLandingForm() {
  const landingFormDataString = window.location.search;
  if (landingFormDataString === '') return null;

  const guestsCountsString = landingFormDataString
    .substring(1)
    .split('&')
    .find((entry) => entry.startsWith('guests'))
    .replace(/guests=(.*)/, '$1');
  if (guestsCountsString === '') return null;

  return decodeURIComponent(guestsCountsString).split(',');
}

function setCountsFromLandingAsDefaultGuestsCounts($dropdown) {
  const guestsCounts = getGuestsCountsFromLandingForm();
  if (guestsCounts !== null) {
    const $dropdownOptions = $dropdown.find('.js-iqdropdown-menu-option');
    $dropdownOptions.each((index, element) => {
      $(element).attr('data-defaultcount', guestsCounts[index]);
    });
  }
}

function chooseDeclension($dropdown, optionId, optionItemsCount) {
  const [tensCount, unitsCount] = [...String(optionItemsCount).slice(-2).padStart(2, '0')]
    .map((digitAsString) => Number(digitAsString));

  const $option = $dropdown.find(`.js-iqdropdown-menu-option[data-id="${optionId}"`);
  const declensionsList = $option.data('declensions');
  // Если нет списка склонений, используется название элемента
  if (declensionsList === undefined) {
    return $option.data('name');
  }

  // Если есть список склонений, выбрать нужное
  const tensIs1 = tensCount === 1;
  const unitsIs1 = unitsCount === 1;
  const unitsIs2to4 = [2, 3, 4].includes(unitsCount);
  if (tensIs1) {
    return declensionsList[2];
  }

  if (unitsIs1) {
    return declensionsList[0];
  }

  if (unitsIs2to4) {
    return declensionsList[1];
  }

  return declensionsList[2];
}

const dropdownsItemsData = {};

const saveItemData = (id, data) => {
  Object.entries(data).forEach(([property, value]) => {
    if (dropdownsItemsData[id] === undefined) dropdownsItemsData[id] = {};
    dropdownsItemsData[id][property] = value;
  });
};

function setSelectionText($dropdown, itemsCount, totalItems) {
  const $selection = $dropdown.find('.js-iqdropdown-selection');
  if (totalItems === 0) {
    $selection.text($dropdown.data('placeholder'));
    return;
  }

  let selectionText = '';

  if (isGuestsDropdown($dropdown)) {
    // Если это выбор кол-ва гостей
    const infantsCount = itemsCount.item3;
    if (infantsCount > 0) {
      // Если выбраны младенцы
      const guestsCount = totalItems - infantsCount;
      const guestsDeclension = chooseDeclension($dropdown, 'item1', guestsCount);
      const infantsDeclension = chooseDeclension($dropdown, 'item3', infantsCount);
      selectionText = `${guestsCount} ${guestsDeclension}, ${infantsCount} ${infantsDeclension}`;
    } else {
      // Если нет младенцев
      selectionText = `${totalItems} ${chooseDeclension($dropdown, 'item1', totalItems)}`;
    }
    $selection.text(selectionText);
  } else {
    // если выбор удобств
    selectionText = Object.entries(itemsCount).reduce((selectionTextParts, [itemId, count]) => {
      if (count > 0) {
        selectionTextParts.push(`${count} ${chooseDeclension($dropdown, itemId, count)}`);
      }
      return selectionTextParts;
    }, []).join(', ');
    $selection.text(selectionText);
  }

  saveItemData($dropdown.prop('id'), { selectionText });
}

const composeHTMLFromArray = (arrayOfNodes = []) => {
  const $container = $('<div></div>');
  $(arrayOfNodes).each(function appendNodesToContainer() {
    $container.append(this);
  });
  return $container.html();
};

const iqDropdownsInitialHTMLs = {};
let initIqDropdown;
// Функция сохранения выбранных значений
function applyFn(event) {
  const { target } = event;
  const currentDropdown = target.closest('.js-iqdropdown');
  const $currentDropdown = $(currentDropdown);
  const dropdownInnerElements = $.parseHTML(iqDropdownsInitialHTMLs[currentDropdown.id]);
  const { itemsCount, totalItems } = dropdownsItemsData[currentDropdown.id];
  const [, , iqdMenu] = dropdownInnerElements;
  const $menuOptions = $(iqdMenu).find('.js-iqdropdown-menu-option');
  const $dropdownInput = $currentDropdown.prev();

  $dropdownInput.val(Object.values(itemsCount));

  $menuOptions.each((index, element) => {
    $(element).attr('data-defaultcount', `${itemsCount[`item${index + 1}`]}`);
  });

  iqDropdownsInitialHTMLs[currentDropdown.id] = composeHTMLFromArray(dropdownInnerElements);

  $currentDropdown.html(iqDropdownsInitialHTMLs[currentDropdown.id]);
  initIqDropdown(currentDropdown);
  setSelectionText(
    $currentDropdown,
    itemsCount,
    totalItems,
  );
}

// Функция очистки iqDropdown
function clearFn(event) {
  const { target } = event;
  const currentDropdown = target.closest('.js-iqdropdown');
  const $currentDropdown = $(currentDropdown);
  const dropdownInnerElements = $.parseHTML(iqDropdownsInitialHTMLs[currentDropdown.id]);
  const [, , iqdMenu] = dropdownInnerElements;
  const $dropdownInput = $currentDropdown.prev();

  $dropdownInput.val('');
  $(iqdMenu).find('.js-iqdropdown-menu-option').attr('data-defaultcount', '0');

  iqDropdownsInitialHTMLs[currentDropdown.id] = composeHTMLFromArray(dropdownInnerElements);
  $currentDropdown.html(iqDropdownsInitialHTMLs[currentDropdown.id]);
  initIqDropdown(currentDropdown);
  setSelectionText($currentDropdown, 0, 0);
}

const bindEventListenersToDropdownControls = ($dropdown) => {
  // Если есть блок с кнопками "очистить" и "применить", создать обработчики нажатий
  if ($dropdown.find('.js-iqdropdown__controls').length > 0) {
    $dropdown.find('.js-button_type_clear').on('click', clearFn);
    $dropdown.find('.js-button_type_link').on('click', applyFn);
  }
};

const showOrHideClearButton = ($dropdown, totalItems) => {
  // Отображение/скрытие кнопки очистить
  const $clearButton = $dropdown.find('.js-button_type_clear');
  if (totalItems > 0) {
    $clearButton.removeClass('button_hidden');
  } else {
    $clearButton.addClass('button_hidden');
  }
};

function disableDecrementButtonsIfDefaultCountIs0($dropdown) {
  const $options = $dropdown.find('.js-iqdropdown-menu-option');
  $options.each(function disableDecrementButtons() {
    if (this.dataset.defaultcount === '0') {
      // disable '-' if item's count is 0
      const $decrementButton = $(this).find('.button-decrement');
      $decrementButton.prop('disabled', true);
      $decrementButton.addClass('button-decrement_disabled');
    }
  });
}

function toggleCountChangeButtons($dropdown, id, count) {
  const $buttonIncrement = $dropdown.find(`[data-id="${id}"] .button-increment`);
  const $buttonDecrement = $dropdown.find(`[data-id="${id}"] .button-decrement`);
  const maxCount = $dropdown.find(`[data-id="${id}"]`).data('maxcount');
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
}

initIqDropdown = (dropdown) => {
  const $dropdown = $(dropdown);

  $dropdown.iqDropdown({
    // eslint-disable-next-line consistent-return
    setSelectionText(itemsCount, totalItems) {
      showOrHideClearButton($dropdown, totalItems);
      saveItemData(dropdown.id, { itemsCount, totalItems });
      if ($dropdown.has('.js-iqdropdown__controls').length === 0) {
        setSelectionText($dropdown, itemsCount, totalItems);
      } else {
        return dropdownsItemsData[dropdown.id].selectionText;
      }
    },
    onChange: (id, count, totalItems) => {
      showOrHideClearButton($dropdown, totalItems);
      toggleCountChangeButtons($dropdown, id, count);
    },
  });

  disableDecrementButtonsIfDefaultCountIs0($dropdown);

  $dropdown.find('.icon-decrement').text('-');
  $dropdown.find('.icon-increment').text('+');

  $dropdown.off('click');

  bindEventListenersToDropdownControls($dropdown);
};

const $iqDropdowns = $('.js-iqdropdown');
// Инициализация dropdown'ов после загрузки страницы
$(() => {
  $iqDropdowns.each(function initDropdownsOnAllFoundElements() {
    const $dropdown = $(this);
    if (isGuestsDropdown($dropdown)) {
      setCountsFromLandingAsDefaultGuestsCounts($dropdown);
    }
    iqDropdownsInitialHTMLs[this.id] = $dropdown.html();
    initIqDropdown(this);
    setSelectionText(
      $dropdown,
      dropdownsItemsData[this.id].itemsCount,
      dropdownsItemsData[this.id].totalItems,
    );
  });
});

let lastOpenedDropdown;

// Функция закрытия/открытия дропдауна
function toggleDropDownHandler(event) {
  const { target } = event;
  const $openedDropdowns = $('.js-iqdropdown.menu-open');
  const currentDropdown = target.closest('.js-iqdropdown');
  const $currentDropdown = $(currentDropdown);
  const dropdownMenu = target.closest('.js-iqdropdown-menu');
  const dropdownControls = target.closest('.js-iqdropdown__controls');
  const applyButton = target.closest('.js-button_type_link');
  const clearButton = target.closest('.js-button_type_clear');

  const closeClosableDropdowns = () => {
    $openedDropdowns.each(function closeDropdowns() {
      if ($(this).data('always-opened') === '') {
        $(this).removeClass('menu-open');
      }
    });
  };

  const displayAllIQDropdownsBelow = () => {
    $iqDropdowns.removeClass('iqdropdown_above');
    $iqDropdowns.addClass('iqdropdown_below');
  };

  const isDropdownPressed = currentDropdown !== null
    && dropdownMenu === null
    && dropdownControls === null;
  const isClickedOutsideOfDropdownOrOnApply = (currentDropdown === null && clearButton === null)
    || applyButton !== null;
  const isDropdownHasControls = $(lastOpenedDropdown).find('.js-iqdropdown__controls').length > 0;

  function openClickedDropdownAndCloseOthers() {
    closeClosableDropdowns();
    $currentDropdown.addClass('menu-open');
    displayAllIQDropdownsBelow();
    $currentDropdown.addClass('iqdropdown_above');
    $currentDropdown.removeClass('iqdropdown_below');
  }

  if (isDropdownPressed) {
    openClickedDropdownAndCloseOthers();
    lastOpenedDropdown = currentDropdown;
  } else if (isClickedOutsideOfDropdownOrOnApply) {
    closeClosableDropdowns();
    displayAllIQDropdownsBelow();
    const clickedOutsideOfDropdownWithControls = applyButton === null
      && lastOpenedDropdown !== undefined
      && isDropdownHasControls;
    if (clickedOutsideOfDropdownWithControls) {
      const $lastOpenedDropdown = $(lastOpenedDropdown);
      $lastOpenedDropdown.html(iqDropdownsInitialHTMLs[lastOpenedDropdown.id]);
      initIqDropdown(lastOpenedDropdown);
      setSelectionText(
        $lastOpenedDropdown,
        dropdownsItemsData[lastOpenedDropdown.id].itemsCount,
        dropdownsItemsData[lastOpenedDropdown.id].totalItems,
      );
      lastOpenedDropdown = null;
    }
  }
}

// Проверка на нажатие внутри/вне дропдауна и закрытие его
$(document).on('click', toggleDropDownHandler);
