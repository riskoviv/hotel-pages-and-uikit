import 'air-datepicker';

function datePickerInit(datepicker) {
  let onSelectCounter = 0;
  let setCustomOptions;
  let hideClearButton;
  let showClearButton;
  let printDates;
  let saveDates;
  let isFilter;
  const datepickerElement = $(datepicker);
  const $date1 = datepickerElement;
  const $date2 = $date1.closest('.js-date-dropdown').find('.js-date-dropdown__input[data-date="2"]');

  const moveToLeftEdgeIfMobileS = () => {
    const mobileSMediaQuery = window.matchMedia('(max-width: 320px)');
    if (mobileSMediaQuery.matches) {
      $(datepicker).data('datepicker').$datepicker.css('left', '0');
    }
  };

  // datepicker initialization
  $(datepicker).datepicker({
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
      const isDateSelectedManually = ($(datepicker).data('selectDate') !== ''
        && onSelectCounter > 2)
        || $(datepicker).data('selectDate') === undefined;
      if (isDateSelectedManually) {
        $(datepicker).val('');
        if (!isFilter) {
          $date1.val('');
          $date2.val('');
        }
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
        && $date1.val() === '' && $date2.val() === '';
      if (datesSelectedButNotSaved) {
        inst.clear();
      }
      setCustomOptions();
      if ($(datepicker).val() === '') {
        hideClearButton();
      } else {
        showClearButton();
      }
    },
    onHide(inst) {
      if (inst.selectedDates.length === 1) inst.clear();
    },
  });

  const calendarClass = $(datepicker).data('classes');
  const $calendarClearButton = $(`.${calendarClass} .datepicker--button[data-action="clear"]`);

  function disableNavTitle() {
    $(`.${calendarClass} .datepicker--nav-title`).prop('disabled', true);
  }

  setCustomOptions = () => {
    moveToLeftEdgeIfMobileS();
    disableNavTitle();
    $(`.${calendarClass} .datepicker--nav-title`).addClass('heading-2');
    $calendarClearButton.addClass('button button_type_link button_type_clear');
  };

  showClearButton = () => {
    $calendarClearButton.removeClass('button_hidden');
  };

  hideClearButton = () => {
    $calendarClearButton.addClass('button_hidden');
  };

  isFilter = $(datepicker).hasClass('js-date-dropdown_type_filter__input');

  const datepickerInstance = datepickerElement.data('datepicker');
  const date2ClickHandler = () => {
    datepickerInstance.show();
  };
  if ($date2.length > 0) {
    $date2.on('click', date2ClickHandler);
    $date2[0].addEventListener('pointerdown', date2ClickHandler);
  }

  let savedDates = [];
  let savedDatesFilter = '';

  saveDates = (selectedDates) => {
    if (isFilter) {
      savedDatesFilter = $(datepicker).val();
    } else {
      savedDates = selectedDates.split(',');
    }
    if (selectedDates === '') {
      if (isFilter) {
        $(datepicker).val('');
      } else {
        $(datepicker).val('');
        $date1.val('');
        $date2.val('');
      }
    }
  };

  printDates = () => {
    if (!isFilter) {
      $date1.val(savedDates[0] || '');
      $date2.val(savedDates[1] || '');
    } else {
      $date1.val(savedDatesFilter);
    }
  };

  setCustomOptions();

  const myDatepicker = $(datepicker).datepicker().data('datepicker');

  $(`.${calendarClass} .datepicker--buttons`)
    .append('<button class="button button_type_link">Применить</button>');
  $(`.${calendarClass} .datepicker--buttons > button`)
    .on('click', () => {
      printDates();
      myDatepicker.hide();
    });
  $calendarClearButton.on('click', hideClearButton);
}

function getSelectedDates() {
  if (window.location.search === '') return '';

  const dates = window.location.search
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
}

function setSelectedDates(datepicker) {
  const selectedDates = getSelectedDates();
  if (selectedDates !== '') {
    $(datepicker).attr('data-select-date', selectedDates);
  }
}

$(() => {
  const $datepickerInputs = $('.js-date-dropdown__input[data-date="1"], .js-date-dropdown_type_filter__input, .js-datepicker-init-element');
  if ($datepickerInputs.length === 1) {
    setSelectedDates($datepickerInputs[0]);
  }
  $datepickerInputs.each(function performDatePickersInits() {
    datePickerInit(this);
    const datePicker = $(this).data('datepicker');
    const dates = $(this).data('selectDate');
    if (dates) {
      const dateArray = dates.map((date) => new Date(date));
      datePicker.selectDate(dateArray);
    }
  });
});
