require([
    'jquery',
    'swiper',
    'Magento_Customer/js/customer-data'
], function ($, swiper, customerData) {
    $(document).ready(function () {

        const checkSlider = (callback) => {
            const interval = setInterval(() => {
                if (typeof Swiper === 'function') {
                    callback()
                    clearInterval(interval);
                }
            }, 100)
        }

        let slider1 = () => checkSlider(
            function () {
                new Swiper('#slider1', {
                    spaceBetween: 10,
                    slidesPerView: 1.4,
                    observer: true,
                    observeParents: true,
                    scrollbar: {
                        el: '.swiper-scrollbar',
                        draggable: true
                    },
                    breakpoints: {
                        360: {
                            slidesPerView: 1.4,
                            spaceBetween: 10
                        },
                        1024: {
                            slidesPerView: 2,
                            spaceBetween: 10
                        },
                        1200: {
                            slidesPerView: 5,
                            spaceBetween: 10
                        },
                        1440: {
                            slidesPerView: 5,
                        },
                        1920: {
                            slidesPerView: 6.2
                        }
                    },
                    on: {
                        init: function () {
                            $('#slider1').parents('.sect').show();
                            checkShowTabLink();
                            $('.products_slider_without_tabs').css({
                                'margin-top': '-230px'
                            });
                        },
                    },
                })

                updateMenuBlocks();
            }
        );

        document.addEventListener("slider1", slider1, false);
        if ($('#slider1').length) {
            slider1()
        }

        let bindAll = function () {
            let menuElements = document.querySelectorAll('[data-tab]');

            if (menuElements.length) {
                for (let i = 0; i < menuElements.length; i++) {
                    menuElements[i].addEventListener('click', change, false);
                }
                menuElements[0].classList.add('active');
                document.querySelector('.sliderItem-' + menuElements[0].dataset.tab).classList.add('active');
            }
        };

        let clear = function () {
            let menuElements = document.querySelectorAll('[data-tab]');

            if (menuElements.length) {
                for (let i = 0; i < menuElements.length; i++) {
                    menuElements[i].classList.remove('active');
                    let id = menuElements[i].getAttribute('data-tab');
                    document.querySelector('.sliderItem-' + id).classList.remove('active');
                }
            }
        };

        let change = function (e) {
            clear();
            e.target.classList.add('active');
            let id = e.currentTarget.getAttribute('data-tab');
            let viewMoreLink = e.currentTarget.getAttribute('data-view-more');
            document.querySelector('.sliderItem-' + id).classList.add('active');
            let viewMore = $('#s2-view-more');
            if (viewMoreLink !== undefined && viewMoreLink !== '') {
                viewMore.attr('href', viewMoreLink).css('display', 'block');
            } else {
                viewMore.css('display', 'none');
            }

            let tabsProductItems = []

            if ($('body').hasClass('cms-home')) {
                tabsProductItems = [...Array.from($('.product_tabs_home .slider.active .prodItem.product-item'))];
            }

            initLabelTimer(tabsProductItems);
        };

        bindAll();
        document.addEventListener("bindAll", bindAll, false);

        let slider7 = () => checkSlider(
            function () {
                new Swiper('#slider7', {
                    spaceBetween: 10,
                    slidesPerView: 1.63,
                    breakpoints: {
                        360: {
                            slidesPerView: 1.63,
                            spaceBetween: 10
                        },
                        1024: {
                            slidesPerView: 1.5,
                        },
                        1200: {
                            slidesPerView: 1.6,
                        },
                        1440: {
                            slidesPerView: 1.65,
                        },
                        1920: {
                            slidesPerView: 2.2
                        }
                    },
                    on: {
                        init: function () {
                            $('#slider7').parents('.sect').show();
                        },
                    },
                });
            }
        )

        document.addEventListener("slider7", slider7, false);
        if ($('#slider7').length) {
            slider7()
        }

        let slider2 = () => checkSlider(
            function () {
                new Swiper('#slider2', {
                    spaceBetween: 10,
                    slidesPerView: 6.2,
                    breakpoints: {
                        1024: {
                            slidesPerView: 2,
                            spaceBetween: 10
                        },
                        1200: {
                            slidesPerView: 5,
                            spaceBetween: 10
                        },
                        1440: {
                            slidesPerView: 5,
                        },
                        1920: {
                            slidesPerView: 6.2
                        }
                    },
                    on: {
                        init: function () {
                            $('#slider2').parents('.sect').show();
                        },
                    },
                });
            }
        )

        if ($(window).width() > 1023) {
            document.addEventListener("slider2", slider2, false);
            if ($('#slider2').length) {
               slider2()
            }
        }

        if ($('#sliderMob1').length) {
            var sliderMob1 = () => checkSlider(
                function () {
                    new Swiper('#sliderMob1', {
                        spaceBetween: 0,
                        slidesPerView: 1,
                        autoplay: {
                            delay: 2500,
                        },
                        pagination: {
                            el: '.swiper-pagination',
                            type: 'bullets',
                            bulletActiveClass: 'bull-active',
                            bulletClass: 'bull'
                        },
                    })
                }
            )

            sliderMob1()
        }

        $(document).on('click', '.a-compare-products', (event) => {
            event.preventDefault();

            let href = window.location.href,
                host = window.location.hostname,
                compare_url = $('.a-compare-products')[0].href;

            let host_ru = host + '/ru',
                host_az = host + '/';

            if (href.search(host_ru) === -1 && compare_url.search(host_ru) >= 0) {
                compare_url = compare_url.replace(host_ru, host_az);
            } else if (href.search(host_ru) >= 0 && compare_url.search(host_ru) === -1) {
                compare_url = compare_url.replace(host_az, host_ru + '/');
            }

            window.location.href = compare_url;
        });

        $(document).on('click', '.catalogOptionsWrap', (e) => {
            $(e.currentTarget).hasClass('act') ? $(e.currentTarget).removeClass('act') : $(e.currentTarget).addClass('act');
        });

        $(document).on('click', '.prodItem__but, .prodItem__hidden .prodItem__mmfavor, .prodItem__mmBlock .prodItem__mmfavor, .prodItem__top .prodItem__mmIcon, .prodItem__top_compare .prodItem__mmIcon', (event) => {
            event.stopPropagation();
            event.preventDefault();
            $(event.currentTarget).css('pointer-events', 'none');

            const currentItem = $(event.currentTarget);
            const dataPost = $(event.currentTarget).attr("data-params") ? JSON.parse($(event.currentTarget).attr("data-params")) : {};

            if (dataPost.action && dataPost.data) {

                $.ajax({
                    url: dataPost.action,
                    type: 'POST',
                    dataType: 'json',
                    data: dataPost.data,
                    showLoader: true,
                    success: function (data) {
                        currentItem.css('pointer-events', 'all');

                        if (data.action) {
                            switch (data.action) {
                                case 'catalog_product_compare_remove':
                                    currentItem.parent().find('.removeFromCompare').css('display', 'none');
                                    currentItem.parent().find('.addToCompare').css('display', 'flex');
                                    $(".product-compare").removeClass("active");
                                    $.sections.reload(['compare-products'], true);
                                    customerData.get('compare-products').subscribe(function (data) {
                                        if ($('body').hasClass('catalog-product_compare-index')) {
                                            let activeCount = $('.container__elem.active').length;
                                            $('.srItemSide__dob .count').text(activeCount);
                                        }
                                    });
                                    if ($('body').hasClass('catalog-product_compare-index')) {
                                        $(currentItem).closest(".container__elem").remove();
                                        let prodSku = '.' + $(currentItem).closest(".container__elem").data('sku');
                                        $(prodSku).remove();
                                    }
                                    break;
                                case 'catalog_product_compare_add':
                                    currentItem.parent().find('.removeFromCompare').css('display', 'flex');
                                    currentItem.parent().find('.addToCompare').css('display', 'none');
                                    $(".product-compare").addClass("active");
                                    $.sections.reload(['compare-products'], true);
                                    break;
                                case 'catalog_product_wishlist_remove':
                                    currentItem.parent().find('.removeFromWishlist').css('display', 'none');
                                    currentItem.parent().find('.addToWishlist').css('display', 'flex');
                                    $(".product-wishlist").removeClass("active");
                                    currentItem.closest('.wishlist-index-index .prodItem').remove();
                                    $.sections.reload(['wishlist'], true);
                                    break;
                                case 'catalog_product_wishlist_add':
                                    currentItem.parent().find('.removeFromWishlist').css('display', 'flex');
                                    currentItem.parent().find('.addToWishlist').css('display', 'none');
                                    $(".product-wishlist").addClass("active");
                                    $.sections.reload(['wishlist'], true);
                                    break;
                            }
                        } else {
                            $.async({ selector: '.regAutoriz__popup' }, function () {
                                $('.regAutoriz__popup').show();
                                $('.regAutoriz__bg').show();
                            })
                        }
                        if (window.location.href.indexOf('product_compare') > 0) {
                            // window.location.reload();
                        }
                    },
                    error: function () {
                        currentItem.css('pointer-events', 'all');
                    }
                });
            } else {
                $(event.currentTarget).css('pointer-events', 'all');
            }
        });

        $(document).on('click', function (e) {
            if ($(e.target).closest(".social-media-icons, .share-botton").length > 0) {
                e.preventDefault();
                $(e.target).closest(".prodItem").find(".social-media-icons").addClass('active');
                $(e.target).closest(".prodItem").find(".share-botton").addClass('active');

                if ($(".catalog-product-view").length > 0) {
                    $(".social-media-icons, .share-botton").addClass('active');
                }
            }

            if ($(".social-media-icons.active").length > 0) {
                var div = $(".social-media-icons.active, .share-botton");

                if (!div.is(e.target) && div.has(e.target).length === 0) {
                    $('.social-media-icons, .share-botton').removeClass('active');
                }
            }
        });


        $(document).on('click', '.regAutoriz__popup .regAutoriz__reg', (e) => {
            e.preventDefault();
            $('.regAutoriz__content').show()
            $('.profInfo .profInfo__profileEnter').click()
            setTimeout(() => {
                hideRegPopup();
                $('.create.account').removeClass('d-none');
                $('.block-customer-login').addClass('d-none');
                $('.regAutoriz').addClass('act');
                $('body').addClass('act');
            }, 100)
        });

        $(document).on('click', '.regAutoriz__popup .regAutoriz__login', (e) => {
            e.preventDefault();
            $('.regAutoriz__content').show()
            $( '.profInfo .profInfo__profileEnter').click()
            setTimeout(() => {
                hideRegPopup();
                $('.regAutoriz').addClass('act');
                $('body').addClass('act');
            }, 100)
        });

        $(document).on('click', '.regAutoriz__popup .regAutoriz__close', (e) => {
            e.preventDefault();
            if ($(window).width() < 1024) {
                $('.regAutoriz').removeClass('act');
                $('.mobileMenuContent__information').removeClass('view')
            }
            $('.regAutoriz__content').hide()
            hideRegPopup();
            $('body').removeClass('userAuthPopup-open');
            $('body').removeClass('act');
        });

        $(document).on('click', '.regAutoriz__close', (e) => {
            $(".header, .regAutoriz__bg").removeClass("active");
            $('body, .regAutoriz').removeClass('act');

            $('.regAutoriz__content').hide()
        });

        function hideRegPopup() {
            $('.regAutoriz__popup').hide();
            $('.regAutoriz__bg').hide();
        }

        $(document).on('keyup', '.form-login input', (e) => {
            let passValue = $('.form-login input[type="password"]').val(),
                emailValue = $('.form-login input[type="email"]').val();

            if(passValue != "" && emailValue != "") {
                $(".regAutoriz__reg").removeClass("disabled");
            }else{
                $(".regAutoriz__reg").addClass("disabled");
            }
        });

        $(document).on('click', '.custom-tooltip', (e) => {
            $(e.target).closest('.custom-tooltip').addClass('active');
            e.stopPropagation();
            e.preventDefault();
        });

        $(document).on('click', 'body', (e) => {
            if (!$(e.target).closest('.custom-tooltip').length) {
                $('.custom-tooltip').removeClass('active');
            }
        });

        $(document).on('click', '.in_cart', function () {
            let linkToCart = '/checkout/cart';

            if (window.location.pathname.includes("/ru/")) {
                linkToCart = '/ru' + linkToCart;
            }

            window.location.href = window.location.origin + linkToCart;
        });

        $(document).on('click', '.account .exit', (event) => {
            event.stopPropagation();
            event.preventDefault();
            const href = $(event.currentTarget).find('a').attr('href');

            if (href) {
                $.ajax({
                    url: href,
                    type: 'GET',
                    dataType: 'json',
                    showLoader: true,
                    success: function (data) {
                        $.sections.reload(['customer'], true);
                        window.location.href = '/';
                    }
                });
            }
        });

        var scrollPos = 0;
        $(window).on('scroll', function () {
            var currentScroll = $(this).scrollTop();

            if (currentScroll > scrollPos) {
                $('.catalog__top, .cms-promo .cont').addClass('hide-block');
            } else {
                $('.catalog__top, .cms-promo .cont').removeClass('hide-block');
            }

            scrollPos = currentScroll;
        });

        $('.create.account #form-validate-create-account input').on('keyup', function(){
            var isValid = $(this).valid();
            if(!isValid && $(this).attr("id") == 'register-password') {
                $('.password-error').empty();
                $('.password-error').append($(this).parent().find('#register-password-error'));
            }else{
                $('.password-error').empty();
            }
        });

        if ($(".catalog-category-view .category-view .category-cms .sect.s4").length > 0) {
            $(".catalog-category-view .category-view").addClass("cms-view-category");
        }

        updateMenuBlocks();

        checkCustomerDataLogin();

        let productItems = [...Array.from($('.prodItem.product-item')), ...Array.from($('.prodItemS.product-item'))];

        if ($('body').hasClass('cms-home')) {
            productItems = [...Array.from($('.product_tabs_home .slider.active .prodItem.product-item')), ...Array.from($('.products_slider .prodItem.product-item')), ...Array.from($('.mobs4 .prodItem.product-item')), ...Array.from($('.prodItemS.product-item'))];
        }

        let blockS4 = $('.sect.s4 .slider')

        if ($(window).width() < 1024 && blockS4.length > 0) {
            if (blockS4.find('.swiper-slide').length > 0) {
                blockS4.find('.product-item').unwrap();
            }
        }

        initLabelTimer(productItems);

        if ($('body').hasClass('catalog-product-view')) {
            initLabelTimerOnProduct();

            let swatchContainer = $('.product-swatches-container')

            if (swatchContainer.length > 0) {
                $(document).on('click', '.swatch-option-more', () => {
                    $('.swatch-popup').addClass('active');
                });

                $(document).on('click', '.swatch-popup-title__close', () => {
                    $('.swatch-popup').removeClass('active');
                });


            }
        }

        $.fn.initLabelTimer = initLabelTimer;

        if ($('body').hasClass('catalog-product-view')) {
            let isScrolling;
            const tabs = $('.tables__tab');

            $(window).on('scroll', function () {
                tabs.addClass('not-event');

                clearTimeout(isScrolling);

                isScrolling = setTimeout(function () {
                    tabs.removeClass('not-event');
                }, 200);
            });
        }

        if ($('.product-banner-container').length) {
            $(document).on('click', '.product-banner-item_modal', (event) => {
                window.scrollTo({
                    top: 0
                });
                $('body').addClass('over-hidden');
                $('html').addClass('over-hidden');
                $(event.currentTarget).find('.product-modal-wrapper').addClass('active');
            });

            $(document).on('click', '.product-banner-container .modal-header__close, .product-banner-container .modal-bottom button', (event) => {
                event.preventDefault();
                $('body').removeClass('over-hidden');
                $('html').removeClass('over-hidden');
                $('.product-modal-wrapper').removeClass('active');
            });
        }
    });


    function initLabelTimer(productItems) {

        if (productItems.length > 0) {
            let labelTimerUrl = $(productItems[0]).find('.label-image-wrapper').attr('data-url-prolabels')
            let productIds = [];

            productItems.forEach(item => {
                if ($(item).find('.label-image-wrapper div').length > 0) {
                    let timerContent = JSON.parse($(item).find('.label-image-wrapper div').attr('data-mage-init'))
                    let labels = findKeyAndExtract(timerContent, 'labelsData');
                    let labelTimer = labels.labelsData.find(item => item.position === "timer");
                    if (labelTimer) {
                        let productId = Number(labelTimer.items[0].text);

                        productIds.push(productId);
                    }
                }
            });

            if (productIds.length > 0) {
                $.ajax({
                    url: labelTimerUrl,
                    data: {product_ids: JSON.stringify(productIds), mode: 'category'},
                    method: 'post',
                    global: false,
                    dataType: 'json',
                    success: function (response) {

                        $.each(response, function (key, value) {
                            if (value.active === true) {
                            let timerStructure = `<div class="product-item-timer"><span class="hours"></span><span class="dots">:</span><span class="minutes"></span><span class="dots">:</span><span class="seconds"></span></div>`;
                            if ($(`#${key}`).hasClass('prodItemS')) {
                                if ($(`#${key}`).find('.product-item-timer').length < 1) {
                                    $(`#${key}`).find('.prodItemS__r').append(timerStructure)
                                    let productItemTimerSContainer = $(`#${key}`).find('.prodItem__timer-label');
                                    let productItemTimerS = $(`#${key}`).find('.prodItemS__r .product-item-timer');

                                    if (productItemTimerSContainer.length > 0 && $(window).width() > 1023) {
                                        productItemTimerSContainer.append(productItemTimerS);
                                    }
                                }
                            } else if ($(`#${key}`).hasClass('product-item_small')) {
                                if ($(`#${key}`).find('.product-item-timer').length < 1) {
                                    $(`#${key}`).find('.prodItem-info').append(timerStructure);
                                    $(`#${key}`).addClass('has-timer');
                                }
                            } else {
                                if ($(`#${key}`).find('.product-item-timer').length < 1) {
                                    $(`#${key}`).find('.label-image-wrapper').append(timerStructure);
                                }
                            }


                            let productItemTimer = $(`#${key}`).find('.product-item-timer');

                            let timer = setInterval(() => {
                                let date = value;

                                date.time_left -= 1;

                                let days = Math.floor(date.time_left / (60 * 60 * 24));
                                let hours = Math.floor((date.time_left % (60 * 60 * 24)) / (60 * 60));
                                let minutes = Math.floor((date.time_left % (60 * 60)) / 60);
                                let seconds = Math.floor((date.time_left % 60));

                                hours += days * 24;

                                hours = hours >= 10 ? hours : '0' + hours;
                                minutes = minutes >= 10 ? minutes : '0' + minutes;
                                seconds = seconds >= 10 ? seconds : '0' + seconds;

                                $(`#${key}`).find('.product-item-timer .hours').text(hours);
                                $(`#${key}`).find('.product-item-timer .minutes').text(minutes);
                                $(`#${key}`).find('.product-item-timer .seconds').text(seconds);

                                if (!productItemTimer.hasClass("active")) {
                                    productItemTimer.addClass("active");
                                }

                                if (date.time_left <= 0) {
                                    if (productItemTimer.hasClass("active")) {
                                        productItemTimer.removeClass("active");
                                    }
                                    clearInterval(timer);
                                }
                            }, 1000);
                            }
                        });

                    }.bind(this),
                    error: function (xhr, status, error) {
                        console.log(error);
                        console.log(status);
                    }
                });
            }
        }
    }

    function initLabelTimerOnProduct() {
        let priceLabelContainer = $('.product-price-label');

            let labelTimerUrl = priceLabelContainer.attr('data-url-prolabels');
            let productIds = [Number(priceLabelContainer.attr('data-id'))];

            if (productIds.length > 0) {
                $.ajax({
                    url: labelTimerUrl,
                    data: {product_ids: JSON.stringify(productIds), mode: 'product'},
                    method: 'post',
                    global: false,
                    dataType: 'json',
                    success: function (response) {
                        console.log('response')
                        console.log(response)
                        $.each(response, function (key, value) {
                            if (value.active === true) {
                                let timerStructure = `<div class="product-item-timer"><span class="hours"></span><span class="dots">:</span><span class="minutes"></span><span class="dots">:</span><span class="seconds"></span></div>`

                                if (priceLabelContainer.find('.product-item-timer').length < 1) {
                                    priceLabelContainer.append(timerStructure)
                                }


                                let productItemTimer = priceLabelContainer.find('.product-item-timer');

                                console.log(productItemTimer)

                                let timer = setInterval(() => {
                                    let date = value;

                                    date.time_left -= 1;

                                    let days = Math.floor(date.time_left / (60 * 60 * 24));
                                    let hours = Math.floor((date.time_left % (60 * 60 * 24)) / (60 * 60));
                                    let minutes = Math.floor((date.time_left % (60 * 60)) / 60);
                                    let seconds = Math.floor((date.time_left % 60));

                                    hours += days * 24;

                                    hours = hours >= 10 ? hours : '0' + hours;
                                    minutes = minutes >= 10 ? minutes : '0' + minutes;
                                    seconds = seconds >= 10 ? seconds : '0' + seconds;

                                    productItemTimer.find('.hours').text(hours);
                                    productItemTimer.find('.minutes').text(minutes);
                                    productItemTimer.find('.seconds').text(seconds);

                                    if (!productItemTimer.hasClass("active")) {
                                        productItemTimer.addClass("active");
                                    }

                                    if (date.time_left <= 0) {
                                        if (productItemTimer.hasClass("active")) {
                                            productItemTimer.removeClass("active");
                                        }
                                        clearInterval(timer);
                                    }
                                }, 1000);
                            }
                        });

                    }.bind(this),
                    error: function (xhr, status, error) {
                        console.log(error);
                        console.log(status);
                    }
                });
            }
    }
    function findKeyAndExtract(obj, targetKey, result = {}) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (key === targetKey) {
                    result[key] = obj[key];
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    findKeyAndExtract(obj[key], targetKey, result);
                }
            }
        }
        return result;
    }

    $(document).on('breeze:resize', function (event, data) {
        updateMenuBlocks();
    });

    $(".sliderok .prodItem").on("mouseover", function (e) {
        $("footer.foot").removeClass("show");
    });

    $(".sliderok .prodItem").on("mouseout", function (e) {
        $("footer.foot").addClass("show");
    });

    let showLink = true;

    function checkShowTabLink() {
        if (showLink) {
            if ($('.prodFilters').length) {
                $(".prodFilters > .active").click();
                showLink = false;
            }
        }
    };

    function checkCustomerDataLogin() {

        let sections = ['customer'],
            customer = customerData.get(sections)();

        if (!customer?.firstname) {
            customerData.invalidate(sections);
            customerData.reload(sections, true);
        }
    };

    function updateMenuBlocks() {
        let slider = $(".sect.s1 .container .container__elem .slider");

        if (slider.length) {

            let maxHeight = slider.innerHeight();

            $.async({ selector: '.menu.container__elem--3'}, function (el) {
                const blocks = $('.sect.s1 .container .container__elem');

                blocks.each((index, block) => {
                    if ((blocks.length < 2) ||
                        $(block).find(".downSlider__start").length ||
                        $(block).hasClass("container__elem--jcsb")) {
                        return;
                    }

                    if (maxHeight > 0) {
                        block.style.height = `${maxHeight}px`;
                        $('.sect.s1 > .container').css('max-height', `${maxHeight}px`)
                        let dealSwiper = $(block).find(".dealSwiper");
                        if (dealSwiper.length) {
                            dealSwiper.height(`${maxHeight}px`);
                            dealSwiper.find(".deal__bottom").height(`${maxHeight - 104}px`);
                        }
                    }
                });
            })
        }

        let catalogMenu = $(".sect.s1 .container .container__elem .catalogMenu");

        if (catalogMenu.length) {
            catalogMenu.css("min-width", catalogMenu.width());
            catalogMenu.css("max-width", catalogMenu.width());
            let leftMarginMenuLink = catalogMenu.innerWidth();
            catalogMenu.find(".sect.s1 .childrenMenus__link").css("left", `${leftMarginMenuLink}px`);
        }
    }
});
