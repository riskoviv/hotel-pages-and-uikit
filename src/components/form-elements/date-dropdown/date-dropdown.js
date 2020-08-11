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
  }
  const date1 = $('#date1')
  const date2 = $('#date2')
  const setDates = (selectedDates) => {
    $('#datepicker').val('') // clear fake input
    const dates = selectedDates.split(',')
    $(date1).val(dates[0] || '')
    $(date2).val(dates[1] || '')
  }
  var myDatepicker = $('#datepicker').datepicker().data('datepicker');
  myDatepicker.show()

  $('#datepicker').datepicker({
    inline: false,
    range: true,
    clearButton: true,
    prevHtml: 'arrow_back',
    nextHtml: 'arrow_forward',
    offset: 5,
    navTitles: {
      days: 'MM <i>yyyy</i>'
    },
    onChangeMonth() {
      setCustomOptions()
    },
    onSelect(formattedDate) {
      setDates(formattedDate)
      setCustomOptions()
    },
    onShow() {
      // setCustomOptions()
    },
    onHide() {
      myDatepicker.show()
      setCustomOptions()
    }
  })
  setCustomOptions()
})