import '@vendor/peity/jquery.peity.min';

$(() => {
  let colors = ['orange', 'green', 'purple', 'black'];

  const $pieInitElement = $('.pie-chart__pie');
  const whiteSpace = $pieInitElement.data('whitespace');

  $.fn.peity.defaults.donut = {
    fill: ['#bc9cff', '#bc9cff80'],
  };

  $pieInitElement.peity('donut');
  
  const $peitySvg = $('.peity');
  const values = $($pieInitElement).data('values');
  const zeroIndexes = [];

  values.forEach(function (item, index) {
    if (item === 0) {
      zeroIndexes.push(index);
    }
  });

  if (zeroIndexes.length !== 0) {
    colors = colors.filter((colorItem, colorIndex, colorsArray) => {
      return (zeroIndexes.indexOf(colorIndex) === -1);
    });
  }

  if (colors.length > 0) {
    (function addIDs() {
      const $paths = $peitySvg.find(`path:not([data-value="${whiteSpace}"])`);
      $paths.each(function (index) {
        $(this).attr('id', colors[index]);
      });
      const $pathsWhitespaces = $peitySvg.find(`path[data-value="${whiteSpace}"]`);
      $pathsWhitespaces.addClass('peity__whitespace');
    }());

    const gradients = `
      ${colors.map((color) => {
        return `
          <linearGradient id="${color}-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop class=${color}-stop1 offset="0%"></stop>
            <stop class=${color}-stop2 offset="100%"></stop>
          </linearGradient>
        `;
      }).join('')}
    `;
    
    const ns = 'http://www.w3.org/2000/svg';
    const $defs = $(document.createElementNS(ns, 'defs'));
    $defs.html(gradients);
    $peitySvg.prepend($defs);
  }
});
