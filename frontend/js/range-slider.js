define([
    'jquery',
    'underscore'
], function ($, _) {
    'use strict';
    $.mixin('rangeSlider', {
        _createSlider: function () {
            this.checkSliderValue();
            this._on('range:input',  _.debounce((e) => {
                this._onSliderChange(e, {
                    values: e.target.value
                })
            }, 750));
        },

        checkSliderValue: function () {
            const rangeMin = document.getElementById('rangeMin');
            const rangeMax = document.getElementById('rangeMax');
            const filler = document.querySelector('.overlay-filter');
            const min = parseInt(rangeMin.min);
            const max = parseInt(rangeMin.max);

            const minValue = parseInt(rangeMin.value);
            const maxValue = parseInt(rangeMax.value);

            const percentMin = ((minValue - min) / (max - min)) * 100;
            const percentMax = ((maxValue - min) / (max - min)) * 100;

            filler.style.background = `linear-gradient(to right, #EAEAEA 0% 0%, #EAEAEA 0% ${percentMin}%, #323232 ${percentMin}%, #323232 ${percentMax}%, #EAEAEA 0% ${percentMax}%, #EAEAEA 0% 100%)`;
        }
    });

    $(document).on('breeze:mount:rangeSlider', (e, data) => {
        $(data.el).rangeSlider(data.settings);
    });
});
