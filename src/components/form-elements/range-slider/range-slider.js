import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';

const rangeSlider = document.querySelector('.range-slider');
const slider = document.querySelector('.range-slider__slider');

if (slider !== null && rangeSlider !== null) {
  const range = JSON.parse(rangeSlider.dataset.range);
  noUiSlider.create(slider, {
    range: {
      min: range[0],
      max: range[1],
    },
    start: JSON.parse(rangeSlider.dataset.start),
    connect: true,
    step: 1000,
    format: {
      to(value) {
        const fixedValue = value.toFixed(0);
        const fixedNumberValue = Number(fixedValue);
        if (fixedNumberValue === '0') return '0₽';
        if (fixedNumberValue < 1e3) return `${fixedValue}₽`;
        const millions = fixedNumberValue >= 1e6 ? fixedValue.slice(0, -6) : '';
        const thousands = fixedValue.slice(-6, -3);
        const units = fixedValue.slice(-3);
        const spacedValue = [millions, thousands, units].join(' ').trim();
        return `${spacedValue}₽`;
      },
      from(value) {
        return Number(value.replace(/[\s₽]/g, ''));
      },
    },
  });

  const rangeValues = document.querySelector('.range-slider__values');

  slider.noUiSlider.on('update', (values) => {
    rangeValues.innerText = `${values[0]} - ${values[1]}`;
  });
}
