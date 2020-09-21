const airDatePicker = require('air-datepicker');

const datePickerInit = (datepicker) => {
  const calendarClass = '.' + $(datepicker).data('classes');

  const disableNavTitle = () => {
    $(`${calendarClass} .datepicker--nav-title`).prop('disabled', true);
  };

  const setCustomOptions = () => {
    disableNavTitle();
    $(`${calendarClass} .datepicker--nav-title`)
      .addClass('heading-2');
    $(`${calendarClass} .datepicker--button[data-action="clear"]`)
      .addClass('button button_link button_link_clear');
  }
  const isFilter = $(datepicker).hasClass('date-dropdown_filter__input');

  const $date1 = $('.date-1', datepicker.parentNode);
  const $date2 = $('.date-2', datepicker.parentNode);
  let savedDates = [];
  let savedDatesFilter = '';
  const saveDates = (selectedDates) => {
    if (!isFilter)
      savedDates = selectedDates.split(',');
    else
      savedDatesFilter = $(datepicker).val();
    if (!selectedDates) {
      if (!isFilter) {
        $(datepicker).val('');
        $date1.val('');
        $date2.val('');
      } else {
        $(datepicker).val('');
      }
    }
  }
  const printDates = () => {
    if (!isFilter) {
      $(datepicker).val('date');
      $date1.val(savedDates[0] || '');
      $date2.val(savedDates[1] || '');
    } else {
      $(datepicker).val(savedDatesFilter);
    }
  }
  const myDatepicker = $(datepicker).datepicker().data('datepicker');
  
  let onSelectCounter = 0;

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
      onSelectCounter++;
      saveDates(formattedDate);
      const isDateSelectedManually =
        $(datepicker).data('selectDate') && onSelectCounter > 2  || !$(datepicker).data('selectDate');
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
    },
  })
  
  setCustomOptions();
  
  $(`${calendarClass} .datepicker--buttons`)
    .append('<button class="button button_link">Применить</button>');
  $(`${calendarClass} .datepicker--buttons > button`)
    .on('click', function () {
      printDates();
      myDatepicker.hide();
    });
}

$(() => {
  const $datepickerInputs = $('.datepicker-here');
  for (let datepickerInput of $datepickerInputs) {
    datePickerInit(datepickerInput);
    const dates = $(datepickerInput).data('selectDate');
    if (dates) {
      const dateArray = [];
      for (let date of dates) {
        dateArray.push(new Date(date));
      }
      const datePicker = $(datepickerInput).datepicker().data('datepicker');
      datePicker.selectDate(dateArray);
    }
  }
});
