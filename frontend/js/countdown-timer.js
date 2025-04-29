require([
    'jquery',
    'mage/translate'
    ], function ($, $t) {
    'use strict';

    $(document).ready(function() {
        let body = $("body"),
            timerContainer = $('#countdown-timer-widget'),
            getInfoUrl = timerContainer.attr('data-url'),
            ajaxData = {isAjax: true},
            timerData,
            timer,
            structure,
            countdownBlock,
            styleBlock;

        if (timerContainer.length > 0) {
            show();
        }

        let updateCountdown = function () {
            if (!body.hasClass("has-countdown")) {
                body.addClass("has-countdown");
                timerContainer.addClass("active");
            }
            let countdown = $('#countdown');
            let date = timerData;
            date.time_left -= 1;

            if (date.type === 'timer') {
                let days = Math.floor(date.time_left / (60 * 60 * 24));
                let hours = Math.floor((date.time_left % (60 * 60 * 24)) / (60 * 60));
                let minutes = Math.floor((date.time_left % (60 * 60)) / 60);
                let seconds = Math.floor((date.time_left % 60));

                if (date.display_day === false) {
                    hours += days * 24;
                    countdown.find('.day').hide();
                    countdown.find('.dots_day').hide();
                } else {
                    countdown.find('.day').show();
                    countdown.find('.day span').text(days);
                    countdown.find('.dots_day').show();
                }

                countdown.find('.hours span').text(hours);
                countdown.find('.minutes span').text(minutes);
                countdown.find('.seconds span').text(seconds);
            }

            if (date.time_left <= 0) {
                show();

                if (body.hasClass("has-countdown")) {
                    body.removeClass("has-countdown");
                    timerContainer.removeClass("active");
                }

                clearInterval(timer);
            }
        }

        function show() {
            $.ajax({
                url: getInfoUrl,
                data: ajaxData,
                method: 'post',
                global: false,
                dataType: 'json',
                success: function (response) {
                    if (response.active) {
                        timerData = response;
                        structure = '';

                        let timer_background_color = timerData.timer_background_color ?? '' !== '' ? timerData.timer_background_color : '#000000';
                        let timer_boxes_color = timerData.timer_boxes_color ?? '' !== '' ? timerData.timer_boxes_color : '#ffffff';
                        let timer_dots_color = timerData.timer_dots_color ?? '' !== '' ? timerData.timer_dots_color : '#ffffff';
                        let timer_numbers_color = timerData.timer_numbers_color ?? '' !== '' ? timerData.timer_numbers_color : '#000000';
                        let timer_text_additional_color = timerData.timer_text_additional_color ?? '' !== '' ? timerData.timer_text_additional_color : 'red';
                        let timer_text_color = timerData.timer_text_color ?? '' !== '' ? timerData.timer_text_color : '#ffffff';
                        let timer_background_image_mobile = timerData.image_mobile ?? '' !== '' ? `background-image: url("${timerData.image_mobile}");` : ``;
                        let timer_background_image_desc = timerData.image_desktop ?? '' !== '' ? `background-image: url("${timerData.image_desktop}");` : ``;

                        structure += `
                            <style type="text/css">
                                .countdown-timer-widget {
                                    background: ${timer_background_color};
                                        ${timer_background_image_mobile}
                                }
                                @media all and (min-width: 768px) {
                                    .countdown-timer-widget {
                                        ${timer_background_image_desc}
                                    }
                                }
                            </style>
                        `;

                        if (timerData.type === 'timer') {
                            structure += `
                                <style type="text/css">
                                    .countdown-timer-widget .promotion-name {
                                        color: ${timer_text_color};
                                    }
                                    .countdown-timer-widget .promotion-name span{
                                        color: ${timer_text_additional_color};
                                    }
                                    .countdown-timer-widget .countdown .item{
                                        background: ${timer_boxes_color};
                                        color: ${timer_numbers_color};
                                    }
                                    .countdown-timer-widget .countdown span.dots{
                                        color: ${timer_dots_color};
                                    }
                                </style>
                            `;

                            if (timerData.show_timer_first === undefined) {
                                timerData.show_timer_first = true;
                            }

                            if (timerData.show_timer_first === true) {
                                countdownBlock = `
                                    <style type="text/css">.countdown-timer-widget a .promotion-name {margin-left: 20px;}</style>
                                    <div id="countdown" class="countdown"><div class="item day"><span></span>${$t('day')}</div><span class="dots dots_day">:</span><div class="item hours"><span></span>${$t('hours')}</div><span class="dots">:</span><div class="item minutes"><span></span>${$t('minut')}</div><span class="dots">:</span><div class="item seconds"><span></span>${$t('second')}</div></div>
                                    <div class="promotion-name">${timerData.promotion_name}</div>
                                `;
                            } else {
                                countdownBlock = `
                                    <style type="text/css">.countdown-timer-widget a .promotion-name {margin-left: 20px; margin-right: 20px;}</style>
                                    <div class="promotion-name">${timerData.promotion_name}</div>
                                    <div id="countdown" class="countdown"><div class="item day"><span></span>${$t('day')}</div><span class="dots dots_day">:</span><div class="item hours"><span></span>${$t('hours')}</div><span class="dots">:</span><div class="item minutes"><span></span>${$t('minut')}</div><span class="dots">:</span><div class="item seconds"><span></span>${$t('second')}</div></div>
                                `;
                            }

                            structure += `
                                <a href="${timerData.promotion_link}">
                                    ${countdownBlock}
                                    <div class="countdown-img">
                                         <svg xmlns="http://www.w3.org/2000/svg" width="29" height="30" viewBox="0 0 29 30" fill="none">
                                             <path d="M14.5576 9.24998C14.7269 9.13722 14.9513 9.13912 15.1188 9.25549L15.2007 9.32618L20.5077 14.6333L20.5854 14.7247C20.6982 14.894 20.6962 15.1185 20.5798 15.2859L20.5091 15.3678L15.1997 20.6752L15.1177 20.7459C14.9231 20.8812 14.653 20.8615 14.4796 20.688C14.3061 20.5145 14.2866 20.2444 14.422 20.0499L14.4927 19.9679L18.1068 16.3537L18.9603 15.5001H17.7532H8.85001L8.75088 15.4935C8.54107 15.4589 8.37442 15.2923 8.33988 15.0824L8.33434 15.0001L8.33988 14.9178C8.37442 14.708 8.54108 14.5413 8.75089 14.5068L8.85 14.5001H17.7532H18.9603L18.1068 13.6466L14.495 10.0347L14.4173 9.94331C14.3046 9.77404 14.3065 9.5496 14.4229 9.38217L14.4802 9.31572L14.5576 9.24998ZM28.3341 15.0011C28.3341 7.36112 22.1408 1.16772 14.5008 1.16772C6.86087 1.16772 0.66748 7.36112 0.66748 15.0011C0.66748 22.641 6.86087 28.8344 14.5008 28.8344C22.1408 28.8344 28.3341 22.641 28.3341 15.0011Z" fill="#FF003C" stroke="white"/>
                                         </svg>
                                    </div>
                                </a>
                            `;
                        }

                        if (timerData.type === 'banner'
                            && timerData.promotion_link
                            && timerData.open_link_in_new_tab
                        ) {
                            timerContainer.wrap(`<a href="${timerData.promotion_link}"
                                target="${(timerData.open_link_in_new_tab === '1') ? '_blank' : '_self'}"></a>`);
                        }

                        if (structure.trim() !== '') {
                            timerContainer.html(structure);
                            timer = setInterval(updateCountdown, 1000);
                        }
                    }
                }.bind(this),
                error: function (xhr, status, error) {
                    console.log(error);
                    console.log(status);
                }
            });
        }
    });
});
