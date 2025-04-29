require([
    'jquery',
    'Magento_Customer/js/customer-data',
    'mage/url',
    'mage/translate'
], function($, customerData, urlBuilder) {
    'use strict';

    const layoutHandle = 'dynamic_layout_handle';

    const layoutUrl = urlBuilder.build('eltrino_ajaxloadblock/ajax/loadblock');

    const pageUrl = new URL(window.location.href);

    const customScripts = () => {
        // $('head').append(`<script async src="${require.toUrl('js/swiper-bundle.min.js')}"></script>`)
        $('head').append(`<script async src="${require.toUrl('js/imask.min.js')}"></script>`)
    }

    const documentEvents = (callback) => {
        $(document).on("mousemove.customEvent keypress.customEvent scroll.customEvent click.customEvent keydown.customEvent", function () {
            $(this).off('.customEvent');
            callback.map(func => func())
        })
    }

    const checkResetPassword = () => {
        if (pageUrl.searchParams.get('login_popup') === '1') {
            let isLoggedIn = customerData.get('customer')();
            if(!isLoggedIn.isLoggedIn) {
                console.log(isLoggedIn.isLoggedIn);
                $('.profInfo .profInfo__profileEnter').click();
            } else {
                setTimeout(() => {
                    checkResetPassword();
                }, 500);
            }
        }
    }

    const loginComponent = () => {
        let customer = customerData.get('customer');

        const openAuthModal = 'userAuthPopup-open'
        let timer = null;
        let callCount = 0;

        $(document).on('click', '.profInfo .profInfo__profileEnter', function(e) {
            e.preventDefault();

            if ($('body.checkout-cart-index').length || $('body.firecheckout-index-index').length) return;

            const blockName = 'dynamic.block.transfer';

            clearTimeout(timer);

            const postClickFunction = () => {
                $('body').addClass(openAuthModal);

                let profileIcon = $(".profInfo .profInfo__profileEnter");

                if ($(window).width() < 1024) {
                    const mobileMenuContentInformation = document.querySelector('.mobileMenuContent__information');
                    const mobileMenuContentInformationAccount = document.querySelector('.mobileMenuContent__information__account');
                    const mobileMenuContentButInformation = document.querySelector('.mobileMenuContent__information__but');

                    $('body').addClass('lock-scroll');

                    if (mobileMenuContentInformation) {
                        mobileMenuContentInformation.classList.add('view');

                        if(profileIcon.hasClass('profile')) {
                            $('.regAutoriz__popup, .regAutoriz__content, .regAutoriz__bg').hide();
                        }

                        if(profileIcon.hasClass('signin') || profileIcon.hasClass('profile')) {
                            mobileMenuContentInformation.classList.add('view');
                            $(".header, .regAutoriz__bg").removeClass("active");
                            $('.regAutoriz__popup, .regAutoriz__content, .regAutoriz__bg').hide();
                        } else {
                            mobileMenuContentInformation.classList.remove('view');
                            $(".header, .regAutoriz__bg").addClass("active");
                            $('.regAutoriz__popup, .regAutoriz__content, .regAutoriz__bg').show();
                        }

                        mobileMenuContentButInformation.addEventListener('click', () => {
                            mobileMenuContentInformation.classList.remove('view');
                        });

                        mobileMenuContentInformationAccount.addEventListener('click', () => {
                            if(!($(".profInfo__profileEnter.profile").length > 0)) {
                                mobileMenuContentInformation.classList.remove('view');
                                $('.regAutoriz').addClass('act');
                            }
                        });
                    }
                } else {
                    $('.regAutoriz__content').show();

                    if(profileIcon.hasClass('profile')) {
                        $('body').removeClass('userAuthPopup-open');
                        // window.location.href = urlBuilder.build('customer/account/index');
                    }else{
                        $('.regAutoriz').addClass('act');
                    }
                }
            }

            if ($('.regAutoriz .regAutoriz__content').length || callCount > 0) {
                postClickFunction();
            } else {
                $.post({
                    url: urlBuilder.build('eltrino_ajaxloadblock/ajax/loadblock'),
                    data: {
                        layoutHandle: layoutHandle,
                        blockName: blockName
                    },
                    showLoader: true,
                    success: function(response) {
                        if (response.html) {
                            if ($('.regAutoriz .regAutoriz__content').length > 0) return;

                            if ($('.regAutoriz') && $('.regAutoriz').length > 0) {
                                $('.regAutoriz .regAutoriz__bg').after(response.html)
                            } else {
                                $('body').append(`<div class="regAutoriz">${response.html}</div>`).trigger('contentUpdated');
                            }

                            timer = setTimeout(() => {
                                postClickFunction()
                            }, 500)

                            callCount = callCount + 1;
                        }
                    },
                    error: function(e) {
                        console.log('Error loading Login block.', e);
                    }
                });
            }
        });


        if (customer()?.firstname && customer()?.fullname) {
            addTagInProfile(customer());
        } else {
            customerData?.reload(['customer']);
            customer.subscribe(function (updatedCustomer) {
                addTagInProfile(updatedCustomer);
            }, this);
        }

        function addTagInProfile(customer) {
            let accountBlock = $('.profInfo .profInfo__profileEnter'),
                mobileNameContent = $('.mobileMenuContent__information__wrap'),
                fullName = customer && customer.fullname ? customer.fullname.split(' ') : '',
                nickname = customer.nickname === '' ? (fullName[0][0] + fullName[1][0]).toUpperCase() : customer.nickname;
    
            if (accountBlock.hasClass('profile') && fullName) {
                if (fullName && fullName[0] && fullName[1]) {
                    mobileNameContent.find('.wrapper-text .text__0').text(fullName[0] + ' ' + fullName[1]);
                    accountBlock.find('span').text(nickname);
                    $('.wrapper-person.profInfo__profileEnter.profile span').text(nickname);
                    $("#block-collapsible-nav .profInfo__profileEnter.profile span").text(nickname);
                }

            }
            $(".profile-nickname").removeClass('custom-blur')
        }
    }

    const liveChatComponent = () => {
        const blockName = 'dynamic.livechat.loading';
        setTimeout(() => {
            $.post({
                url: urlBuilder.build('eltrino_ajaxloadblock/ajax/loadblock'),
                data: {
                    layoutHandle: layoutHandle,
                    blockName: blockName
                },
                success: (response) => {
                    if (response.html) {
                        $('body').append(response.html).trigger('contentUpdated');
                    }
                },
                error: async (e, r) => {
                    console.log('Error loading LiveChat block.',  r);
                }
            })
        }, 1000)
    }

    const BreezeJsComponent = () => {
        const blockName = 'dynamic.breeze.js.loading';
        $.post({
            url: urlBuilder.build('eltrino_ajaxloadblock/ajax/loadblock'),
            data: {
                layoutHandle: layoutHandle,
                blockName: blockName
            },
            success: (response) => {
                if (response.html) {
                    $('body').append(response.html).trigger('contentUpdated');
                }
            },
            error: (e) => {
                console.log('Error loading BreezeJsComponent ', e);
            }
        })
    }

    $(document).ready(function() {
        setTimeout(() => {
            customScripts()
        }, 2000)

        loginComponent();
        documentEvents([liveChatComponent]);
        checkResetPassword();
    });
});
