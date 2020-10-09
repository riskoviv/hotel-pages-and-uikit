window.onload = function () {
    jQuery('.slider').each(function () {
        jQuery(this).data('plugin_slider').resize();
    });
};

window.onresize = function () {
    jQuery('.slider').each(function () {
        jQuery(this).data('plugin_slider').resize();
    });
};
