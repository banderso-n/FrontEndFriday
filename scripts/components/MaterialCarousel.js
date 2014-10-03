define(function (require) {
    'use strict';

    var $ = require('jquery');
    require('velocity');


    /**
     * A fancy Material Design carousel thingy
     * @class MaterialCarousel
     * 
     * @param {jQuery} $element
     */
    function MaterialCarousel ($element) {

        /**
         * The element representing the MaterialCarousel in the DOM
         * @type {jQuery}
         */
        this.$element = $element;

        /**
         * A collection of elements used to advance the carousel instance
         * @type {jQuery}
         */
        this.$advancer = $element.find('.' + MaterialCarousel.CLASS_NAME.ADVANCER);

        /**
         * A collection of elements to use as the carousel instance's slides
         * @type {jQuery}
         */
        this.$slide = $element.find('.' + MaterialCarousel.CLASS_NAME.SLIDE);

        /**
         * Our current slide index
         * @type {Number}
         */
        this.slideIndex = 0;

        /**
         * The advancer click handler bound to this instance's scope
         * @private
         * @type {Function}
         */
        this._onAdvancerClick = this._onAdvancerClick.bind(this);

        this.init();
    }


    /**
     * An enumeration of class names consumed by this component
     * @enum CLASS_NAME
     * @static
     * @type {String}
     */
    MaterialCarousel.CLASS_NAME = {
        ADVANCER:   'js-materialCarousel-advancer',
        PHOTO:      'js-materialCarousel-photo',
        SLIDE:      'js-materialCarousel-slide'
    };


    /**
     * Initializes a MaterialCarousel instance
     * @chainable
     * @return {MaterialCarousel}
     */
    MaterialCarousel.prototype.init = function () {
        this.enableAdvancing();
        return this;
    };


    /**
     * Advances the carousel instance to the next slide
     * @method advance
     * 
     * @return {$.Promise}  A promise resolved when the animation is totally done
     */
    MaterialCarousel.prototype.advance = function () {
        var self = this;
        var nextIndex = (this.slideIndex + 1) % this.$slide.length;
        var $slide = this.$slide.eq(this.slideIndex);
        var $slideNext = this.$slide.eq(nextIndex);
        var $photos = $slide.find('.' + MaterialCarousel.CLASS_NAME.PHOTO);
        var $photosNext = $slideNext.find('.' + MaterialCarousel.CLASS_NAME.PHOTO);

        $photosNext.css({ opacity: 0 });
        this.slideIndex = nextIndex;
        this.disableAdvancing();

        return $.when(
            this.getOuttaHerePhotos($photos),
            this.comeHereSlide($slideNext)
        ).then(function () {
            return self.comeHerePhotos($photosNext);
        }).then(function () {
            self.enableAdvancing();
        });

        /* I added this just to show how the above would be done without deferreds, i.e. with callbacks */
        // var isPhotoOutDone = false;
        // var isSlideInDone = false;
        // var animatePhotosIn = function () {
        //     if (isPhotoOutDone && isSlideInDone) {
        //         self.comeHerePhotos($photosNext, function () {
        //             self.enableAdvancing();
        //             if (typeof callback === 'function') {
        //                 callback();
        //             }
        //         });
        //     }
        // };
        // this.getOuttaHerePhotos($photos, function () {
        //     isPhotoOutDone = true;
        //     animatePhotosIn();
        // });
        // this.comeHereSlide($slideNext, function () {
        //     isSlideInDone = true;
        //     animatePhotosIn();
        // });
    };


    /**
     * Disables the click event on advancer buttons
     * @method disableAdvancing
     * @chainable
     * 
     * @return {MaterialCarousel}
     */
    MaterialCarousel.prototype.disableAdvancing = function () {
        this.$advancer.off('click', this._onAdvancerClick);
        return this;
    };


    /**
     * Enables the click event on advancer buttons
     * @method enableAdvancing
     * @chainable
     * 
     * @return {MaterialCarousel}
     */
    MaterialCarousel.prototype.enableAdvancing = function () {
        this.$advancer.on('click', this._onAdvancerClick);
        return this;
    };


    /**
     * Animates the provided photos away
     * @method getOuttaHerePhotos
     * 
     * @param  {jQuery} $photos
     * @return {$.Promise}  A promise that resolves when the photos are done animating
     */
    MaterialCarousel.prototype.getOuttaHerePhotos = function ($photos) {
        return $.when($photos.velocity({ bottom: '-50%' }, { easing: 'easeInOutQuart', duration: 700 }));
    };


    /**
     * Animates in the provided slide
     * @method comeHereSlide
     * 
     * @param  {jQuery} $slide  The slide you want to transition to
     * @return {$.Promise}  A promise that resolves when the slide has finished animating
     */
    MaterialCarousel.prototype.comeHereSlide = function ($slide) {
        var $notSlide = this.$slide.not($slide);
        $slide.css({ zIndex: 0, top: 0 });
        $notSlide.css({ zIndex: 1 });
        return $.when($notSlide.velocity({ top: '-100%' }, { easing: 'easeInOutQuart', duration: 700 }));
    };


    /**
     * Animates in the provided photos
     * @param  {jQuery} $photos
     * @return {$.Promise}  A promise that resolves when all the photos are done animating in
     */
    MaterialCarousel.prototype.comeHerePhotos = function ($photos) {
        return $.when.apply(null, $photos.map(function (i, photo) {
            var $photo = $(photo);
            var bottom = $photo.css('bottom', '').css('bottom');
            return $(photo).delay(i * 100).velocity({
                opacity: [ 1, 'linear' ],
                bottom: [ bottom, 'easeOutQuart', '-50%' ]
            }, {
                duration: 400 + i * 20
            });
        }).get());
    };


    /**
     * The advancer button click handler unbound to any scope
     * @param  {MouseEvent} e
     */
    MaterialCarousel.prototype._onAdvancerClick = function (e) {
        this.advance();
    };


    return MaterialCarousel;
});
