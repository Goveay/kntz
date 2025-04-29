(function () {
    'use strict';

    var options = window.swissupAjaxproConfig,
        section = 'ajaxpro-product',
        AjaxproCatalogProductView;

    AjaxproCatalogProductView = {
        /**
         * @param {Number} productId
         */
        request: function (productId) {
            var parameters = {
                'sections': section,
                'update_section_id': false,
                'ajaxpro': {
                    'product_id': productId,
                    'blocks': ['product.view']
                }
            };

            parameters[options.refererParam] = options.refererValue;

            $.request.send({
                url: options.sectionLoadUrl,
                data: parameters
            }).then(function (response) {
                var sections = response.body;

                if (sections[section]) {
                    $.sections.set(section, sections[section]);
                    $.sections.reload(['cart', 'messages']);
                }
            });
        }
    };

    $(document).on('ajaxComplete', function (event, data) {
        var response = data.response,
            request = data.response.req,
            sections = $.sections.getAffectedSections(request.url);

        if (!request.method.match(/post|put/i)) {
            return;
        }

        if (!sections.length) {
            return;
        }

        response = response.body || {};

        if (response.ajaxpro && response.ajaxpro.product && response.ajaxpro.product.id) {
            AjaxproCatalogProductView.request(response.ajaxpro.product.id);
        }
    });
})();
