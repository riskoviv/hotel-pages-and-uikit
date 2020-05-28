import * as $ from 'jquery'
import WebpackLogo from '@/assets/icon.png'
import './styles/styles.sass'

const title1 = document.querySelector('h1')

const image = document.createElement('img');
image.src = WebpackLogo;
image.className = 'webpack-image';
title1.after(image);

$("h1").click(function () {
  $(this).text('Clicked!');
});
