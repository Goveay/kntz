(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define([
            'jquery',
            'underscore',
            'Magento_Customer/js/section-config',
            'Magento_Customer/js/customer-data'
        ], factory);
    } else {
        $.ajaxpro = $.ajaxpro || {};
        $.ajaxpro.modalManager = factory($, _, $.sections, $.customerData);
    }
}(function ($, _, sectionConfig, customerData) {
    'use strict';

    /**
    Run force global customer data reload
    require(['Magento_Customer/js/customer-data', 'Magento_Customer/js/section-config'
    ], function (customerData, sectionConfig) {
        customerData.reload(sectionConfig.getSectionNames(), true);
    });
     */
    var isGlobalCustomerDataReload = false;
    $(document).on('customer-data-reload', function (event, data) {
        if (('object' != typeof data && !Array.isArray(data)) || 'function' != typeof sectionConfig.getSectionNames) {
            return;
        }
        const sections = data.hasOwnProperty('sections') ? data.sections.sort() : data.sort();
        const sectionNames = sectionConfig.getSectionNames().sort();
        const expiredSectionNames = customerData.getExpiredSectionNames().sort();

        isGlobalCustomerDataReload = _.isEqual(sections, sectionNames) || (expiredSectionNames.length > 0
            && _.isEqual(_.difference(sections, sectionNames).sort(), expiredSectionNames));

    });

    return {
        elements: {},

        destroy: function () {
            this.elements = {};
        },

        /**
         * data-bind="afterRender: afterRender
         *
         * @param {String} id
         * @param {Element} element
         */
        register: function (id, element) {
            var self = this, timerId;

            timerId = setInterval(function () {
                if (!$.active) {
                    self.elements[id] = element;
                    clearInterval(timerId);
                }
            }, 100);
        },

        /**
         * Show window
         *
         * @param {String} key
         */
        show: function (key) {
            var id = 'ajaxpro-' + key,
            element;

            if (this.elements[id]) {
                element = this.elements[id];
                const dialog = element.closest('.ajaxpro-modal-dialog');
                const hasPopupMessages = dialog.hasClass('ajaxpro-popup-simple') ?
                    dialog.find('.messages .message').length > 0 : true;

                if (!dialog.hasClass('_show') && !isGlobalCustomerDataReload && hasPopupMessages) {
                    this.hide();
                    element.trigger('openModal');
                }
            }
        },

        /**
         * eval native additional js
         *
         * @param {String} key
         */
        evalJs: function (key) {
            var id = 'ajaxpro-' + key,
            self = this,
            element;

            if (self.elements[id]) {
                element = self.elements[id];

                $(element).find('script').filter(function (i, script) {
                    return !script.type;
                }).each(function (i, script) {
                    script = $(script).html();

                    if (script.indexOf('document.write(') !== -1) {
                        return console.error(
                            'document.write writes to the document stream, ' +
                            'calling document.write on a closed (loaded) ' +
                            'document automatically calls document.open, ' +
                            'which will clear the document.'
                        );
                    }

                    try {
                        return $.globalEval(script);
                    } catch (err) {
                        console.log(script);
                        console.error(err);
                    }
                });
            }
        },

        /**
         * Hide modal window
         */
        hide: function () {
            $('.block-ajaxpro').each(function (i, el) {
                $(el).trigger('closeModal');
            });
        }
    };
}));
