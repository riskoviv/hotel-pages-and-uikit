import * as $ from 'jquery'
import './styles/styles.sass'

$("h2").click(function () {
  $(this).text('Clicked!');
});
