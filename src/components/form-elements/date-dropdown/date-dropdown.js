const airDatePicker = require('air-datepicker')

$(() => {
  const changeNavIcons = () => {
    $('.datepicker--nav-action').addClass('material-icons')
  }
  const disableNavTitle = () => {
    $('.datepicker--nav-title').prop('disabled', true)
  }
  const setCustomOptions = () => {
    changeNavIcons()
    disableNavTitle()
    $('.datepicker--nav-title').addClass('heading-2')
    $('.datepicker--button[data-action="clear"]')
      .addClass('button button_link button_link_clear')
  }
  const date1 = $('#date1')
  const date2 = $('#date2')
  const setDates = (selectedDates) => {
    const dates = selectedDates.split(',')
    $(date1).val(dates[0] || '')
    $(date2).val(dates[1] || '')
  }
  var myDatepicker = $('#datepicker').datepicker().data('datepicker');

  $('#datepicker').datepicker({
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
      setDates(formattedDate)
      setCustomOptions()
    }
  })

  setCustomOptions()

  $('.datepicker--buttons')
    .append('<button class="button button_link">Применить</button>')
  $('.datepicker--buttons > button').click(function () {
    myDatepicker.hide()
  })
})