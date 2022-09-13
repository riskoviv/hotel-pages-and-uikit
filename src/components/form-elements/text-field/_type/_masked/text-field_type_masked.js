const $maskedInput = $('.js-text-field__input_type_masked');

const maskedInputKeydownHandler = (event) => {
  const { key } = event;
  const keyIsNumber = !Number.isNaN(parseInt(key, 10));
  if (keyIsNumber) return true;

  switch (key) {
    case 'Backspace':
    case 'Delete':
    case 'ArrowRight':
    case 'ArrowLeft':
      return true;
    default:
      return false;
  }
};

$maskedInput.on('keydown', maskedInputKeydownHandler);

const getDatePartsArray = (sourceValue) => {
  const numbersOnlyValue = sourceValue.replaceAll(/\D/g, '');
  if (sourceValue.length > 5) {
    const dayMonthYearArray = [
      numbersOnlyValue.slice(0, 2),
      numbersOnlyValue.slice(2, 4),
      numbersOnlyValue.slice(4),
    ];
    return dayMonthYearArray;
  }

  if (sourceValue.length > 2) {
    const dayMonthArray = [
      numbersOnlyValue.slice(0, 2),
      numbersOnlyValue.slice(2),
    ];
    return dayMonthArray;
  }

  return [numbersOnlyValue];
};

const fixDate = (sourceValue) => {
  const dateParts = getDatePartsArray(sourceValue);
  let [day, month] = dateParts;
  const [, , year] = dateParts;

  if (day > 31) {
    day = 31;
  }

  if (month === undefined) {
    return day;
  }

  if (month > 12) {
    month = 12;
  }

  switch (month) {
    case '02': {
      const unknownYearAndMoreThanMaxFebDay = year === undefined && day > 29;
      const knownYearAndMoreThanMaxFebDay = year !== undefined && day > 28;
      if (unknownYearAndMoreThanMaxFebDay) {
        day = 29;
      } else if (knownYearAndMoreThanMaxFebDay) {
        const yearIs21stCentury = year > 2000 && year < 2100;
        if (yearIs21stCentury) {
          // get last day of february of that year
          const lastFebDayDate = new Date(`${year}-03-01`);
          const dayInMs = 24 * 60 * 60 * 1000;
          lastFebDayDate.setTime(lastFebDayDate.getTime() - dayInMs);
          day = lastFebDayDate.getDate();
        }
      }
      break;
    }
    case '04':
    case '06':
    case '09':
    case '11':
      // 30-days months
      if (day > 30) {
        day = 30;
      }
      break;
    default:
      // 31-days months
      if (day > 31) {
        day = 31;
      }
  }

  if (year === undefined) {
    return `${day}.${month}`;
  }

  return `${day}.${month}.${year}`;
};

const maskedInputInputHandler = (event) => {
  const { target } = event;
  const { value } = target;
  target.value = fixDate(value);
};

$maskedInput.on('input', maskedInputInputHandler);
