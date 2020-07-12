// import * as $ from 'jquery'
import 'normalize.css'
import './styles/global.scss'

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

requireAll(require.context('./layouts', true, /^\.\/(?!.*(?:__tests__)).*\.(jsx?)|(scss)$/));  // pattern to take each .js(x) & .scss files except of the ones with __tests__ directory https://regex101.com/r/J8NWTj/1
requireAll(require.context('./components', true, /^\.\/(?!.*(?:__tests__)).*\.(jsx?)|(scss)$/));
requireAll(require.context('./pages', true, /^\.\/(?!.*(?:__tests__)).*\.(jsx?)|(scss)$/));

// just test script
// $('h2').click(function () {
//   switch ($(this).css('color')) {
//     case 'rgb(31, 32, 65)':
//       $(this).css('color', 'rgb(188, 156, 255)')
//       break
//     case 'rgb(188, 156, 255)':
//       $(this).css('color', 'rgb(111, 207, 151)')
//       break
//     case 'rgb(111, 207, 151)':
//       $(this).css('color', 'rgb(31, 32, 65)')
//       break
//   }
// });
