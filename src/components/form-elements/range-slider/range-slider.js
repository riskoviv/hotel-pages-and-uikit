import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';

const rangeSlider = document.querySelector('.range-slider');
const slider = document.querySelector('.range-slider__slider');

if (slider && rangeSlider) {
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
        const val = value ? (`${value / 1000} 000`) : 0;
        return `${val}₽`;
      },
      from(value) {
        return Number(value.replace('₽', ''));
      },
    },
  });

  const rangeValues = document.querySelector('.range-slider__values');

  slider.noUiSlider.on('update', (values) => {
    rangeValues.innerText = `${values[0]} - ${values[1]}`;
  });
}
