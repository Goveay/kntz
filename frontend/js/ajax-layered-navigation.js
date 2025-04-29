(function () {
    'use strict';

    $.widget('ajaxLayeredNavigation', {
        component: 'Swissup_Ajaxlayerednavigation/js/ajax-layered-navigation',

        /**
         * Widget create
         */
        create: function () {
            var url = window.location.href;

            // disable not-supported config
            this.options.isMultiple = false;

            this.config = this.options;
            this.setUrl(url);
            this.initQueryParams(url);
            this.initNavigation();

            this.xhrCount = 0;
        },

        /** Cleanup html markup */
        destroy: function () {
            this._super();
            $('.layered-filter-apply-wrapper').remove();
            $('.swissup-range-slider-container range-slider').remove();
            this.scroll.destroy();
        },

        /**
         * Init Navigation
         */
        initNavigation: function () {
            this.scroll = new $.ajaxLayeredNavigation.Scroll(this);
        },

        /**
         * @param  {String} url
         */
        setUrl: function (url) {
            this.url = url;
        },

        /**
         * @param  {String} url
         */
        initQueryParams: function (url) {
            var query;

            query = url.indexOf('?') === -1 ? '' : url.substring(url.indexOf('?'));
            this.queryParams = new URLSearchParams(query);
        },

        /**
         * @param  {String} url
         * @param  {Object} config
         * @param  {Function} onDone
         * @return {Boolean|void}
         */
        reload: function (url, config, onDone) {
            var self = this,
                seqNumber = ++this.xhrCount,
                decodedUrl = decodeURIComponent(url);

            if (!this.config.isAjax) {
                window.location = decodedUrl;

                return false;
            }

            config = Object.assign({}, this.config, config);

            //if (config.pushState) {
                window.history.pushState({turbolinks: true, url: decodedUrl}, '', decodedUrl);
            //}
            onDone = onDone || this.onDone;

            $('body').spinner(true);
            $.request.get({
                url: decodedUrl,
                type: 'json',
                accept: 'json',
                data: {
                    aln: '✓'
                },
                complete: function () {
                    $('body').spinner(false);
                }
            })
            .then(function (response) {
                if (seqNumber !== self.xhrCount) {
                    return;
                }
                onDone(response.body);

                self.setUrl(url);
                self.initQueryParams(url);
                self.initNavigation();

                $(document).trigger('swissup:ajaxlayerednavigation:reload:after', self, response.body);
            })
            .catch(function (errorThrown) {
                console.log(errorThrown);
            });
        },

        /**
         * @param {Object} response
         */
        onDone: function (data) {
            var mainEl, mainSelectors;

            if (data.list) {
                mainSelectors = [
                    '.container__elem--12 .contentos',
                    '.container__elem--15 .contentos',
                    '.container__elem--12 .dopCont',
                    '.main .message.info.empty', '.main .message.notice'
                ];
                /* global _ */
                mainEl = _.find(mainSelectors, function (selector) {
                    return $(selector).length > 0;
                });
                $(mainEl)
                    .empty()
                    .append(data.state + data.list)
                    .trigger('contentUpdated');
            }

            if (data.filters) {
                $('#layered-filter-block').replaceWith(data.filters);
            }
        },

        /**
         * @return {Boolean}
         */
        isMobile: function () {
            return Boolean(navigator.userAgent.match(/Android/i) ||
                navigator.userAgent.match(/webOS/i) ||
                navigator.userAgent.match(/iPhone/i) ||
                navigator.userAgent.match(/iPod/i) ||
                navigator.userAgent.match(/BlackBerry/i) ||
                navigator.userAgent.match(/Windows Phone/i));
        }
    });
})();
