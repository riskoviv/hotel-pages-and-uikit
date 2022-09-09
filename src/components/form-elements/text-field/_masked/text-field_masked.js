const $maskedInput = $('.js-text-field__input_masked');

$maskedInput.on('keydown', (event) => {
  const { key } = event;
  if (key >= 0 && key <= 9) return true;

  switch (key) {
    case 'Backspace':
    case 'Delete':
    case 'ArrowRight':
    case 'ArrowLeft':
      return true;
    default:
      return false;
  }
});

const getDottedValue = (sourceValue) => {
  const numbersOnlyValue = sourceValue.replaceAll(/\D/g, '');
  if (sourceValue.length > 5) {
    const twoDottedValue = `${numbersOnlyValue.slice(0, 2)}.${numbersOnlyValue.slice(2, 4)}.${numbersOnlyValue.slice(4)}`;
    return twoDottedValue;
  }

  if (sourceValue.length > 2) {
    const oneDottedValue = `${numbersOnlyValue.slice(0, 2)}.${numbersOnlyValue.slice(2)}`;
    return oneDottedValue;
  }

  return sourceValue;
};

const fixDate = (sourceDate) => {
  const [day, month, year] = sourceDate.split('.');
  if (year !== undefined) {

  }
  const fixedDate = sourceDate;
  return fixedDate;
};

$maskedInput.on('input', (event) => {
  const { target } = event;
  const { value } = target;
  const dottedValue = getDottedValue(value);
  target.value = fixDate(dottedValue);
});
