import * as $ from 'jquery'
import './styles/styles.scss'

$('h2').click(function () {
  switch ($(this).css('color')) {
    case 'rgb(31, 32, 65)':
      $(this).css('color', 'rgb(188, 156, 255)')
      break
    case 'rgb(188, 156, 255)':
      $(this).css('color', 'rgb(111, 207, 151)')
      break
    case 'rgb(111, 207, 151)':
      $(this).css('color', 'rgb(31, 32, 65)')
      break
  }
});
