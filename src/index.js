import * as $ from 'jquery'
import './styles/styles.sass'

$("h1").click(function () {
  $(this).text('Clicked!');
});
