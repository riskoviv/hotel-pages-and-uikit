require('@vendor/peity/jquery.peity.min');

$(() => {
  const colors = ["purple", "green", "orange", "black"];
  $('.pie-chart__pie').peity('donut', {
    fill: function (value) {
      return value === 1 ? "white" : colors.shift();
    }
  });
});