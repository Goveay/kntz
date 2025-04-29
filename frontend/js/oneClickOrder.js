define([
        "jquery",
        'mage/translate',
        "Magento_Ui/js/modal/modal"
    ], function($, $t){
        let oneClickOrder = {
            open: function(config, element) {
                let $target = $(config.target);
                let $element = $(element);

                if ($target && $target.modal) {
                    $target.modal({
                        title: $t('One Click Order'),
                        modalClass: 'one-click-modal',
                        buttons: [],
                        responsive: true,
                        clickableOverlay: true
                    });
                }
                if ($element) {
                    $element.click(function () {
                        $("#one_click_order_modal").css("display", "block");
                        $target.modal('openModal');

                        if(typeof(IMask) == "function") {
                            window.oneClickPhonePdp = IMask(document.getElementById('one-click-phone-pdp'), {
                                mask: '+{994} (00) 000-00-00'
                            });
                        }
                    });
                }
            }
        };

        var result = {
            'Dinarys_OneClickOrder/js/oneClickOrder': oneClickOrder.open
        };

        $(document).on('breeze:mount:Dinarys_OneClickOrder/js/oneClickOrder', (e, data) => {
            result['Dinarys_OneClickOrder/js/oneClickOrder'](data.settings, data.el);
        });

        return result;
    }
);

