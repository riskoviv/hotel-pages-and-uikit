const $maskedInput = $('.js-text-field__input_masked');

    switch (key) {
      case 'Backspace':
      case 'Delete':
      case 'ArrowRight':
      case 'ArrowLeft':
        return true;
    }
$maskedInput.on('keydown', (event) => {
  const { key } = event;
  if (key >= 0 && key <= 9) return true;

  }
  return false;
});

$maskedInput.on('keyup', (event) => {
  const { target } = event;
  if (target.value.length === 2 || target.value.length === 5) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      target.value = target.value.slice(0, -1);
    } else {
      target.value += '.';
    }
  }
});
