/**
 * UX Rocket
 * jQuery based content rotator
 * @author Bilal Cinarli
 * @author Kursad Yildirmak (Version 0.2)
 */
;
(function($) {
    var uxrotator = "uxrotator", // global shorthand
        ux, // local shorthand

        defaults = {
            slides         : '.slide',
            current        : 'current',
            autoSlide      : true,
            slideDelay     : 7000,
            transition     : 'none',
            transitionSpeed: 750,
            bullets        : false
        };


    // constructor method
    var Rotator = function(el, options) {
        var opts = $.extend({}, defaults, options, $(el).data()),

        // cached jQuery Objects
            $slider = $(el),
            $slides = $slider.find(opts.slides),
            $next = $slider.find('.next'),
            $prev = $slider.find('.prev'),
            $currentOne,
            $nextOne,

        // cached Variables
            timer,
            currentSlide = 0,
            nextSlide = 0,
            totalSlides = 0,
            bulletIndex = 0,
            direction = 'next',
            animating = false,
            start = -100, // slides to left for 100%
            end = 0;


        $slides.addClass('rotator-slide').wrapAll('<div class="rotator-slides" />').hide().first().show().addClass(opts.current);
        totalSlides = $slides.length;

        //create bullets
        if(opts.bullets == true && !$slider.find('.rotator-bullets').length) {
            var bullets = "";
            for(var i = 0; i < totalSlides; i++) {
                if(i == 0) {
                    bullets += '<span class="bullet current">' + i + '</span>';
                } else {
                    bullets += '<span class="bullet">' + i + '</span>';
                }
            }
            $slider.append('<div class="rotator-bullets">' + bullets + '</div>');
            var $bullet = $slider.find('.rotator-bullets').children('.bullet');
        }

        /**
         * Slide functions
         **/
        var animate = function(slideIndex) {
            if(totalSlides < 2) {
                return;
            }

            if(animating === false) {
                animating = true;

                //go to slide if bullets is activated
                if(typeof slideIndex != "undefined") {
                    nextSlide = slideIndex;
                    if(currentSlide > nextSlide) {
                        start = 100;
                    }
                } else {
                    if(direction === 'next') {
                        nextSlide = (nextSlide + 1 === totalSlides) ? 0 : nextSlide + 1;
                    }
                    if(direction === 'prev') {
                        nextSlide = (nextSlide - 1 < 0) ? totalSlides - 1 : nextSlide - 1;
                        start = 100; // slides to right for 100%
                    }
                }
                $currentOne = $slides.filter(':eq(' + currentSlide + ')');
                $nextOne = $slides.filter(':eq(' + nextSlide + ')');

                if(opts.transition === 'horizontal') {
                    $currentOne.animate({
                        left: start + '%'
                    }, opts.transitionSpeed, function() {
                        $(this).hide();
                    }).removeClass(opts.current);
                    $nextOne.addClass(opts.current).css('left', -start + '%').show().animate({
                        left: end
                    }, opts.transitionSpeed);
                } else if(opts.transition === 'vertical') {
                    $currentOne.animate({
                        top: start + '%'
                    }, opts.transitionSpeed, function() {
                        $(this).hide();
                    }).removeClass(opts.current);
                    $nextOne.addClass(opts.current).css('top', -start + '%').show().animate({
                        top: end
                    }, opts.transitionSpeed);
                } else if(opts.transition === 'fade') {
                    $currentOne.fadeOut(opts.transitionSpeed).removeClass(opts.current);
                    $nextOne.addClass(opts.current).fadeIn(opts.transitionSpeed);
                } else {
                    $currentOne.hide().removeClass(opts.current);
                    $nextOne.addClass(opts.current).show();
                }

                if(opts.bullets == true) {
                    $bullet.removeClass('current').eq($nextOne.index()).addClass('current');
                }
                // set the direction to default always for autoRun
                direction = 'next';

                // jump to next index
                currentSlide = nextSlide;
                start = -100;

                animating = false;
            }
        };

        var run = function() {
            // make sure forwarding
            direction = 'next';
            timer = setInterval(animate, opts.slideDelay);
        };

        var stop = function() {
            clearInterval(timer);
        };

        $next.on('click', function() {
            stop();
            direction = 'next';
            animate();
        });

        $prev.on('click', function() {
            stop();
            direction = 'prev';
            animate();
        });

        //bullet click event
        if(opts.bullets == true) {
            $bullet.on('click', function() {
                var activebullet = $(this).index();
                $bullet.removeClass('current');
                $(this).addClass('current');

                if(bulletIndex != activebullet) {
                    stop();
                    animate(activebullet);
                    bulletIndex = activebullet;
                }
            });
        }


        // Initialize  auto rotation
        if(opts.autoSlide && totalSlides > 1) {
            run();
            $slider.hover(function() {
                stop();
            }, function() {
                run();
            });
        }

        return this;
    };

    // jquery bindings
    ux = $.fn.rotator = $.uxrotator = function(options) {
        return this.each(function() {
            var $el = $(this),
                rotator;

            if($el.hasClass('uxitd-rotator-ready')) {
                return;
            }

            $el.addClass('uxitd-rotator-ready');

            rotator = new Rotator(this, options);
        });
    };

    // Version
    ux.version = "0.3.0";

    // settings
    ux.settings = defaults;
})(jQuery);