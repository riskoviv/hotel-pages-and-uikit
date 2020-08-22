const $maskedInput = $('.text-field_masked__input')

$maskedInput.keydown(function (event) {
  const key = event.key
  if (
    key >= 0 && key <= 9
    || key === 'Backspace'
    || key === 'Delete'
    || key === 'ArrowRight'
    || key === 'ArrowLeft'
  )
    return true
  return false
})

$maskedInput.keyup(function (event) {
  if (this.value.length == 2 || this.value.length == 5)
    if (event.key == 'Backspace')
      this.value = this.value.slice(0, -1)
    else
      this.value += '.'
})