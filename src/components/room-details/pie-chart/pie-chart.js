import '@vendor/peity/jquery.peity.min';

$(() => {
  const colors = ['purple', 'green', 'orange', 'black'];

  const $pieInitElement = $('.pie-chart__pie');
  const whiteSpace = $pieInitElement.data('whitespace');
  $pieInitElement.peity('donut');
  
  const $peitySvg = $('.peity');

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
  
  $peitySvg.append(gradients);

  const ns = 'http://www.w3.org/2000/svg';
  const $peitySvgNew = $(document.createElementNS(ns, 'svg'));
  $peitySvgNew.addClass('peity').attr('height', 120).attr('width', 120);
  $peitySvgNew.html($peitySvg.html());
  $peitySvg.remove();
  $peitySvgNew.insertAfter($pieInitElement);
});
