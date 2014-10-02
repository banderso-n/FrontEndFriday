define(function (require) {
    'use strict';

    require('velocity');


    function MaterialCarousel ($element) {

        this.$element = $element;

        this.$advancer = $element.find('.' + MaterialCarousel.CLASS_NAME.ADVANCER);

        this.$slide = $element.find('.' + MaterialCarousel.CLASS_NAME.SLIDE);

        this.slideIndex = 0;

        this._onAdvancerClick = this._onAdvancerClick.bind(this);

        this.init();
    }


    MaterialCarousel.CLASS_NAME = {
        ADVANCER:   'js-materialCarousel-advancer',
        PHOTO:      'js-materialCarousel-photo',
        SLIDE:      'js-materialCarousel-slide'
    };


    MaterialCarousel.prototype.init = function () {
        this.$advancer.on('click', this._onAdvancerClick);
        return this;
    };


    MaterialCarousel.prototype.advance = function () {
        var self = this;
        var nextIndex = (this.slideIndex + 1) % this.$slide.length;
        var $slide = this.$slide.eq(this.slideIndex);
        var $slideNext = this.$slide.eq(nextIndex);
        var $photos = $slide.find('.' + MaterialCarousel.CLASS_NAME.PHOTO);
        var $photosNext = $slideNext.find('.' + MaterialCarousel.CLASS_NAME.PHOTO);

        this.slideIndex = nextIndex;
        return $.when(
            this.getOuttaHerePhotos($photos),
            this.comeHereSlide($slideNext)
        ).then(function () {
            self.comeHerePhotos($photosNext);
        });
    };


    MaterialCarousel.prototype.getOuttaHerePhotos = function ($photos) {
        return $.when.apply($, $photos.map(function (i, photo) {
            return $(photo).delay(i * i * 100).velocity({ bottom: '100%', rotateZ: '-30deg' }, { easing: 'easeOutQuad' });
        }).get());
    };


    MaterialCarousel.prototype.comeHereSlide = function ($slide) {
        $slide.css('top', 0);
        return $.when(this.$slide.not($slide).velocity({ top: '-100%' }));
    };


    MaterialCarousel.prototype.comeHerePhotos = function ($photos) {

    };


    MaterialCarousel.prototype._onAdvancerClick = function () {
        this.advance();
    };


    return MaterialCarousel;
});
