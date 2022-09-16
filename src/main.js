import 'normalize.css';
// eslint-disable-next-line import/no-unresolved
import '@styles/global.scss';

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

// pattern to take each .js & .scss files
const stylesAndScripts = [
  import.meta.webpackContext('./components', {
    recursive: true, regExp: /^\.\/.*\.(js|scss|jpg)$/,
  }),
  import.meta.webpackContext('./layouts', {
    recursive: true, regExp: /^\.\/.*\.scss$/,
  }),
  import.meta.webpackContext('./pages', {
    recursive: true, regExp: /^\.\/.*\.(js|scss|jpg)$/,
  }),
];

stylesAndScripts.forEach(requireAll);
