;
(function ($, window, document, undefined) {

    "use strict";

    var pluginName = "slider";
    var defaults = {
        delay: 1000,
        interval: 10000,
        random: false,
        resize: false
    };

    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this.vari = {
            timer: undefined,
            slide: 1,
            slides: 0,
            sequence: []
        };
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            var self = this;
            var $slider = $(this.element);
            var $position = $slider.children('.position');
            var $change = $slider.children('.prev, .next');
            $slider.removeClass('no-js');
            $slider.children('.slides').find('img').each(function (index, element) {
                self.vari.slides++;
                if (self.vari.slides == self.vari.slide) {
                    $(element).addClass('active').css('opacity', '1');
                    $position.append('<div class="points active"></div>');
                } else {
                    $(element).css('opacity', '0');
                    $position.append('<div class="points"></div>');
                }
                var href = $(element).attr('data-href');
                if (href !== undefined) {
                    $(element).on('click', function () {
                        location.href = href;
                    });
                }
            });
            $change.animate({opacity: 0.5}, 'slow');
            $position.find('.points').each(function (index) {
                $(this).on('click', function () {
                    self.show(index + 1);
                });
            });
            $slider.hover(function () {
                clearInterval(self.vari.timer);
                $change.animate({opacity: 1}, 'slow');
            }, function () {
                self.auto();
                $change.animate({opacity: 0.5}, 'slow');
            });
            $slider.find('.prev > *').on('click', function () {
                self.prev();
            });
            $slider.find('.next > *').on('click', function () {
                self.next();
            });
            this.auto();
        },
        auto: function () {
            if (this.settings.interval === 0 || this.vari.slides <= 1) {
                return;
            }
            var self = this;
            this.vari.timer = setInterval(function () {
                if (self.settings.random === true) {
                    self.random();
                } else {
                    self.next();
                }
            }, this.settings.interval);
        },
        random: function () {
            var next = this.vari.sequence.shift();
            if (this.vari.sequence.length === 0) {
                var values = [];
                for (var i = 1; i <= this.vari.slides; i++) {
                    values.push(i);
                }
                if (next !== null && next !== undefined) {
                    this.vari.sequence.push(values.splice(next - 1, 1).shift());
                } else {
                    values.shift();
                }
                do {
                    this.vari.sequence.push(values.splice(Math.floor(Math.random() * (values.length)), 1).shift());
                } while (values.length > 0);
                next = this.vari.sequence.shift();
            }
            this.show(next);
        },
        next: function () {
            if (this.vari.slide < this.vari.slides) {
                this.show(this.vari.slide + 1);
            } else {
                this.show(1);
            }
        },
        prev: function () {
            if (this.vari.slide > 1) {
                this.show(this.vari.slide - 1);
            } else {
                this.show(this.vari.slides);
            }
        },
        show: function (slide) {
            var $slider = $(this.element);
            $slider.find('.slides img:nth-child(' + this.vari.slide + ')').stop().removeClass('active').animate({opacity: 0}, this.settings.delay);
            $slider.find('.position .points:nth-child(' + this.vari.slide + ')').removeClass('active');
            $slider.find('.text span:nth-child(' + this.vari.slide + ')').removeClass('active');
            this.vari.slide = slide;
            $slider.find('.slides img:nth-child(' + this.vari.slide + ')').stop().addClass('active').animate({opacity: 1}, this.settings.delay);
            $slider.find('.position .points:nth-child(' + this.vari.slide + ')').addClass('active');
            $slider.find('.text span:nth-child(' + this.vari.slide + ')').addClass('active');
            if (this.settings.resize === true) {
                this.resize();
            }
            return this;
        },
        resize: function (disable, animate) {
            if (disable === true) {
                return;
            }
            var $slider = $(this.element);
            var $activeImage = $slider.find('.slides .active');
            var $prevIcon = $slider.find('.prev > img');
            var $nextIcon = $slider.find('.next > img');
            var sliderHeight = $slider.width() * $activeImage[0].naturalHeight / $activeImage[0].naturalWidth;
            if (animate === true) {
                $slider.animate({height: sliderHeight}, this.settings.delay);
            } else {
                $slider.height(sliderHeight);
            }
            if ($prevIcon.length > 0) {
                var prevIconHeight = parseInt($prevIcon[0].naturalHeight);
                $prevIcon.css({'max-height': prevIconHeight, 'min-height': prevIconHeight / 2, 'height': sliderHeight / 10});
            }
            if ($nextIcon.length > 0) {
                var nextIconHeight = parseInt($nextIcon[0].naturalHeight);
                $nextIcon.css({'max-height': nextIconHeight, 'min-height': nextIconHeight / 2, 'height': sliderHeight / 10});
            }
        }
    };

    $.fn[pluginName] = function (options) {
        this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
        return this;
    };

})(jQuery, window, document);
