define([
        "jquery",
        'mage/translate',
        "Magento_Ui/js/modal/modal",
    ], function($, $t){
        let guarantee = {
            open: function(config, element) {
                let $target = $(config.target);
                let $element = $(element);

                if ($target && $target.modal) {
                    $target.modal({
                        title: $t('Guaranties'),
                        modalClass: 'guarantee-modal',
                        buttons: [],
                        responsive: true,
                        clickableOverlay: true
                    });
                }
                if ($element) {
                    $element.click(function () {
                        $("#guarantee_modal").css("display", "block");
                        $target.modal('openModal');
                    });
                }
            }
        };
    // Kontakt_ProductGuarantee/js/guaranteeModal

        var result = {
            'Kontakt_ProductGuarantee/js/guaranteeModal': guarantee.open
        };

        $(document).on('breeze:mount:Kontakt_ProductGuarantee/js/guaranteeModal', (e, data) => {
            result['Kontakt_ProductGuarantee/js/guaranteeModal'](data.settings, data.el);
        });

        return result;
    }
);
