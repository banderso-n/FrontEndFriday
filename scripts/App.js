define(function (require) {
    'use strict';

    var MaterialCarousel = require('components/MaterialCarousel');


    function App () {

        /**
         * The app's main carousel
         * @type {MaterialCarousel}
         */
        this.materialCarousel = new MaterialCarousel($('#js-materialCarousel'));

    }


    return App;
});
