require([
    'jquery'
], function ($) {
    $(document).ready(function() {
        const openMobileMenu = () => {
            const bottomMenu = $('.topMenu');

            const mobileMenuContent = $('.mobileMenuContent');

            bottomMenu.toggleClass('add');
            const mobConsultShell = $('.mobile-consult-container-shell');

            $('body').addClass('lock-scroll');

            mobileMenuContent.addClass('view');

            if (mobConsultShell.length) {
                mobConsultShell.hide()
            }

            if ($('.prodCart__prices.product-mobile-block').length) {
                $('.prodCart__prices.product-mobile-block').hide()
            }

            if ($('.calks__wr1').length) {
                $('.calks__wr1').hide();
            }
        }

        if ($(window).width() < 1024) {
            $('.topMenu').on('click', function () {
                openMobileMenu()
            })
        }
    })
})
