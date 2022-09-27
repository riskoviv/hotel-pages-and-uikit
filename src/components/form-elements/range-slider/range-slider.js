import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';

const rangeSliders = document.querySelectorAll('.js-range-slider');

[...rangeSliders].forEach((rangeSlider) => {
  const slider = rangeSlider.querySelector('.js-range-slider__slider');
  if (slider === null) return;

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
        if (fixedNumberValue === 0) return '0₽';
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

  const rangeValues = rangeSlider.querySelector('.js-range-slider__values');
  const handleSliderUpdate = (values) => {
    rangeValues.innerText = `${values[0]} - ${values[1]}`;
  };
  slider.noUiSlider.on('update', handleSliderUpdate);
})
