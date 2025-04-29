(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'underscore', 'mage/translate'], factory);
    } else {
        $.ajaxLayeredNavigation = $.ajaxLayeredNavigation || {};
        $.ajaxLayeredNavigation.Scroll = factory($, _, $.__);
    }
}(function ($, _, $t) {
    'use strict';

    /**
     * @param  {Object} navigation
     * @return {Object}
     */
    return function (navigation) {
        var isLoading, onDone, addButton, onScroll, getNextPageLink,
            destroyCallbacks = [];

        isLoading = false;
        $('.contentos .pages a').off('click');
        $('.contentos .pages a').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            isLoading = true;
            navigation.filters.apply($(this));

            return false;
        });

        if (typeof navigation.scroll !== 'undefined') {
            return navigation.scroll;
        }

        getNextPageLink = function () {
            return $('.pages .next');
        };

        /**
         * @param  {Object} response
         */
        onDone = function (response) {
            var newPages;

            if (response.list) {

                newPages = $(response.list).find('.container__elem--12 .pages');
                let productItemSelector = '.contentos div.prodItem';
                let productListSelector = '.container__elem--12 .contentos';

                if ($('.container__elem--12 .dopCont').length > 0) {
                    productItemSelector = '.dopCont .prodItemS';
                    productListSelector = '.container__elem--12 .dopCont'
                }
                $('.container__elem--12 .pages').each(function (i, pages) {
                    if (newPages[i]) {
                        $(pages).replaceWith(newPages[i]);
                    }
                });

                $(productItemSelector).last().after(
                    $(response.list).find(productItemSelector).attr('data-breeze-temporary', '')
                );

                $(productListSelector).append(
                    $(response.list).filter('script[type="text/x-magento-init"]')
                );
                $(productListSelector).trigger('contentUpdated');

                let productList = Array.from($('.prodItem.product-item'));
                productList.forEach(item => {
                    $.fn.checkIsCart(item)
                    $.fn.checkIsWishlist(item)
                    $.fn.checkIsCompare(item)
                });
            }

            if (!getNextPageLink().length) {
                $('.contentosResult').hide();
            }

            isLoading = false;

            let productListNew = Array.from($('.prodItem.product-item'));
            $.fn.initLabelTimer && $.fn.initLabelTimer(productListNew)

            navigation.scroll.skipOnce = true;
        };

        if (navigation.config.isMoreProductsButton) {

            addButton = function () {
                var container, html;

                container = $('.container__elem--12 .pages').last();
                if (container.length === 0) {

                    return;
                }
                html = '<button class="contentosResult" type="button" title="' +
                    $t('More Products') + '" >' +
                    '<span>' + $t('More Products') + '</span>' +
                '</button>'
                ;

                $(html).insertAfter(container);

                $('.container__elem--12 .contentosResult').off();
                $('.container__elem--12 .contentosResult').on('click', function () {
                    var elementNext, url;

                    elementNext = $('.container__elem--12 .pages .next');

                    if (elementNext.length === 0) {

                        return;
                    }
                    isLoading = true;

                    url = elementNext.attr('href');

                    navigation.reload(url, {
                        showLoader: true,
                        pushState: false
                    }, onDone);
                });
            };
            addButton();

            destroyCallbacks.push(function () {
                $('.contentosResult').remove();
            });
        }

        return {
            destroy: function () {
                destroyCallbacks.map(function (cb) {
                    cb();
                });
                destroyCallbacks = [];
            },
        };
    };
}));
