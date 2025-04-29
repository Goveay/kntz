/* global _ ko */
(function () {
    'use strict';

    $.widget('renderLabels', {
        options: {
            template: 'Swissup_ProLabels_labels',
            labelsData: {},
            predefinedVars: {},
            target: '',
            renderMode: 'replaceChildren'
        },

        /** Add ko template bind and apply ko binding to element */
        create: function () {
            var me = this;

            me.viewModel = new $.prolabels.ViewModel(
                me.options.labelsData,
                me.options.predefinedVars
            );

            ko.renderTemplate(
                me.options.template,
                me.viewModel,
                {},
                $(me.options.target || me.element, me.element).get(0),
                me.options.renderMode
            );
        }
    });

    $.widget('prolabels', {
        component: 'Swissup_ProLabels/js/prolabels',
        options: {
            parent: null,
            imageLabelsTarget: '',
            imageLabelsInsertion: 'appendTo',
            imageLabelsWrap: true,
            imageLabelsRenderAsync: false,
            contentLabelsTarget: '',
            contentLabelsInsertion: 'appendTo',
            labelsData: {},
            predefinedVars: {}
        },

        /** [create description] */
        init: function () {
            var baseImageElement,
                contentElement,
                me = this;

            me.containers = {};
            me.renderContext = me.options.parent ?
                me.element.closest(me.options.parent) :
                me.element;

            baseImageElement = me.options.imageLabelsTarget ?
                me.renderContext.find(me.options.imageLabelsTarget) :
                me.renderContext;
            me.renderImageLabels(baseImageElement.get(0));

            contentElement = me.renderContext.find(me.options.contentLabelsTarget);
            me.renderContentLabels(contentElement.get(0));

            me.transformationLabel(me)

        },

        destroy: function () {
            if (this.containers.imageLabels) {
                this.containers.imageLabels.remove();
            }

            if (this.containers.contentLabels) {
                this.containers.contentLabels.remove();
            }

            this._super();
        },

        transformationLabel: function (me) {
            // bottom label start
            let labelBottomWrap = me.renderContext.find('.prodItem__bottom-label');
            let labelBottom = me.renderContext.find('.bottom.prodItem__top');
            let labelWrapper = me.renderContext.find('.prodItem__top_labels');
            let prodItemSL = me.renderContext.find('.prodItem-labels-wrap');
            let labelCloneMob = labelWrapper.clone();

            if (labelBottom.length > 0 && labelBottomWrap.length > 0) {
                labelBottomWrap.get(0).append(labelBottom.get(0));
            }

            if ($(window).width() < 1024 && prodItemSL.length > 0 && labelWrapper.length > 0) {
                prodItemSL.get(0).prepend(labelCloneMob.get(0));
            }

            // bottom label end

            // sale label start
            let labelSaleWrap = me.renderContext.find('.prodItem-discount');
            let labelSale = me.renderContext.find('.cash-sale.prodItem__top');

            if (labelSale.length > 0 && labelSaleWrap.length > 0) {
                labelSaleWrap.get(0).append(labelSale.get(0));
            }

            // sale label end

            // image label start
            let labelImgWrap = me.renderContext.find('.label-image-wrapper');
            let labelImg = me.renderContext.find('.middle-right.prodItem__top').length > 0 ? me.renderContext.find('.middle-right.prodItem__top') : me.renderContext.find('.middle-left.prodItem__top');
            let labelImgDiscount = me.renderContext.find('.discount-percent.prodItem__top');
            let labelImgContainer = $('<div class="label-image-container"></div>');

            if (labelImgWrap.length > 0) {
                labelImgWrap.get(0).append(labelImgContainer.get(0));

                if (labelImgDiscount.length > 0) {
                    labelImgContainer.get(0).append(labelImgDiscount.get(0));
                }

                if (labelImg.length > 0) {
                    labelImgContainer.get(0).append(labelImg.get(0));
                }

                if (me.renderContext.find('.middle-left.prodItem__top').length > 0) {
                    labelImgContainer.addClass('row-revers');
                }
            }
            // image label end

            // under-foto label start
            var labelUnderFotoWrap = me.renderContext.find('.additional-delivery');
            var labelUnderFoto =
                    me.renderContext.find('.under-foto.prodItem__top').length > 0 ? me.renderContext.find('.under-foto.prodItem__top') :
                            me.renderContext.find('.under-foto-link.prodItem__top').length > 0 ? me.renderContext.find('.under-foto-link.prodItem__top') :
                                    me.renderContext.find('.under-foto-modal.prodItem__top');
            if (labelUnderFoto.length > 0 && labelUnderFotoWrap.length > 0) {
                labelUnderFotoWrap.append(labelUnderFoto.get(0));
                labelUnderFotoWrap.addClass('active');
            }
            // under-foto label end

            // product page

            let topLabelContainer = me.renderContext.find('.top-label-container');
            let topLabelRenders = me.renderContext.find('.prodItemas__left .prodItem__top');

            if (topLabelRenders.length > 0) {
                topLabelContainer.get(0).append(topLabelRenders.get(0));

                // image label start
                let productLabelImgWrap = me.renderContext.find('.main-image-wrapper');
                let productLabelImg = me.renderContext.find('.middle-right.prodItem__top').length > 0 ? me.renderContext.find('.middle-right.prodItem__top') : me.renderContext.find('.middle-left.prodItem__top');

                if (productLabelImg.length > 0 && productLabelImgWrap.length > 0) {
                    productLabelImgWrap.get(0).append(productLabelImg.get(0));
                }
                // image label end


                // sale label start
                let productLabelSaleWrap = me.renderContext.find('.product-price-label');
                let productLabelSale = me.renderContext.find('.cash-sale.prodItem__top');

                if (productLabelSale.length > 0 && productLabelSaleWrap.length > 0) {
                    productLabelSaleWrap.get(0).append(productLabelSale.get(0));
                }

                // sale label end

                // bottom label link start
                let productLabelBottomWrap = me.renderContext.find('.bottom-label-container');
                let productCalksWrap = me.renderContext.find('.calks');
                let productLabelBottom1 = me.renderContext.find('.link-bottom-1.prodItem__top');
                let productLabelBottom2 = me.renderContext.find('.link-bottom-2.prodItem__top');
                let productLabelBottom3 = me.renderContext.find('.link-bottom-3.prodItem__top');

                if (productLabelBottom1.length > 0 || productLabelBottom2.length > 0 || productLabelBottom3.length > 0 ) {
                    productCalksWrap.addClass('has-bottom-label');
                    productLabelBottomWrap.addClass('active');
                }

                if (productLabelBottom1.length > 0 ) {
                    productLabelBottomWrap.get(0).append(productLabelBottom1.get(0));
                }

                if (productLabelBottom2.length > 0 ) {
                    productLabelBottomWrap.get(0).append(productLabelBottom2.get(0));
                }

                if (productLabelBottom3.length > 0 ) {
                    productLabelBottomWrap.get(0).append(productLabelBottom3.get(0));
                }

                // bottom label link end

                // bottom label modal start
                let productLabelBottomModal1 = me.renderContext.find('.modal-bottom-1.prodItem__top');
                let productLabelBottomModal2 = me.renderContext.find('.modal-bottom-2.prodItem__top');
                let productLabelBottomModal3 = me.renderContext.find('.modal-bottom-3.prodItem__top');

                if (productLabelBottomModal1.length > 0 || productLabelBottomModal2.length > 0 || productLabelBottomModal3.length > 0 ) {
                    productCalksWrap.addClass('has-bottom-label');
                    productLabelBottomWrap.addClass('active');
                }

                if (productLabelBottomModal1.length > 0 ) {
                    productLabelBottomWrap.get(0).append(productLabelBottomModal1.get(0));
                }

                if (productLabelBottomModal2.length > 0 ) {
                    productLabelBottomWrap.get(0).append(productLabelBottomModal2.get(0));
                }

                if (productLabelBottomModal3.length > 0 ) {
                    productLabelBottomWrap.get(0).append(productLabelBottomModal3.get(0));
                }

                // bottom label modal end
            }

            $.async({ selector: '.bottom-label-container'}, function (el) {
                const slider = document.querySelector('.bottom-label-container');
                let isDown = false;
                let startX;
                let scrollLeft;
                const bottomLabels = $('.bottom-label-container .prodItem__top');

                slider.addEventListener('mousedown', (e) => {
                    isDown = true;
                    startX = e.pageX - slider.offsetLeft;
                    scrollLeft = slider.scrollLeft;
                    bottomLabels.removeClass('event-none');
                });

                slider.addEventListener('mouseleave', () => {
                    isDown = false;
                    bottomLabels.removeClass('event-none');
                });

                slider.addEventListener('mouseup', (e) => {
                    isDown = false;
                    bottomLabels.removeClass('event-none');
                });

                slider.addEventListener('mousemove', (e) => {
                    if(!isDown) return;
                    e.preventDefault();
                    bottomLabels.addClass('event-none');
                    const x = e.pageX - slider.offsetLeft;
                    const walk = (x - startX) * 2;
                    slider.scrollLeft = scrollLeft - walk;
                });
            })

            $(document).on('click', '.modal-bottom-1, .modal-bottom-3, .modal-bottom-2, .under-foto-modal', (event) => {
                $('body').addClass('over-hidden');
                $('html').addClass('over-hidden');
                $(event.currentTarget).find('.product-modal-wrapper').addClass('active');
            });

            $(document).on('click', '.modal-header__close, .modal-bottom button', (event) => {
                $('body').removeClass('over-hidden');
                $('html').removeClass('over-hidden');
                $('.product-modal-wrapper').removeClass('active');
            });

            $(document).on('click', '.product-modal-wrapper', (event) => {
                if (!$(event.target).closest('.modal-content').length) {
                    $('body').removeClass('over-hidden');
                    $('html').removeClass('over-hidden');
                    $('.product-modal-wrapper').removeClass('active');
                }
            });

            $.async({ selector: '.product-banner-container'}, function (el) {
                let productLabelBannerWrap = me.renderContext.find('.product-banner-container');
                let productLabelBannerSlider = productLabelBannerWrap.find('#product-banner');
                let productLabelBannerLink1 = me.renderContext.find('.banner-link-1.prodItem__top');
                let productLabelBannerLink2 = me.renderContext.find('.banner-link-2.prodItem__top');
                let productLabelBannerLink3 = me.renderContext.find('.banner-link-3.prodItem__top');
                let productLabelBannerModal1 = me.renderContext.find('.banner-modal-1.prodItem__top');
                let productLabelBannerModal2 = me.renderContext.find('.banner-modal-2.prodItem__top');
                let productLabelBannerModal3 = me.renderContext.find('.banner-modal-3.prodItem__top');
                let wrapperBanner = $('<div></div>').attr('class', 'swiper-slide product-banner-item');

                if (productLabelBannerWrap.length > 0) {
                    if (productLabelBannerLink1.length > 0 ) {
                        productLabelBannerLink1.wrap(wrapperBanner.clone());
                        productLabelBannerSlider.find('.swiper-wrapper').get(0).append(productLabelBannerLink1.parent().get(0));
                    }

                    if (productLabelBannerLink2.length > 0 ) {
                        productLabelBannerLink2.wrap(wrapperBanner.clone());
                        productLabelBannerSlider.find('.swiper-wrapper').get(0).append(productLabelBannerLink2.parent().get(0));
                    }

                    if (productLabelBannerLink3.length > 0 ) {
                        productLabelBannerLink3.wrap(wrapperBanner.clone());
                        productLabelBannerSlider.find('.swiper-wrapper').get(0).append(productLabelBannerLink3.parent().get(0));
                    }

                    if (productLabelBannerModal1.length > 0 ) {
                        productLabelBannerModal1.wrap(wrapperBanner.clone());
                        productLabelBannerSlider.find('.swiper-wrapper').get(0).append(productLabelBannerModal1.parent().get(0));
                    }

                    if (productLabelBannerModal2.length > 0 ) {
                        productLabelBannerModal2.wrap(wrapperBanner.clone());
                        productLabelBannerSlider.find('.swiper-wrapper').get(0).append(productLabelBannerModal2.parent().get(0));
                    }

                    if (productLabelBannerModal3.length > 0 ) {
                        productLabelBannerModal3.wrap(wrapperBanner.clone());
                        productLabelBannerSlider.find('.swiper-wrapper').get(0).append(productLabelBannerModal3.parent().get(0));
                    }

                    if ($('.product-banner-container .swiper-wrapper').find('.product-banner-item').length > 0) {
                        require(['swiper'], function(swiper) {
                            new Swiper('#product-banner', {
                                spaceBetween: 0,
                                draggable: true,
                                slidesPerView: 1,
                                autoplay: {
                                    delay: 10000,
                                },
                            })
                        });
                        productLabelBannerWrap.removeClass('hide-banner');
                    }
                }

            });

        },

        /**
         * Render prolabels for product image.
         *
         * @param  {String} baseImage
         */
        renderImageLabels: function (baseImage) {
            var targetElement,
                insertionMethod,
                options,
                me = this;

            if (me.options.imageLabelsWrap &&
                !$(baseImage).hasClass('prolabels-wrapper')
            ) {
                if ($(baseImage).parent().hasClass('prolabels-wrapper')) {
                    // parent element has wrappr class
                    targetElement = $(baseImage).parent();
                } else {
                    // add prolabels-wrapper
                    targetElement = $(baseImage)
                        .wrap('<div class="prolabels-wrapper"></div>')
                        .parent();
                }
            } else {
                // do not add prolabels-wrapper
                targetElement = $(baseImage);
            }

            options = {
                labelsData: me.getImageLabels(),
                predefinedVars: me.options.predefinedVars
            };

            if (targetElement.length) {
                insertionMethod = me.options.imageLabelsInsertion;
                me.containers.imageLabels = $('<div class="prodItem__top prodItem__top_labels"></div>');
                me.containers.imageLabels[insertionMethod](targetElement);
                me.containers.imageLabels.renderLabels(options);
            }
        },

        /**
         * Render prolabels in product info.
         *
         * @param  {String} outputElement
         */
        renderContentLabels: function (outputElement) {
            var insertionMethod,
                options,
                me = this;

            insertionMethod = me.options.contentLabelsInsertion;
            me.containers.contentLabels = $('<div class="prolabels-content-wrapper"></div>');
            me.containers.contentLabels[insertionMethod]($(outputElement));
            options = {
                labelsData: me.getContentLabels(),
                predefinedVars: me.options.predefinedVars
            };
            me.containers.contentLabels.renderLabels(options);
        },

        /**
         * @return {Object}
         */
        getImageLabels: function () {
            var data = [];

            $.each(this.options.labelsData, function () {
                if (this.position !== 'content') {
                    data.push(this);
                }
            });

            return data;
        },

        /**
         * @return {Object}
         */
        getContentLabels: function () {
            var data = [];

            $.each(this.options.labelsData, function () {
                if (this.position === 'content') {
                    data.push(this);
                }
            });

            return data;
        }
    });

    $.widget('prolabelsConfigurable', {
        component: 'Swissup_ProLabels/js/prolabels-configurable',

        /** [create description] */
        create: function () {
            var self = this;

            this.reinitProlabels(this.options.superProduct);

            // Listen options change when swatches disabled.
            $(this.options.configurableOptions).on('change.prolabels', function () {
                var configurable = $('#product_addtocart_form').data('configurable');

                if (configurable) {
                    self.reinitProlabels(configurable.simpleProduct);
                }
            });

            // Listen options change when swatches enabled.
            $(this.options.swatchOptions).on('change.prolabels', function (event) {
                var swatchRenderer = $(event.currentTarget).data('SwatchRenderer');

                if (swatchRenderer) {
                    self.reinitProlabels(swatchRenderer.getProduct());
                }
            });
        },

        /** [destroy description] */
        destroy: function () {
            $(this.options.configurableOptions).off('change.prolabels');
            $(this.options.swatchOptions).off('change.prolabels');
            this._super();
        },

        /** [reinitProlabels description] */
        reinitProlabels: function (product) {
            var prolabels = this.element.data('prolabels');

            if (prolabels && prolabels.destroy) {
                prolabels.destroy();
            }

            product = product ? product : this.options.superProduct;

            if (this.options.labels[product]) {
                this.element.prolabels(this.options.labels[product]);
            }
        }
    });

    $.mixin('recentProducts', {
        /** [afterGetAdditionalContent description] */
        getAdditionalContent: function (o, item, element) {
            if (item.extension_attributes && item.extension_attributes.swissup_prolabel) {
                $(element).prolabels(JSON.parse(item.extension_attributes.swissup_prolabel));
            }

            return o(item, element);
        }
    });
})();
