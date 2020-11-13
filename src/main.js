import 'normalize.css';
import '@styles/global.scss';

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

// pattern to take each .js & .scss files
requireAll(require.context('./layouts', true, /^\.\/.*\.scss$/));
requireAll(require.context('./components', true, /^\.\/.*\.(js|scss)$/));
requireAll(require.context('./pages', true, /^\.\/.*\.(js|scss)$/));