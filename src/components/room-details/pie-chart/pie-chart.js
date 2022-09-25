// eslint-disable-next-line no-unused-vars
import peity from 'peity';

$(() => {
  const $pieInitElement = $('.js-pie-chart__pie');
  if ($pieInitElement.length === 0) {
    return;
  }

  const colors = ['black', 'purple', 'green', 'orange'];
  const values = $pieInitElement.data('values');
  const fillGradients = values.flatMap((value, index) => {
    if (value === 0) return null;

    return [`url(#${colors[index]}-gradient) ${colors[index]}`, '#fff'];
  }).filter((fill) => fill !== null);

  $pieInitElement.peity('donut', {
    fill: fillGradients,
  });

  const gradients = colors.map((color) => `
    <linearGradient id="${color}-gradient" x1="0" x2="0" y1="0" y2="1">
      <stop class="${color}-stop1" offset="0%"></stop>
      <stop class="${color}-stop2" offset="100%"></stop>
    </linearGradient>
  `).join('');

  const $peitySvg = $('.peity');
  const ns = 'http://www.w3.org/2000/svg';
  const $defs = $(document.createElementNS(ns, 'defs'));
  $defs.html(gradients);
  $peitySvg.prepend($defs);
});
