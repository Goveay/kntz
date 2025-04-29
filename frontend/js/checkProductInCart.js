(function () {
    'use strict';

    $.widget('kontaktAddToCart', {
        component: 'kontaktAddToCart',
        _create: function () {
            this._on({'click .removeFromWishlist': this.removeFromWishlist});

            $.fn.checkIsCart = this.isCart;
            $.fn.checkIsWishlist = this.checkWishlist;
            $.fn.checkIsCompare = this.checkCompare;


            if ($('body').hasClass('catalog-product-view') || $('body').hasClass('wishlist-index-index')) {
                this.applyOnOpen();
                this.applyOnOpenCompare();
                this.applyOnOpenWishlist();
            }

            if ($('body').hasClass('cms-home')) {
                this.checkHomeProduct();
            }

            if (window.innerWidth < 560) {
                let productItems = Array.from($('.prodItem'));

                if(productItems.length === 0) {
                    productItems = $('.prodItemS');
                }

                $.sections.get('compare-products').subscribe(function () {
                    if (productItems && productItems.length > 0) {
                        productItems.forEach(item => {
                            this.applyButton(item);
                        });
                    }
                }, this);

                $.sections.get('wishlist').subscribe(function () {
                    if (productItems && productItems.length > 0) {
                        productItems.forEach(item => {
                            this.applyButton(item);
                        });
                    }
                }, this);
            }

            let productList = Array.from($('.prodItem.product-item'));

            if ($('body').hasClass('wishlist-index-index')) {
                productList.forEach(item => {
                    this.isCartOnWishlist(item);
                    this.checkCompare(item);
                });
            } else {
                productList.forEach(item => {
                    this.isCart(item);
                    this.checkWishlist(item);
                    this.checkCompare(item);
                });
            }
        },
        isCart: function (item) {
            let cart = $.sections.get('cart'),
                items = [],
                isProductInCart = false;
            let productItem = $(item);
            let productSku = $(item).data('sku');

            if (cart() && cart()['items']) {
                items = cart()['items'];
                $.each(items, function (index, item) {
                    if (item['product_sku'] === productSku) {
                        isProductInCart = true;
                        return false; // Exit the loop if product is found
                    }
                });
            }
            if (isProductInCart) {
                productItem.find('.in_cart').css('display', 'flex');
                productItem.find('.tocart').css('display', 'none');
            }
        },

        isCartOnWishlist: function (item) {
            setTimeout(() => {
                let cart = $.sections.get('cart'),
                    items = [],
                    isProductInCart = false;
                let productItem = $(item);
                let productSku = $(item).data('sku');

                if (cart() && cart()['items']) {
                    items = cart()['items'];
                    $.each(items, function (index, item) {
                        if (item['product_sku'] === productSku) {
                            isProductInCart = true;
                            return false; // Exit the loop if product is found
                        }
                    });
                }
                if (isProductInCart) {
                    productItem.find('.in_cart').css('display', 'flex');
                    productItem.find('.tocart').css('display', 'none');
                }
            }, 1500)
        },

        applyButton: function (event) {
            let cart = $.sections.get('cart'),
                items = cart()['items'] ?? [],
                isProductInCart = false,
                customer = $.sections.get('customer')(),
                itemClass = event.target ? event.target : event;
            let productItem = $(itemClass).parent('.prodItem');
            let productSku = $(itemClass).parent('.prodItem').data('sku');

            $.each(items, function (index, item) {
                if (item['product_sku'] === productSku) {
                    isProductInCart = true;
                    return false; // Exit the loop if product is found
                }
            });

            if (isProductInCart) {
                productItem.find('.in_cart').css('display', 'flex');
                productItem.find('.tocart').css('display', 'none');
            }

            this.checkCompare(productItem);
            if (customer.fullname && customer.firstname) {
                this.checkWishlist(productItem);
            }
        },

        checkHomeProduct: function () {
            let productSku = $('.prodItem'),
                cart = $.sections.get('cart'),
                items = cart()['items'];
            
            if(items?.length) {
                let filteredProducts = productSku.filter(function() {
                    var sku = $(this).data('sku');
                    return items.some(item => item.product_sku === sku);
                });
                
                if(filteredProducts?.length)
                    $.each(filteredProducts, function (index, item) {
                        $(this).find('.in_cart').css('display', 'flex');
                        $(this).find('.tocart').css('display', 'none');
                });
            }    
        },
    
        applyOnOpen: function () {
            let productSku = $('.calks__wr1').data('sku'),
                cart = $.sections.get('cart'),
                items = cart()['items'] ?? [],
                that = this,
                isProductInCart = false;

            $.each(items, function (index, item) {
                if (item['product_sku'] === productSku) {
                    isProductInCart = true;
                    that.applyGuaranteeOnOpen(items, item);
                    return false; // Exit the loop if product is found
                }
            });

            if (isProductInCart) {
                $('.calks__wr1').find('.in_cart').css('display', 'flex');
                $('.calks__wr1').find('.tocart').css('display', 'none');
                $('.product-scroll-bar').find('.in_cart').css('display', 'flex');
                $('.product-scroll-bar').find('.in_cart').addClass('disabled');
                $('.product-scroll-bar').find('.tocart').css('display', 'none');
            }
        },

        applyGuaranteeOnOpen: function (items, loadedProduct) {
            $.each(items, function (index, subItem) {
                if (subItem["parent_product_item_id"]
                    && subItem["parent_product_item_id"] === loadedProduct['item_id']) {
                    $("input[name='guaranteeItem']").val(subItem['guarantee_code']);
                    $(".selected-guarantee").show();
                    $(".open-guaranties").hide();
                    $("input[value='" + subItem['guarantee_code'] +"']").prop("checked", true);
                    return false;
                }
            });
        },

        applyOnOpenCompare: function () {
            let productSku = $('.calks__wr1').data('sku'),
                compare = $.sections.get('compare-products'),
                items = compare()['items'] ?? [],
                isProductInCompare = false;

            $.each(items, function (index, item) {
                if (item['sku'] === productSku) {
                    isProductInCompare = true;
                    return false; // Exit the loop if product is found
                }
            });

            if (isProductInCompare) {
                $('.productCont__top .clickableIcons .clickableIcons__wr').find('.removeFromCompare').css('display', 'flex');
                $('.productCont__top .clickableIcons .clickableIcons__wr').find('.addToCompare').css('display', 'none');
                $('.product-scroll-bar .product-compare').addClass('active');
            }
        },

        applyOnOpenWishlist: function (event) {
            let productSku = $('.calks__wr1').data('sku'),
                wishlist = $.sections.get('wishlist'),
                items = wishlist()['items'] ?? [],
                isProductInWishlist = false,
                customer = $.sections.get('customer')();

            if (customer.fullname && customer.firstname) {
                $.each(items, function (index, item) {
                    if (item['product_sku'] === productSku) {
                        isProductInWishlist = true;
                        return false; // Exit the loop if product is found
                    }
                });
            }

            if (isProductInWishlist) {
                $('.productCont__top .clickableIcons .clickableIcons__wr').find('.removeFromWishlist').css('display', 'flex');
                $('.productCont__top .clickableIcons .clickableIcons__wr').find('.addToWishlist').css('display', 'none');
                $('.product-scroll-bar .product-wishlist').addClass('active');
            }
        },

        checkCompare: function (itemClass) {
            let compare = $.sections.get('compare-products'),
                items = compare()['items'] ?? [],
                isProductInCompare = false,
                productSku = $(itemClass).data('sku');

            $.each(items, function (index, item) {
                if (item['sku'] === productSku) {
                    isProductInCompare = true;
                    return false; // Exit the loop if product is found
                }
            });

            if (isProductInCompare) {
                $(itemClass).find('.removeFromCompare').css('display', 'flex');
                $(itemClass).find('.addToCompare').css('display', 'none');
            }
        },

        checkWishlist: function (itemClass) {
            let productSku = $(itemClass).data('sku'),
                wishlist = $.sections.get('wishlist'),
                items = wishlist()['items'] ?? [],
                isProductInWishlist = false;

            $.each(items, function (index, item) {
                if (item['product_sku'] === productSku) {
                    isProductInWishlist = true;
                    return false; // Exit the loop if product is found
                }
            });

            if (isProductInWishlist) {
                $(itemClass).find('.removeFromWishlist').css('display', 'flex');
                $(itemClass).find('.addToWishlist').css('display', 'none');
            }
        },

        removeFromWishlist: function (event) {
            const productId = $(event.target).parent('a').data('product-id');
            const url = window.BASE_URL + 'kontaktcatalog/wishlist/remove';

            let data = {
                'product-id': productId
            };

            let promise = $.post(url, {
                data: data,
                showLoader: true,
                complete: function(response) {
                    if ($(event.target).parent().parent().hasClass('clickableIcons__wr')) {
                        $(event.target).parent().parent().find('.removeFromWishlist').css('display', 'none');
                        $(event.target).parent().parent().find('.addToWishlist').css('display', 'flex');
                    } else {
                        $(event.target).parent().parent('.prodItem__icons').find('.removeFromWishlist').css('display', 'none');
                        $(event.target).parent().parent('.prodItem__icons').find('.addToWishlist').css('display', 'flex');
                    }
                },
                error: function (response) {
                    alert('Error. Please try again');
                },
            });
        }
    });
})();
