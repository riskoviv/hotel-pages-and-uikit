import 'air-datepicker';

function datePickerInit(datepicker) {
  let onSelectCounter = 0;
  let setCustomOptions;
  let hideClearButton;
  let showClearButton;
  let printDates;
  let saveDates;
  let isFilter;
  let $date1;
  let $date2;

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
    onShow() {
      moveToLeftEdgeIfMobileS();
      setCustomOptions();
      if ($(datepicker).val() === '') {
        hideClearButton();
      } else {
        showClearButton();
      }
    },
  });

  const calendarClass = $(datepicker).data('classes');
  const $calendarClearButton = $(`.${calendarClass} .datepicker--button[data-action="clear"]`);

  function disableNavTitle() {
    $(`.${calendarClass} .datepicker--nav-title`).prop('disabled', true);
  }

  setCustomOptions = () => {
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

  isFilter = $(datepicker).hasClass('js-date-dropdown_filter__input');

  $date1 = $(datepicker.parentNode).find('.js-date-1');
  $date2 = $(datepicker.parentNode).find('.js-date-2');
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
      $(datepicker).val(savedDates);
      $date1.val(savedDates[0] || '');
      $date2.val(savedDates[1] || '');
    } else {
      $(datepicker).val(savedDatesFilter);
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
  if (window.location.search !== '') {
    const entries = {};
    window.location.search
      .substring(1)
      .split('&')
      .forEach((entry) => {
        const [key, value] = entry.split('=');
        entries[key] = value;
      });
    if (entries.dates !== '') {
      const datesArray = decodeURIComponent(entries.dates)
        .split(',')
        .map((date) => (date
          .split('.')
          .map((datePart) => parseInt(datePart, 10))
          .reverse()));
      if (datesArray[1] !== undefined) {
        return `[[${datesArray[0]}],[${datesArray[1]}]]`;
      }
    }
  }
  return '';
}

function setSelectedDates(datepicker) {
  const selectedDates = getSelectedDates();
  if (selectedDates !== '') {
    $(datepicker).attr('data-select-date', selectedDates);
  }
}

$(() => {
  const $datepickerInputs = $('.js-datepicker-here');
  if ($datepickerInputs.length === 1) {
    setSelectedDates($datepickerInputs[0]);
  }
  $datepickerInputs.each(function performDatePickersInits() {
    datePickerInit(this);
    const datePicker = $(this).datepicker().data('datepicker');
    const dates = $(this).data('selectDate');
    if (dates) {
      const dateArray = dates.map((date) => new Date(date));
      datePicker.selectDate(dateArray);
    }
  });
});
