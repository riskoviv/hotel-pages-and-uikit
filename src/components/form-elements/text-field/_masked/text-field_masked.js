const $maskedInput = $('.js-text-field__input_masked');

$maskedInput.on('keydown', function (event) {
  const key = event.key;
  if (key >= 0 && key <= 9)
    return true;
  else {
    switch (key) {
      case 'Backspace':
      case 'Delete':
      case 'ArrowRight':
      case 'ArrowLeft':
        return true;
    }
  }
  return false;
});

$maskedInput.on('keyup', function (event) {
  if (this.value.length === 2 || this.value.length === 5) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.value = this.value.slice(0, -1);
    } else {
      this.value += '.';
    }
  }
});
