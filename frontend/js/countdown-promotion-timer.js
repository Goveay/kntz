require([
    'jquery'
], function ($) {
    'use strict';

    $(document).ready(function() {
        let promoTimerContainer = $('#promotion-countdown-timer');

        if (promoTimerContainer.length) {
          let categoryId = promoTimerContainer.attr('data-id'),
              getInfoUrl = promoTimerContainer.attr('data-url'),
              timerData,
              timer;

            let updateCountdown = function () {
                if (!promoTimerContainer.hasClass("active")) {
                    promoTimerContainer.addClass("active");
                }
                let countdown = $('#promotion-countdown');
                let date = timerData;
                date.time_left -= 1;


                let days = Math.floor(date.time_left / (60 * 60 * 24));
                let hours = Math.floor((date.time_left % (60 * 60 * 24)) / (60 * 60));
                let minutes = Math.floor((date.time_left % (60 * 60)) / 60);
                let seconds = Math.floor((date.time_left % 60));

                if (date.display_day === false) {
                    hours += days * 24;
                    countdown.find('.day').hide();
                    countdown.find('.dots_day').hide();
                } else {
                    countdown.find('.day').text(days).show();
                    countdown.find('.dots_day').show();
                }

                countdown.find('.hours').text(hours);
                countdown.find('.minutes').text(minutes);
                countdown.find('.seconds').text(seconds);
                if (date.label) {
                    promoTimerContainer.find('.promotion-countdown-timer__title').text(date.label);
                }

                if (date.time_left <= 0) {
                    if (promoTimerContainer.hasClass("active")) {
                        promoTimerContainer.removeClass("active");
                    }

                    clearInterval(timer);
                }
            }

            $.ajax({
                url: getInfoUrl,
                data: {page_id: categoryId},
                method: 'post',
                global: false,
                dataType: 'json',
                success: function(response) {
                    if (response.active) {
                        timerData = response;
                        timer = setInterval(updateCountdown, 1000);
                    }

                }.bind(this),
                error: function(xhr, status, error) {
                    console.log(error);
                    console.log(status);
                }
            });
        }
    });
});
