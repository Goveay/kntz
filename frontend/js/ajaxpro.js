/* global _ ko */
(function () {
    'use strict';

    $.view('ajaxpro', {
        component: 'Swissup_Ajaxpro/js/ajaxpro',

        /** [create description] */
        create: function () {
            var self = this,
                sections = [
                    'ajaxpro-cart',
                    'ajaxpro-product',
                    'ajaxpro-reinit'
                ];

            this.data = {};
            this.subscriptions = [];
            this.isLoading = ko.observable(false);

            _.each(sections, function (section) {
                var ajaxproData = $.sections.get(section);

                // ajaxproData.extend({disposableCustomerData: section});

                self.update(ajaxproData());

                self.subscriptions.push(ajaxproData.subscribe(self._subscribe, self));
            });

            return this._super();
        },

        destroy: function () {
            $.ajaxpro.modalManager.destroy();
            _.invoke(this.subscriptions, 'dispose');
            this._super();
        },

        /**
         * @return {Boolean}
         */
        isActive: function () {
            return true;
        },

        /**
         * @param {Element} element
         */
        afterRender: function (element) {
            var el;

            if (!element) {
                return;
            }

            el = $(element).closest('.block-ajaxpro');

            if (el) {
                $.ajaxpro.modalManager.register(element.id, el);
            }
        },

        /**
         * Get ajaxpro param by name.
         * @param {String} name
         * @returns {*}
         */
        bindBlock: function (name) {
            if (!_.isUndefined(name)) {
                if (!this.data.hasOwnProperty(name)) {
                    this.data[name] = ko.observable();
                }
            }

            return this.data[name]();
        },

        /**
         * Update sections content.
         *
         * @param {Object} updatedData
         */
        update: function (updatedData) {
            _.each(updatedData, function (value, key) {
                if (!this.data.hasOwnProperty(key)) {
                    this.data[key] = ko.observable();
                }
                this.data[key](value);
            }, this);
        },

        /**
         * @param {Object} updatedData
         */
        _subscribe: function (updatedData) {
            var keys = [];

            this.isLoading(false);
            this.update(updatedData);

            keys = _.keys(updatedData);

            // give some time to render js components, to decrease jumping content
            setTimeout(function () {
                _.each(keys, $.proxy($.ajaxpro.modalManager.show, $.ajaxpro.modalManager));

                $(document).trigger('contentUpdated');

                // _.each(keys, $.proxy($.ajaxpro.modalManager.evalJs, $.ajaxpro.modalManager));
            }, 50);
        }
    });
})();
