$(document).ready(function () {
  $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 16,
      values: [ 5, 10 ],
      slide: function( event, ui ) {
        $( "#amount" ).text( `${ui.values[0] ? ui.values[0] + ' 000' : '0'}₽ - ${ui.values[1] ? ui.values[1] + ' 000' : '0'}₽` );
      }
    });
    $( "#amount" ).text( `${$( "#slider-range" ).slider( "values", 0 )} 000₽ - ${$( "#slider-range" ).slider( "values", 1 )} 000₽` );
});