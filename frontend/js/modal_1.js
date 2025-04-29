define([
        "jquery",
        'mage/translate',
        "Magento_Ui/js/modal/modal"
    ], function($, $t){
        let customModal = {
            open: function(config, element) {
                let $target = $(config.target);
                let $element = $(element);

                if ($target && $target.modal) {
                    $target.modal({
                        title: $t('Monthly Payment'),
                        modalClass: 'monthly-payment-modal',
                        buttons: [],
                        responsive: true,
                        clickableOverlay: true
                    });
                }
                if ($element) {
                    $element.click(function () {
                        $target.modal('openModal');
                    });
                }
            }
        };

        let result = {
            'Magento_Theme/js/components/custom/modal': customModal.open
        };

        $(document).on('breeze:mount:Magento_Theme/js/components/custom/modal', (e, data) => {
            result['Magento_Theme/js/components/custom/modal'](data.settings, data.el);
        });

        return result;
    }
);

