// eslint-disable-next-line import/extensions
import 'item-quantity-dropdown/lib/item-quantity-dropdown.min.js';
import 'item-quantity-dropdown/lib/item-quantity-dropdown.min.css';

class Dropdown {
  static dropdownsItemsData = {};

  static iqDropdownsInitialHTMLs = {};

  static dropdownInstances = {};

  $dropdown;

  $dropdownInput;

  isGuestsDropdown;

  id;

  constructor($dropdownTarget, id) {
    this.$dropdown = $dropdownTarget;
    this.$dropdownInput = $dropdownTarget.prev();
    this.isGuestsDropdown = Dropdown.isGuestsDropdown($dropdownTarget);
    if (this.isGuestsDropdown) {
      Dropdown.setCountsFromLandingAsDefaultGuestsCounts($dropdownTarget);
    }
    this.id = id;
    Dropdown.iqDropdownsInitialHTMLs[this.id] = $dropdownTarget.html();
    this.initIqDropdown();
    this.setSelectionText(
      Dropdown.dropdownsItemsData[this.id].itemsCount,
      Dropdown.dropdownsItemsData[this.id].totalItems,
    );
  }

  static isGuestsDropdown($dropdown) {
    return $dropdown.hasClass('js-iqdropdown_type_guests');
  }

