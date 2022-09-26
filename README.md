# Toxin
This project consists of:
- **UI kit** pages that demonstrates different components made using Pug template engine, styles written in SCSS and JS plugins some made using jQuery and some are using just vanilla JS, some components' JS is written without plugins.
- **Website pages** that constructed from those components and some additional code.


## GitHub Pages
[**Index page** that has links to all project pages is here](https://riskoviv.github.io/hotel-pages-and-uikit/assets/pages/index.html)

<details>

<summary>Or you can go to any individual project page on GitHub Pages from here</summary>

### UI kit
+ [Colors & Type](https://riskoviv.github.io/hotel-pages-and-uikit/assets/pages/colors-and-type.html)
+ [Form Elements](https://riskoviv.github.io/hotel-pages-and-uikit/assets/pages/form-elements.html)
+ [Cards](https://riskoviv.github.io/hotel-pages-and-uikit/assets/pages/cards.html)
+ [Headers & Footers](https://riskoviv.github.io/hotel-pages-and-uikit/assets/pages/headers-and-footers.html)

### Website pages
+ [Landing](https://riskoviv.github.io/hotel-pages-and-uikit/assets/pages/landing.html)
+ [Search room / Filter](https://riskoviv.github.io/hotel-pages-and-uikit/assets/pages/search-room.html)
+ [Room details](https://riskoviv.github.io/hotel-pages-and-uikit/assets/pages/room-details.html)
+ [Registration & Sign-in](https://riskoviv.github.io/hotel-pages-and-uikit/assets/pages/registration-and-sign-in.html)

</details>

Website pages have some navigation:

- Toxin logo is linked to the __Landing__ page;
- Search room form at the Landing page will open the __Search room / Filter__ page;
- Each room card in __Search room / Filter__ page will open the __Room details__ page;
- Register & Login buttons will open __Registration & Sign-in__ page with appropriate card (Registration or Login).

## NodeJS and JQuery
**nodejs v12** or any higher major version is required to be installed on your machine to compile this project.

**jQuery v3.6.0** library is bundled to the project from npm.

## Plugins used to accomplish this task
- air-datepicker: v2.2.3
- item-quantity-dropdown: v2.1.0
- nouislider: v14.7.0
- paginationjs: v2.1.5
- peity: v3.3.0

Webpack v5 is used to bundle project source files into files ready to use by browser:
- `pug` files to `html` files of ui-kit & website pages
- multiple `scss` files to one `css` file
- multiple `js` files to one `js` file

## Installation
After cloning of project, run `npm install` command in terminal to install packages and to make possible to build project.

To launch dev server run `npm run start`

### Scripts in package.json:
- `dev` – compiles project to `dist` folder using webpack in development mode
- `build` – compiles project to `dist` folder using webpack in production mode
- `watch` – runs script that watches changes in files of the project and makes fast recompiling (same as dev server but without server, useful with Live Server VSCode plugin)
- `start` – runs `dev` script to prepare assets if `dist` folder is missing and then runs webpack dev server that compiles code of project and enables watch mode and then opens one or more of any project pages in default browser from dev server's URI
- `deploy` – runs `build` script and then runs `gh-pages` script that pushes content of `dist` folder to gh-pages remote branch on github
