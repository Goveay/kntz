define([
        "jquery",
        "Magento_Ui/js/modal/modal"
    ], function($) {
        let View360Popup = {
            open: function(config, element) {
                let $target = $(config.target);
                let $element = $(element);

                if ($target && $target.modal) {
                    $target.modal({
                        buttons: [],
                        modalClass: 'modal-product-360',
                        responsive: true,
                        clickableOverlay: true
                    });
                }
                if ($element) {
                    $element.click(function () {
                        $("#product360view").css("display", "block");
                        $target.modal('openModal');
                    });
                }
            }
        };

        var result = {
            'Dinarys_ProductAttributes/js/product360view': View360Popup.open
        };

        $(document).on('breeze:mount:Dinarys_ProductAttributes/js/product360view', (e, data) => {
            result['Dinarys_ProductAttributes/js/product360view'](data.settings, data.el);
        });

        return result;
    }
);

