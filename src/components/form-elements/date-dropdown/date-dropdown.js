import 'air-datepicker';

function datePickerInit(datepicker) {
  const datepickerElement = $(datepicker);
  const $date1Input = datepickerElement;
  const $date2Input = $date1Input.closest('.js-date-dropdown').find('.js-date-dropdown__input[data-date="2"]');
  const isFilter = datepickerElement.hasClass('js-date-dropdown_type_filter__input');

  const moveToLeftEdgeIfMobileS = () => {
    const mobileSMediaQuery = window.matchMedia('(max-width: 320px)');
    if (mobileSMediaQuery.matches) {
      datepickerElement.data('datepicker').$datepicker.css('left', '0');
    }
  };

  let datepickerInstance;
  let $calendarClearButton;
  let $calendarNavTitle;

  const showClearButton = () => {
    $calendarClearButton.removeClass('button_hidden');
  };

  const hideClearButton = () => {
    $calendarClearButton.addClass('button_hidden');
  };

  const customizeNavTitle = () => {
    $calendarNavTitle = datepickerInstance.$nav.find('.datepicker--nav-title');
    $calendarNavTitle.prop('disabled', true);
    $calendarNavTitle.addClass('heading-2');
  };

  const setCustomOptions = () => {
    moveToLeftEdgeIfMobileS();
    customizeNavTitle();
    $calendarClearButton.addClass('button button_type_link button_type_clear');
  };

  let savedDates = [];
  let savedDatesFilter = '';

  const saveDates = (selectedDates) => {
    if (isFilter) {
      savedDatesFilter = datepickerElement.val();
    } else {
      savedDates = selectedDates.split(',');
    }
  };

  const printDates = () => {
    if (isFilter) {
      $date1Input.val(savedDatesFilter);
    } else {
      $date1Input.val(savedDates[0] || '');
      $date2Input.val(savedDates[1] || '');
    }
  };

  let onSelectCounter = 0;
  // datepicker initialization
  datepickerElement.datepicker({
    inline: false,
    range: true,
    clearButton: true,
    prevHtml: 'arrow_back',
    nextHtml: 'arrow_forward',
    offset: 5,
    navTitles: {
      days: 'MM yyyy',
    },
    onChangeMonth() {
      setCustomOptions();
    },
    onSelect(formattedDate) {
      onSelectCounter += 1;
      saveDates(formattedDate);
      const isDateSelectedManually = (
        datepickerElement.data('selectDate') !== undefined
        && onSelectCounter > 2
      ) || datepickerElement.data('selectDate') === undefined;
      if (isDateSelectedManually) {
        datepickerElement.val('');
        if (!isFilter) $date2Input.val('');
      } else {
        printDates();
      }

      setCustomOptions();
      if (formattedDate === '') {
        hideClearButton();
      } else {
        showClearButton();
      }
    },
    onShow(inst) {
      const datesSelectedButNotSaved = inst.selectedDates.length > 0
        && $date1Input.val() === '' && $date2Input.val() === '';
      if (datesSelectedButNotSaved) {
        inst.clear();
      }
      setCustomOptions();
      if (datepickerElement.val() === '') {
        hideClearButton();
      } else {
        showClearButton();
      }
    },
    onHide(inst) {
      if (inst.selectedDates.length === 1) inst.clear();
    },
  });

  datepickerInstance = datepickerElement.data('datepicker');
  const { $buttonsContainer } = datepickerInstance.nav;
  $calendarClearButton = $buttonsContainer.children();
  $calendarClearButton.on('click', hideClearButton);

  setCustomOptions();

  const $applyButton = $('<button class="button button_type_link">Применить</button>');
  $buttonsContainer.append($applyButton);
  $applyButton.on('click', () => {
    printDates();
    datepickerInstance.hide();
  });

  const date2InputClickHandler = () => {
    datepickerInstance.show();
  };
  if ($date2Input.length > 0) {
    $date2Input.on('click', date2InputClickHandler);
    $date2Input[0].addEventListener('pointerdown', date2InputClickHandler);
  }

  return datepickerInstance;
}

const getSelectedDates = () => {
  const landingFormDataString = window.location.search;
  if (landingFormDataString === '') return '';

  const dates = landingFormDataString
    .substring(1)
    .split('&')
    .filter((entry) => entry.startsWith('date'))
    .map((date) => date.split('=')[1]);
  const haveTwoValidDates = dates.length === 2
    && dates.every((date) => /\d{2}\.\d{2}\.\d{4}/.test(date));
  if (!haveTwoValidDates) return '';

  const [date1, date2] = dates.map(
    (date) => (date.split('.')
      .map((datePart) => parseInt(datePart, 10))
      .reverse()),
  );
  return `[[${date1}],[${date2}]]`;
};

const setSelectedDates = (datepicker) => {
  const selectedDates = getSelectedDates();
  if (selectedDates !== '') {
    $(datepicker).attr('data-select-date', selectedDates);
  }
};

$(() => {
  const $datepickerInputs = $('.js-date-dropdown__input[data-date="1"], .js-date-dropdown_type_filter__input, .js-datepicker-init-element');
  if ($datepickerInputs.length === 1) {
    setSelectedDates($datepickerInputs[0]);
  }
  $datepickerInputs.each(function performDatePickersInits() {
    const datePickerInstance = datePickerInit(this);
    const dates = $(this).data('selectDate');
    if (dates !== undefined) {
      const dateArray = dates.map((date) => new Date(date));
      datePickerInstance.selectDate(dateArray);
    }
  });
});
