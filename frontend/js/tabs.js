require([
    'jquery'
], function($) {
    $(document).ready(function () {
        let isManualScroll = false;

        let productReviewsContainer = $("#product-review-container"),
                productReviewsContainerChild = productReviewsContainer.find("#customer-reviews"),
                productDescription = $(".tabbs__content .product.attribute.description");

        if(productReviewsContainer) {
            productReviewsContainer.insertAfter($('#rich-content'));
        }

        if(productReviewsContainerChild.length > 0) {
            $(".tabbs__content.reviews .head-block").addClass("hide");
            $(".tables__tab.js-tab.Reviews").addClass("hide");
        }

        // extend content
        $(document).on('click', '.contentosResult', function () {
            let characteristicsBlock = document.querySelector('.tabbs__contentWR');
            if (characteristicsBlock !== null) {
                $(this).toggleClass("extended");
                characteristicsBlock.classList.toggle("extended");

                if(!$(this).hasClass("extended")) {
                    window.scrollTo({
                        top: 750,
                        behavior: 'smooth'
                    });
                }
            }
        });



        //switching between tabs
        // $(".js-tab-item").not(":first-child").removeClass("active");
        $(".js-tab").click(function () {
            let scrollValue = window.outerWidth < 768 ? 1250 : 750;
            if($(this).hasClass("Reviews")) {
                scrollTo("product-review-container");
            }else{
                const element = $(".tables__items").get(0);
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = window.pageYOffset + elementPosition - 150;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }

            if ($(this)) {
                let tabs = $(".tabbs .tables__tab"),
                    tabItem = $(".tables__items .js-tab-item"),
                    currentTab = $(this);

                tabs.removeClass("active");
                $(this).addClass("active");

                if(tabs.length > 0 && tabItem.length > 0) {
                    tabItem.each(function(index, item) {
                        // $(item).removeClass("active");
                        if($(item).data("id") == currentTab.data("id")) {
                            $(item).addClass("active");
                            // window.scrollTo({
                            //     top: scrollValue,
                            //     behavior: 'smooth'
                            // });
                        }
                    });
                }
            }

            let productReviews = $("#product-review-container"),
                productReviewsChild = productReviews.find("#customer-reviews");

            if(productReviewsChild.length > 0) {
                $(".tabbs__content.reviews .head-block").addClass("hide");
            }


        });


        $(".product-reviews-summary.rating-count").click(function () {
            $("#rich-content").get(0).scrollIntoView({behavior: 'smooth'});
        });

        // $(".product-reviews-summary.rating-count").click(function () {
        //     $(".js-tab.Reviews").click();
        //     setTimeout(function() {
        //         let target = document.querySelector('.js-tab-item.active');
        //         if (target) {
        //             target.scrollIntoView({ behavior: 'smooth' });
        //         }
        //     }, 100);
        // });

        function scrollTo(id) {
            isManualScroll = true;

            const element = document.getElementById(id);

            if (!element) {
                console.warn(`Element with id '${id}' not found.`);
                return;
            }

            const initialPosition = element.getBoundingClientRect().top + window.pageYOffset;
            let offset;

            // Calculate offset based on screen width and the target element's ID
            switch (id) {
                case "product-review-container":
                    offset = window.innerWidth > 1024 ? -290 : -210;
                    break;
                case "0-tab":
                case "1-tab":
                    offset = window.innerWidth > 1024 ? -215 : -125;
                    break;
                default:
                    offset = window.innerWidth > 1024 ? -250 : -160;
            }

            const targetPosition = initialPosition + offset;

            // Scroll to the target position
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Monitor for changes in position in case of dynamic loading
            const checkPosition = setInterval(() => {
                const currentElementPosition = element.getBoundingClientRect().top + window.pageYOffset + offset;
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

                // If the element has shifted due to dynamic loading, re-scroll to the new position
                if (Math.abs(currentScroll - currentElementPosition) > 10) {
                    window.scrollTo({
                        top: currentElementPosition,
                        behavior: 'smooth'
                    });
                } else {
                    // Stop checking once the element remains in place
                    clearInterval(checkPosition);
                }
            }, 300);

            setTimeout(function () {
                isManualScroll = false;
            }, 700);
        }

        function isElementVisible(el) {
            const elementTop = $(el).offset().top;
            const elementBottom = elementTop + $(el).outerHeight();

            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();

            return elementBottom > viewportTop && elementTop < viewportBottom;
        }

    function activateTab(tabSelector) {
        $(".tables__tab").removeClass("active");
        $(tabSelector).addClass("active");
    }



        const sliderRelatedProducts = $("#slider-related-products"),
            sliderAlternativeChoice = $("#slider-alternative-choice"),
            sliderUpsaleProducts =$("#slider-upsale-products");

        if(sliderRelatedProducts.length > 0) {
            $(".tab-related-products").removeClass("hide");
        }

        if(sliderAlternativeChoice.length > 0) {
            $(".tab-alternative-choice").removeClass("hide");
        }

        if(sliderUpsaleProducts.length > 0) {
            $(".tab-upsale-products").removeClass("hide");
        }

        $(document).on('click', '.rating-count', function () {
            scrollTo("product-review-container");
        });

        $(document).on('click', '.tab-related-products', function () {
            scrollTo("slider-related-products");
        });

        $(document).on('click', '.tab-alternative-choice', function () {
            scrollTo("slider-alternative-choice");
        });

        $(document).on('click', '.tab-upsale-products', function () {
            scrollTo("slider-upsale-products");
        });

        $(document).on('click', "[data-id='1-tab']", function () {
            scrollTo("1-tab");
        });

        $(document).on('click', "[data-id='0-tab']", function () {
            scrollTo("0-tab");
        });

        // custom pages tabs
        let tabsNavigation = $(".tabs-navigation");
        if (tabsNavigation !== undefined && tabsNavigation.length) {
            $("#maincontent").addClass("tabs-page");
        }

        $(document).on("scroll", function () {
            if ($('body').hasClass('catalog-product-view')) {
                if (isManualScroll) return;

                if (isElementVisible("#1-tab") && !$('#1-tab').hasClass('empty-block')) {
                    activateTab(".js-tab[data-id='1-tab']");
                }
                else if (isElementVisible("#product-review-container")) {
                    activateTab(".js-tab[data-id='2-tab']");
                }
                else if (isElementVisible("#0-tab")) {
                    activateTab(".js-tab[data-id='0-tab']");
                }
                else {
                    $(".tables__tab").removeClass("active");
                }
            }
        });
    });
});
