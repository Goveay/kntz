(function () {
    'use strict';

    var flag = false;

    $.widget('ajaxproQuickView', {
        component: 'Swissup_Ajaxpro/js/quick-view',
        loader: null,

        /** [create description] */
        create: function () {
            if (!flag) {
                $.async('.products.list a.product.photo', this.renderLabel.bind(this));
                flag = true;
            }
        },

        destroy: function () {
            flag = false;
            $('.swissup-ajaxpro-quick-view-wrapper').remove();
            this._super();
        },

        /** [renderLabel description] */
        renderLabel: function (element) {
            var targetElement = $(element),
                targetContainer = $(element).closest('.product-item-info'),
                self = this,
                productIdElement, productId,
                quickViewElement;

            if (targetElement.length !== 1) {
                return;
            }

            productIdElement = targetContainer.find('form [name="product"]');
            productId = false;

            if (productIdElement.length === 1) {
                productId = productIdElement.val();
            } else {
                productIdElement = targetContainer.find('.product-item-details div.price-box.price-final_price');

                if (productIdElement.length !== 1) {
                    return;
                }
                productId = productIdElement.data('product-id');
            }

            if (!productId) {
                return;
            }

            targetElement.after('<div class="swissup-ajaxpro-quick-view-wrapper">' +
                '<a class="quick-view" href="#">' +
                    '<span>' + $.__('Quick View') + '</span>' +
                '</a>' +
            '</div>');

            quickViewElement = targetContainer.find('a.quick-view');

            quickViewElement.on('click', function (e) {
                e.preventDefault();
                self.request(productId, quickViewElement);
            });
        },

        /**
         * Send ajax request
         * @param {Integer} productId
         * @param {Object} element
         */
        request: function (productId, element) {
            var sectionNames = ['ajaxpro-product'],
                parameters = {
                    sections: sectionNames.join(','),
                    'update_section_id': false,
                    ajaxpro: {
                        'product_id': productId,
                        blocks: ['product.view']
                    }
                },
                url = this.options.sectionLoadUrl;

            parameters[this.options.refererParam] = this.options.refererValue;

            element.css('color', 'transparent').spinner(true, {
                css: {
                    width: this.options.loaderImageMaxWidth,
                    height: this.options.loaderImageMaxWidth,
                    background: 'transparent'
                }
            });

            $.request.get({
                url: url,
                data: parameters
            })
            .then(function (response) {
                var sectionName = 'ajaxpro-product';

                element.css('color', '').spinner(false);

                if (!response.body || !response.body[sectionName]) {
                    return;
                }

                $.sections.set(sectionName, response.body[sectionName]);
                $.sections.reload(['cart', 'messages']);
            });
        }
    });
})();
