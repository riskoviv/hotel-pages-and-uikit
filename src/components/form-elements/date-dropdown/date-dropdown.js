const airDatePicker = require('air-datepicker');

const datePickerInit = (datepicker) => {
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
      if (formattedDate !== '') {
        makeClearButtonVisible();
      }
    },
    onShow() {
      setCustomOptions();
    },
  })

  const calendarClass = '.' + $(datepicker).data('classes');
  const $calendarClearButton = $(`${calendarClass} .datepicker--button[data-action="clear"]`);

  const disableNavTitle = () => {
    $(`${calendarClass} .datepicker--nav-title`).prop('disabled', true);
  };

  const setCustomOptions = () => {
    disableNavTitle();
    $(`${calendarClass} .datepicker--nav-title`).addClass('heading-2');
    $calendarClearButton.addClass('button button_link button_link_clear');
  };

  const makeClearButtonVisible = () => {
    $calendarClearButton.css('visibility', 'visible');
  };

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
  };

  const printDates = () => {
    if (!isFilter) {
      $(datepicker).val('date');
      $date1.val(savedDates[0] || '');
      $date2.val(savedDates[1] || '');
    } else {
      $(datepicker).val(savedDatesFilter);
    }
  };
   
  
  setCustomOptions();

  const myDatepicker = $(datepicker).datepicker().data('datepicker');
  
  $(`${calendarClass} .datepicker--buttons`)
    .append('<button class="button button_link">Применить</button>');
  $(`${calendarClass} .datepicker--buttons > button`)
    .on('click', function () {
      printDates();
      myDatepicker.hide();
    });
  $calendarClearButton.on('click', function () {
    $(this).css('visibility', 'hidden');
  });
}

$(() => {
  const $datepickerInputs = $('.datepicker-here');
  $datepickerInputs.each(function() {
    datePickerInit(this);
    const datePicker = $(this).datepicker().data('datepicker');
    const dates = $(this).data('selectDate');
    if (dates) {
      const dateArray = dates.map((date) => {
        return new Date(date);
      });
      datePicker.selectDate(dateArray);
    }
    console.log('datePicker: ', datePicker);
  });
});
