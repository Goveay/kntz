define([
    'uiComponent',
    'Magento_Customer/js/customer-data'
], function (Component, customerData) {
    'use strict';

    return Component.extend({
        component: 'Kontakt_SingleProductWidget/js/section',
        initialize: function (config) {
            this._super();
            this.getTimer(this.endDateTime);
            this.deal_section = $.sections.get('deal_section');
        },
        //
        // inCart: function (sku) {
        //     if (this.deal_section().items !== undefined) {
        //         if (this.deal_section().items[sku] === undefined) {
        //             return false;
        //         }
        //         return this.deal_section().items[sku];
        //     }
        //
        //     return false;
        // },

        getTimer: function (dateTime) {
            // Convert the input date string to a format that Date constructor can understand
            const parts = dateTime.split(' '); // Split date and time
            const dateParts = parts[0].split('/'); // Split date into day, month, year
            const timeParts = parts[1].split(':'); // Split time into hours, minutes

            const formattedDateTime = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timeParts[0]}:${timeParts[1]}:00`;

            const countDownDate = new Date(formattedDateTime).getTime();

            // Update the count down every 1 second
            const x = setInterval(function() {
                // Get today's date and time
                const now = new Date().getTime();

                // Find the distance between now and the count down date
                const distance = countDownDate - now;

                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
                const seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');

                if (document.querySelector('.deal')) {
                    document.querySelector('.deal .dealTimer__hours span').innerHTML = hours;
                    document.querySelector('.deal .dealTimer__minutes span').innerHTML = minutes;
                    document.querySelector('.deal .dealTimer__seconds span').innerHTML = seconds;
                }
                if (document.querySelector('.predDna .deal')) {
                    document.querySelector('.predDna .deal .dealTimer__hours span').innerHTML = hours;
                    document.querySelector('.predDna .deal .dealTimer__minutes span').innerHTML = minutes;
                    document.querySelector('.predDna .deal .dealTimer__seconds span').innerHTML = seconds;
                }
                // If the count down is over, write some text
                if (distance < 0) {
                    clearInterval(x);

                    if (document.querySelector('.deal')) {
                        document.querySelector('.deal .dealTimer__hours span').innerHTML = '00';
                        document.querySelector('.deal .dealTimer__minutes span').innerHTML = '00';
                        document.querySelector('.deal .dealTimer__seconds span').innerHTML = '00';
                    }
                    if (document.querySelector('.predDna .deal')) {
                        document.querySelector('.predDna .deal .dealTimer__hours span').innerHTML = '00';
                        document.querySelector('.predDna .deal .dealTimer__minutes span').innerHTML = '00';
                        document.querySelector('.predDna .deal .dealTimer__seconds span').innerHTML = '00';
                    }
                }
            }, 1000);
        }
    });
});
