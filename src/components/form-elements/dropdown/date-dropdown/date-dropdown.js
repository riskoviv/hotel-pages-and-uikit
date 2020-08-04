const airDatePicker = require('air-datepicker')
const changeNavIcons = () => {
  $('.datepicker--nav-action').addClass('material-icons')
}
const setDates = () => {
  var myDatepicker = $('#date1').datepicker().data('datepicker')
  // console.log(myDatepicker);

  const dates = myDatepicker.selectedDates
  $('#date1').val(dates[0] ? dates[0].toLocaleDateString() : '')
  $('#date2').val(dates[1] ? dates[1].toLocaleDateString() : '')
}

$('#date1').datepicker({
  inline: false,
  range: true,
  clearButton: true,
  prevHtml: 'arrow_back',
  nextHtml: 'arrow_forward',
  offset: 5,
  onChangeMonth() {
    changeNavIcons()
  },
  onSelect() {
    setDates()
    changeNavIcons()
  },
  selectOtherYears: false
})

$(() => {
  changeNavIcons()
  $('.datepicker--nav-title').off('click')
  
})