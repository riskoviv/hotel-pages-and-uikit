import { requireAll } from '../common/common';

// pattern to take each .js & .scss files except of the ones with __tests__ directory https://regex101.com/r/J8NWTj/1
requireAll(require.context('./', true, /^\.\/(?!.*(?:__tests__)).*\.(scss)$/));