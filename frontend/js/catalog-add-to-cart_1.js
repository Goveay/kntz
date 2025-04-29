(function () {
    'use strict';

    $.mixin('catalogAddToCart', {

        create: function (original) {
            original();
            let self = this,
                element = $(self.element);


            let addToCartCustomButtonSelector = '.prodItemS__add.tocart';
            let addToCartCustomMobileButtonSelector = '.prodItem__mmaddcard.tocart';
            let addToCartButtonSelector = '.prodItem__addCart.tocart';

            $(addToCartButtonSelector, element).prop('disabled', false);
            $(addToCartCustomButtonSelector, element).prop('disabled', false);
            $(addToCartCustomMobileButtonSelector, element).prop('disabled', false);
        },
        /**
         * @param {Function} original
         * @param {Object} response
         */
        enableAddToCartButton: function (original, form) {

            let addToCartButton = $(form).find('.tocart'),
                    inCartButton = $(form).find('.in_cart'),
                    skuProduct = $(form).find('input[name="product"]').val(),
                    addToCartButtonScrollBar = $(`.product-scroll-bar_${skuProduct}`).find('.tocart'),
                    inCartButtonScrollBar = $(`.product-scroll-bar_${skuProduct}`).find('.in_cart');

            setTimeout(function () {
                addToCartButton.css('display', 'none');
                inCartButton.css('display', 'flex');
                if (addToCartButtonScrollBar.length > 0) {
                    addToCartButtonScrollBar.css('display', 'none');
                    inCartButtonScrollBar.css('display', 'flex');
                    inCartButtonScrollBar.addClass('disabled');
                }
                addToCartButton.spinner(false);
            }, 200);
            return original(form);
        },
        /**
         * @param {String} form
         */
        disableAddToCartButton: function (original, form) {
            let addToCartButton = $(form).find('.tocart');
            let skuProduct = $(form).find('input[name="product"]').val();
            let addToCartButtonScrollBar = $(`.product-scroll-bar_${skuProduct}`).find('.tocart');
            addToCartButton.spinner(true, {
                css: {
                    width: 20,
                    height: 20,
                    background: 'none'
                }
            });

            if (addToCartButtonScrollBar.length > 0) {
                addToCartButtonScrollBar.spinner(true, {
                    css: {
                        width: 20,
                        height: 20,
                        background: 'none'
                    }
                });
            }

            return original(form);
        },
    });
})();
