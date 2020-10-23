import 'normalize.css';
import '@styles/global.scss';

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

export { requireAll };