  static getGuestsCountsSubmittedByLandingForm() {
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

  static setCountsFromLandingAsDefaultGuestsCounts($dropdown) {
    const guestsCounts = Dropdown.getGuestsCountsSubmittedByLandingForm();
    if (guestsCounts !== null) {
      const $dropdownOptions = $dropdown.find('.js-iqdropdown-menu-option');
      $dropdownOptions.each((index, dropdownOption) => {
        $(dropdownOption).attr('data-defaultcount', guestsCounts[index]);
      });
    }
  }

  chooseDeclension(optionId, optionItemsCount) {
    const [tensCount, unitsCount] = [...String(optionItemsCount).slice(-2).padStart(2, '0')]
      .map((digitAsString) => Number(digitAsString));

    const $option = this.$dropdown.find(`.js-iqdropdown-menu-option[data-id="${optionId}"`);
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

  static saveItemData(id, data) {
    Object.entries(data).forEach(([property, value]) => {
      if (Dropdown.dropdownsItemsData[id] === undefined) Dropdown.dropdownsItemsData[id] = {};
      Dropdown.dropdownsItemsData[id][property] = value;
    });
  }

  setSelectionText(itemsCount, totalItems) {
    const $selection = this.$dropdown.find('.js-iqdropdown-selection');
    if (totalItems === 0) {
      $selection.text(this.$dropdown.data('placeholder'));
      return;
    }

    let selectionText = '';

    if (this.isGuestsDropdown) {
      // Если это выбор кол-ва гостей
      const infantsCount = itemsCount.item3;
      if (infantsCount > 0) {
        // Если выбраны младенцы
        const guestsCount = totalItems - infantsCount;
        const guestsDeclension = this.chooseDeclension('item1', guestsCount);
        const infantsDeclension = this.chooseDeclension('item3', infantsCount);
        selectionText = `${guestsCount} ${guestsDeclension}, ${infantsCount} ${infantsDeclension}`;
      } else {
        // Если нет младенцев
        selectionText = `${totalItems} ${this.chooseDeclension('item1', totalItems)}`;
      }
      $selection.text(selectionText);
    } else {
      // если выбор удобств
      selectionText = this.getPreferencesSelectionText(itemsCount);
      $selection.text(selectionText);
    }

    Dropdown.saveItemData(this.id, { selectionText });
  }

  getPreferencesSelectionText(itemsCount, totalItems) {
    if (totalItems === 0) return this.$dropdown.data('placeholder');

    return Object.entries(itemsCount).reduce((selectionTextParts, [itemId, count]) => {
      if (count > 0) {
        selectionTextParts.push(`${count} ${this.chooseDeclension(itemId, count)}`);
      }
      return selectionTextParts;
    }, []).join(', ');
  }

  static composeHTMLFromArray(arrayOfNodes = []) {
    const $container = $('<div></div>');
    $(arrayOfNodes).each(function appendNodesToContainer() {
      $container.append(this);
    });
    return $container.html();
  }

  setInputValue(value) {
    this.$dropdownInput.val(value);
  }

  handleApplyButtonClick = () => {
    const dropdownInnerElements = $.parseHTML(Dropdown.iqDropdownsInitialHTMLs[this.id]);
    const { itemsCount, totalItems } = Dropdown.dropdownsItemsData[this.id];
    const [, , iqdMenu] = dropdownInnerElements;
    const $menuOptions = $(iqdMenu).find('.js-iqdropdown-menu-option');

    this.setInputValue(Object.values(itemsCount));

    $menuOptions.each((index, menuOption) => {
      $(menuOption).attr('data-defaultcount', itemsCount[`item${index + 1}`]);
    });

    Dropdown.iqDropdownsInitialHTMLs[this.id] = Dropdown.composeHTMLFromArray(
      dropdownInnerElements,
    );

    this.$dropdown.html(Dropdown.iqDropdownsInitialHTMLs[this.id]);
    this.initIqDropdown();
    this.setSelectionText(
      itemsCount,
      totalItems,
    );
  };

  handleClearButtonClick = () => {
    const dropdownInnerElements = $.parseHTML(Dropdown.iqDropdownsInitialHTMLs[this.id]);
    const [, , iqdMenu] = dropdownInnerElements;

    this.setInputValue('');
    $(iqdMenu).find('.js-iqdropdown-menu-option').attr('data-defaultcount', '0');

    Dropdown.iqDropdownsInitialHTMLs[this.id] = Dropdown.composeHTMLFromArray(
      dropdownInnerElements,
    );
    this.$dropdown.html(Dropdown.iqDropdownsInitialHTMLs[this.id]);
    this.initIqDropdown();
    this.setSelectionText(0, 0);
  };

  bindEventListenersToDropdownControls() {
    if (this.$dropdown.has('.js-iqdropdown__controls').length > 0) {
      this.$dropdown.find('.js-iqdropdown__clear-button').on('click', this.handleClearButtonClick);
      this.$dropdown.find('.js-iqdropdown__apply-button').on('click', this.handleApplyButtonClick);
    }
  }

  showOrHideClearButton(totalItems) {
    const $clearButton = this.$dropdown.find('.js-iqdropdown__clear-button');
    if (totalItems > 0) {
      $clearButton.removeClass('iqdropdown__clear-button_hidden');
    } else {
      $clearButton.addClass('iqdropdown__clear-button_hidden');
    }
  }

  disableDecrementButtonsIfDefaultCountIs0() {
    const $options = this.$dropdown.find('.js-iqdropdown-menu-option');
    $options.each(function disableDecrementButtons() {
      if (this.dataset.defaultcount === '0') {
        // disable '-' if item's count is 0
        const $decrementButton = $(this).find('.button-decrement');
        $decrementButton.prop('disabled', true);
        $decrementButton.addClass('button-decrement_disabled');
      }
    });
  }

  toggleCountChangeButtons(id, count) {
    const $buttonIncrement = this.$dropdown.find(`[data-id="${id}"] .button-increment`);
    const $buttonDecrement = this.$dropdown.find(`[data-id="${id}"] .button-decrement`);
    const maxCount = this.$dropdown.find(`[data-id="${id}"]`).data('maxcount');
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

  initIqDropdown() {
    this.$dropdown.iqDropdown({
      setSelectionText: (itemsCount, totalItems) => {
        this.showOrHideClearButton(totalItems);
        Dropdown.saveItemData(this.id, { itemsCount, totalItems });
        const hasControls = this.$dropdown.has('.js-iqdropdown__controls').length === 1;
        if (hasControls) {
          return Dropdown.dropdownsItemsData[this.id].selectionText;
        }
        return this.getPreferencesSelectionText(itemsCount, totalItems);
      },
      onChange: (id, count, totalItems) => {
        this.showOrHideClearButton(totalItems);
        this.toggleCountChangeButtons(id, count);
      },
    });

    this.disableDecrementButtonsIfDefaultCountIs0();
    this.$dropdown.find('.icon-decrement').text('-');
    this.$dropdown.find('.icon-increment').text('+');
    this.$dropdown.off('click');
    this.bindEventListenersToDropdownControls();
  }
}

const $iqDropdowns = $('.js-iqdropdown');

// Инициализация dropdown'ов после загрузки страницы
$(() => {
  $iqDropdowns.each(function initDropdownsOnAllFoundElements() {
    const $dropdownTarget = $(this);
    Dropdown.dropdownInstances[this.id] = new Dropdown($dropdownTarget, this.id);
  });
});

let lastOpenedDropdown;

const displayAllIQDropdownsBelow = () => {
  $iqDropdowns.removeClass('iqdropdown_above');
  $iqDropdowns.addClass('iqdropdown_below');
};

// Функция закрытия/открытия дропдауна
function toggleDropDownHandler(event) {
  const { target } = event;
  const $openedDropdowns = $('.js-iqdropdown.menu-open');
  const currentDropdown = target.closest('.js-iqdropdown');
  const $currentDropdown = $(currentDropdown);
  const dropdownMenu = target.closest('.js-iqdropdown-menu');
  const dropdownControls = target.closest('.js-iqdropdown__controls');
  const applyButton = target.closest('.js-iqdropdown__apply-button');
  const clearButton = target.closest('.js-iqdropdown__clear-button');

  const closeClosableDropdowns = () => {
    $openedDropdowns.each(function closeDropdowns() {
      if ($(this).data('always-opened') === '') {
        $(this).removeClass('menu-open');
      }
    });
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
      const lastOpenedDropdownInstance = Dropdown.dropdownInstances[lastOpenedDropdown.id];
      $lastOpenedDropdown.html(Dropdown.iqDropdownsInitialHTMLs[lastOpenedDropdown.id]);
      lastOpenedDropdownInstance.initIqDropdown();
      lastOpenedDropdownInstance.setSelectionText(
        Dropdown.dropdownsItemsData[lastOpenedDropdown.id].itemsCount,
        Dropdown.dropdownsItemsData[lastOpenedDropdown.id].totalItems,
      );
      lastOpenedDropdown = null;
    }
  }
}

// Проверка на нажатие внутри/вне дропдауна
// и закрытие его / закрытие других, отображение поверх других
$(document.body).on('click', toggleDropDownHandler);
