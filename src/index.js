import * as $ from 'jquery'
import WebpackLogo from '@/assets/icon.png'
import './styles/styles.sass'

const title1 = document.querySelector('.item-title')

const image = document.createElement('img');
image.src = WebpackLogo;
image.className = 'webpack-image';
title1.after(image);

$(".item-descr").click(function () {
  $(this).text('Clicked!');
});
