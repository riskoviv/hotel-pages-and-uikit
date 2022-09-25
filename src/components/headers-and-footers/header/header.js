const $websitePage = $('.js-website-page');
const $menuOpener = $('.js-header__menu-opener');
const menuOpenedClass = 'header__menu-opener_opened';
const handleMenuOpenerClick = () => {
  $menuOpener.text($menuOpener.hasClass(menuOpenedClass) ? 'menu' : 'close');
  $menuOpener.toggleClass(menuOpenedClass);
  $websitePage.toggleClass('website-page_non-scrollable');
};
$menuOpener.on('click', handleMenuOpenerClick);

const $submenuOpener = $('.js-header__submenu-opener');
const handleSubMenuOpenerClick = (e) => {
  const $currentOpener = $(e.currentTarget);
  $currentOpener.toggleClass('header__submenu-opener_active');
  $currentOpener.parent().toggleClass('header__menu-item-container_active');
};
$submenuOpener.on('click', handleSubMenuOpenerClick);
