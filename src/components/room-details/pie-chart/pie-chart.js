require('@vendor/peity/jquery.peity.min');

$(() => {
  // const colors = ["purple", "green", "orange", "black"];
  const colorCodes = {
    purple: ['#FFE39C', '#FFBA9C'],
    green: ['#6FCF97', '#66D2EA'],
    orange: ['#BC9CFF', '#8BA4F9'],
    black: ['#919191', '#3D4975'],
  };

  $('.pie-chart__pie').peity('donut');
  // $('.pie-chart__pie').peity('donut', {
  //   fill: function (value) {
  //     return value === 1 ? "white" : `url(#${colors.shift()})`;
  //   },
  // });

  const $peitySvg = $('.peity');

  (function addIDs() {
    const $paths = $peitySvg.find('path:not([data-value="1"])');
    $paths.each(function (index) {
      $(this).attr('id', Object.keys(colorCodes)[index]);
    })
  }())

  const gradients = `
    <defs>
      ${Object.keys(colorCodes).map((color) => {
        return `
          <linearGradient id="${color}-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop class=${color}-stop1 offset="0%"></stop>
            <stop class=${color}-stop2 offset="100%"></stop>
          </linearGradient>
        `;
      }).join('')}
      <style type="text/css"><![CDATA[
        ${Object.keys(colorCodes).map((color) => {
          return `
            #${color} { fill: url(#${color}-gradient); }
            .${color}-stop1 { stop-color: ${colorCodes[color][0]}; }
            .${color}-stop2 { stop-color: ${colorCodes[color][1]}; }
          `
        }).join('')}
        [data-value="1"] { fill: white; }
      ]]></style>
    </defs>
  `;

  $peitySvg.prepend(gradients);
});


// `<linearGradient id="purple" x1="0" x2="0" y1="0" y2="1">
// <stop offset="0%" stop-color="#BC9CFF"></stop>
// <stop offset="100%" stop-color="#8BA4F9"></stop>
// </linearGradient>
// <linearGradient id="green" x1="0" x2="0" y1="0" y2="1">
// <stop offset="0%" stop-color="#6FCF97"></stop>
// <stop offset="100%" stop-color="#66D2EA"></stop>
// </linearGradient>
// <linearGradient id="orange" x1="0" x2="0" y1="0" y2="1">
// <stop offset="0%" stop-color="#FFE39C"></stop>
// <stop offset="100%" stop-color="#FFBA9C"></stop>
// </linearGradient>
// <linearGradient id="black" x1="0" x2="0" y1="0" y2="1">
// <stop offset="0%" stop-color="#919191"></stop>
// <stop offset="100%" stop-color="#3D4975"></stop>
// </linearGradient>`