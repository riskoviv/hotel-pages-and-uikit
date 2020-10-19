import { requireAll } from '../../common/common';

// pattern to take each .js & .scss files except of the ones with __tests__ directory https://regex101.com/r/J8NWTj/1
requireAll(require.context('../../../layouts/website-page', false, /^\.\/(?!.*(?:__tests__)).*\.(scss)$/));
requireAll(require.context('../../../components/common', true, /^\.\/(?!.*(?:__tests__)).*\.(scss)$/));
requireAll(require.context('../../../components/form-elements', true, /^\.\/(?!.*(?:__tests__)).*\.(js)|(scss)$/));
requireAll(require.context('../../../components/cards', true, /^\.\/(?!.*(?:__tests__)).*\.(js)|(scss)$/));
requireAll(require.context('../../../components/headers-and-footers', true, /^\.\/(?!.*(?:__tests__)).*\.(js)|(scss)$/));
requireAll(require.context('./', true, /^\.\/(?!.*(?:__tests__)).*\.(scss)$/));