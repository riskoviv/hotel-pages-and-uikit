import 'normalize.css'
import './styles/global.scss'

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext)
}

// pattern to take each .js & .scss files except of the ones with __tests__ directory https://regex101.com/r/J8NWTj/1
requireAll(require.context('./layouts', true, /^\.\/(?!.*(?:__tests__)).*\.(js)|(scss)$/))  
requireAll(require.context('./components', true, /^\.\/(?!.*(?:__tests__)).*\.(js)|(scss)$/))
requireAll(require.context('./pages', true, /^\.\/(?!.*(?:__tests__)).*\.(js)|(scss)$/))
