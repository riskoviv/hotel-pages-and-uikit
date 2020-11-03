import '@vendor/peity/jquery.peity.min';

$(() => {
  const colors = ["purple", "green", "orange", "black"];
  const colorCodes = {
    purple: ['#BC9CFF', '#8BA4F9'],
    green: ['#6FCF97', '#66D2EA'],
    orange: ['#FFE39C', '#FFBA9C'],
    black: ['#919191', '#3D4975'],
  };

  const $pieInitElement = $('.pie-chart__pie');
  const whiteSpace = $pieInitElement.data('whitespace');
  $pieInitElement.peity('donut', {
    fill: function (value) {
      return value === whiteSpace ? "white" : `url(#${colors.shift()}-gradient)`;
    },
  });
  
  const $peitySvg = $('.peity');

  const gradients = `
    <defs>
      ${Object.keys(colorCodes).map((color) => {
        return `
          <linearGradient id="${color}-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="${colorCodes[color][0]}"></stop>
            <stop offset="100%" stop-color="${colorCodes[color][1]}"></stop>
          </linearGradient>
        `;
      }).join('')}
    </defs>
  `;
  
  $peitySvg.prepend(gradients);

});
