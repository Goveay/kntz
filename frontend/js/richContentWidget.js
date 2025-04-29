define([
    'jquery',
    'jquery-ui-modules/widget'
    ], function($) {
        $.widget('kontakt.richContentWidget', {
            
        component: 'Kontakt_Catalog/js/breeze/richContentWidget',

        _create: function() {
            if (this.options.richContent) {
                this.initRichContent();
            }
        },

        initRichContent: function () {
            let self = this;

            const callback = (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        observer.unobserve(entry.target);
                        $(self.element)[0].append(self.options.richContent);
                    }
                });
            };

            const observerRichContent = new IntersectionObserver(callback, {threshold: 0.1}),
                  target = $('.tabbs');

            observerRichContent.observe(target[0]);
        }
    });
});
