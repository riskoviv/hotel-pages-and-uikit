import '@vendor/peity/jquery.peity.min';

$(() => {
  const colorCodes = {
    purple: ['#BC9CFF', '#8BA4F9'],
    green: ['#6FCF97', '#66D2EA'],
    orange: ['#FFE39C', '#FFBA9C'],
    black: ['#919191', '#3D4975'],
  };

  const $pieInitElement = $('.pie-chart__pie');
  const whiteSpace = $pieInitElement.data('whitespace');
  $pieInitElement.peity('donut');
  
  const $peitySvg = $('.peity');

  (function addIDs() {
    const $paths = $peitySvg.find(`path:not([data-value="${whiteSpace}"])`);
    $paths.each(function (index) {
      $(this).attr('id', Object.keys(colorCodes)[index]);
    })
  }())
  
  // const styles = `
  //   <style>
  //     ${Object.keys(colorCodes).map((color) => {
  //       return `
  //         #${color} { fill: url(#${color}-gradient) ${color}; }
  //         .${color}-stop1 { stop-color: ${colorCodes[color][0]}; }
  //         .${color}-stop2 { stop-color: ${colorCodes[color][1]}; }
  //       `;
  //     }).join('')}
  //     [data-value="${whiteSpace}"] { fill: white; }
  //   </style>
  // `;

  const gradients = `
    ${Object.keys(colorCodes).map((color) => {
      return `
        <linearGradient id="${color}-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop class=${color}-stop1 offset="0%"></stop>
          <stop class=${color}-stop2 offset="100%"></stop>
        </linearGradient>
      `;
    }).join('')}
  `;
  
  // $peitySvg.prepend(styles);
  $peitySvg.append(gradients);

});
