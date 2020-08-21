const airDatePicker = require('air-datepicker')

const datePickerInit = (datepicker) => {
  const calendarClass = '.' + $(datepicker).data('classes')

  const changeNavIcons = () => {
    $(`${calendarClass} .datepicker--nav-action`).addClass('material-icons')
  }
  const disableNavTitle = () => {
    $(`${calendarClass} .datepicker--nav-title`).prop('disabled', true)
  }
  const setCustomOptions = () => {
    changeNavIcons()
    disableNavTitle()
    $(`${calendarClass} .datepicker--nav-title`)
      .addClass('heading-2')
    $(`${calendarClass} .datepicker--button[data-action="clear"]`)
      .addClass('button button_link button_link_clear')
  }
  const $date1 = $('.date-1', datepicker.parentNode)
  const $date2 = $('.date-2', datepicker.parentNode)
  const setDates = (selectedDates) => {
    const dates = selectedDates.split(',')
    $date1.val(dates[0] || '')
    $date2.val(dates[1] || '')
  }
  var myDatepicker = $(datepicker).datepicker().data('datepicker');
  
  $(datepicker).datepicker({
    inline: false,
    range: true,
    clearButton: true,
    prevHtml: 'arrow_back',
    nextHtml: 'arrow_forward',
    offset: 5,
    navTitles: {
      days: 'MM yyyy'
    },
    onChangeMonth() {
      setCustomOptions()
    },
    onSelect(formattedDate) {
      if (!$(datepicker).hasClass('date-dropdown_filter__input'))
        setDates(formattedDate)
      setCustomOptions()
    }
  })
  
  setCustomOptions()
  
  $(`${calendarClass} .datepicker--buttons`)
    .append('<button class="button button_link">Применить</button>')
  $(`${calendarClass} .datepicker--buttons > button`)
    .click(function () {
      myDatepicker.hide()
    })

}

$(() => {
  const $datepickerInputs = $('.datepicker-here')
  for (let datepickerInput of $datepickerInputs) {
    datePickerInit(datepickerInput)
  }
})