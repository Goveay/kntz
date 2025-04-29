require([
    'jquery',
    'masonry'
], function ($, masonry) {
    $(document).ready(function() {
        const fw = document.querySelector('.fw');
        const fz = document.querySelector('.fz');
        const ff = document.querySelectorAll('.ff');

        const bottomMenu = document.querySelector('.topMenu');
        const contentTop = document.querySelector('.cont__top');
        const search = document.querySelector('.search');
        const searchInput = document.querySelector('.search input');
        const header = document.querySelector('.header');

        if ($(window).width() > 1024) {
            const cMlink = document.getElementsByClassName('catalogMenu__li-link');
            const cMlinkqs = document.querySelector('.catalogMenu__li-link');
            const topMenuContent = document.querySelector('.topMenuContent');
            const childMenus = document.querySelector('.childrenMenus');

            $.async && $.async({ selector: '.topMenu' }, function (el) {
                el.addEventListener('click', () => {
                    bottomMenu.classList.toggle('add');
                    topMenuContent.classList.add('view');
                    fz.classList.add('container__elem--df');
                    fz.classList.add('container__elem--15');
                    fz.classList.remove('container__elem--3');
                    cMlinkqs.classList.add('active');

                    $('.topMenuContent').find('.catalogMenu__li-link:first-child').addClass('active');
                    buildMainMenu($('.topMenuContent .catalogMenu__li-link:first-child'));

                    ff.forEach(function (item) {
                        item.classList.toggle('hide');
                    });

                    if (topMenuContent && contentTop) {
                        setTimeout(() => {
                            if (topMenuContent.classList.contains("view")) {
                                contentTop.style.display = 'none';
                            } else {
                                contentTop.style.display = 'flex';
                            }
                        }, 100);
                    }
                });
            })

            $('.catalogMenu__li-link').on('mouseenter', function (e) {
                e.preventDefault();
                buildMainMenu($(this));
            });

            $('.catalogMenu__li-link').on('mouseleave', function (e) {
                let elem = $(this).find('.contentMenu');
                elem.removeClass('masonry');
            });

            // CATALOG MENU
            //#2
            if (fz !== null) {
                fz.addEventListener('mouseenter', () => {
                    if(!topMenuContent.classList.contains("view")) {
                        fz.classList.add('container__elem--df');
                        fz.classList.add('container__elem--15');
                        fz.classList.remove('container__elem--3');   
                    }
                    cMlinkqs.classList.add('active');
                    ff.forEach(function (item) {
                        item.classList.add('hide');
                    });
                });
                fz.addEventListener('mouseleave', (e) => {
                    if(e?.relatedTarget?.className != "container") {
                        fz.classList.remove('container__elem--df');
                        fz.classList.remove('container__elem--15');
                        fz.classList.add('container__elem--3');
                        bottomMenu.classList.toggle('add');
                        checkCursorPosition(e); 
                        for (var i = 0; i < cMlink.length; ++i) {
                            cMlink[i].classList.remove('active');
                        }
                        ff.forEach(function (item) {
                            item.classList.remove('hide');
                        });
    
                        if (topMenuContent && contentTop) {
                            if (topMenuContent.classList.contains("view")) {
                                contentTop.style.display = 'none';
                            } else {
                                contentTop.style.display = 'flex';
                            }
                        }
                    }
                });
            }
            //#2
            if (fw !== null) {
                fw.addEventListener('mouseenter', () => {
                    fw.classList.add('container__elem--df');
                    fw.classList.add('container__elem--15');
                    fw.classList.remove('container__elem--3');
                    if(childMenus) {
                        childMenus.style.display = 'flex';
                    }

                    // cMlinkfw.classList.add('active');
                    ff.forEach(function (item) {
                        item.classList.add('hide');
                    });
                });
                fw.addEventListener('mouseleave', () => {                
                    fw.classList.remove('container__elem--15');
                    fw.classList.add('container__elem--3');
                    if(childMenus) {
                        childMenus.style.display = 'none';
                    }

                    for (var i = 0; i < cMlink.length; ++i) {
                        cMlink[i].classList.remove('active');
                    }
                    ff.forEach(function (item) {
                        item.classList.remove('hide');
                    });
                });
            }

            for (var i = 0; i < cMlink.length; i++) {
                cMlink[i].addEventListener('mouseleave', mouseleave, false);
                cMlink[i].addEventListener('mouseenter', mouseenter, false);
            }

            // Добавил: при наведении на меню добавляется класс active
            function mouseenter() {
                if (fw !== null) {
                    fw.setAttribute('data-ho', '1');
                }
                if (fw !== null) {
                    fz.setAttribute('data-ho', '1');
                }
                for (var i = 0; i < cMlink.length; ++i) {
                    cMlink[i].classList.remove('active');
                }
                this.classList.add('active');
            }

            function mouseleave() {
                if (fw !== null) {
                    fw.removeAttribute('data-ho', '1');
                }
                if (fz !== null) {
                    fz.removeAttribute('data-ho', '1');
                }
            }
        }
        $(document).on('click', '.topMenu', function () {
            updateTopMenuView();
        });

        $(document).on('breeze:resize', function (event, data) {
            updateTopMenuView();
    
            if ($(window).width() < 1024) {
                $('.cont__bottomM .cont__bottomMBOT').before($('.container.h-auto'));
            }
        });

        searchInput.addEventListener('focus', () => {
            search.classList.add('focus');
        });
        searchInput.addEventListener('blur', () => {
            search.classList.remove('focus');
        });

        if (header !== null || !$('body').hasClass('lock-scroll')) {
            window.addEventListener('scroll', function () {
                let scrollTop2 = window.pageYOffset;
                if (scrollTop2 > 0) {
                    document.querySelector('body').classList.add('scroll');
                    $(document).trigger('status.page.scroll', [false]);
                } else {
                    document.querySelector('body').classList.remove('scroll');
                    $(document).trigger('status.page.scroll', [true]);
                }
            });

            let maincontent = document.getElementById('maincontent');
            if (maincontent !== null && maincontent.getBoundingClientRect().top !== 0) {
                header.classList.add('scroll');
            }
        }

        $('body').on('scroll', ".catalogMenu__li-link.active .contentMenu", function(e) {
            let scrollPercentage = ($(this).scrollTop / ($(this).scrollHeight - $(this).clientHeight)) * 100,
                menuBannerElement = $(this).parent().find('.menu-banner-images');

            menuBannerElement.style.top = scrollPercentage + '%';
        });

        $('.catalogMenu__li-link').each(function (index) {
            $(this).find('.contentMenu').attr('id', index);
        });

        function checkCursorPosition(e) {
                const topMenu = document.querySelector('.topMenuContent.view');  // Select the block

                if(topMenu) {
                    const rect = topMenu.getBoundingClientRect();  // Get the block's position and dimensions
                
                    // Check if the cursor is within the block's boundaries
                    const isInBlock = (
                        e.clientX >= rect.left && 
                        e.clientX <= rect.right && 
                        e.clientY >= rect.top && 
                        e.clientY <= rect.bottom
                    );
                    
                    if (!isInBlock) {
                        document.querySelector('.topMenuContent').classList.remove('view');
                    }
                }
        }

        function updateTopMenuView() {
            let catalogMenuTop = $(".topMenuContent .catalogMenu");
    
            if (catalogMenuTop.length) {
                let leftMarginMenuLinkTop = catalogMenuTop.innerWidth();
                catalogMenuTop.find(".childrenMenus__link").css("left", `${leftMarginMenuLinkTop + 2}px`);
            }
        }

        function buildMainMenu (item) {
            let elem = item.find('.contentMenu'),
                self = item;

            if (!elem.hasClass('masonry')) {
                elem.addClass('hidden');
                setTimeout(() => {
                    $.async('.menu .catalogMenu__li-link.active', function (node) {
                        if(masonry){
                            new masonry(elem[0], {
                                itemSelector: '.contentMenu__item',
                                columnWidth: 180,
                                gutter: 25,
                                percentPosition: true,
                                transitionDuration: 0
                            });
                        }else{
                            new Masonry(elem[0], {
                                itemSelector: '.contentMenu__item',
                                columnWidth: 180,
                                gutter: 25,
                                percentPosition: true,
                                transitionDuration: 0
                            });
                        }
                        if (item.hasClass('active')) {
                            elem.addClass('masonry');
                            elem.removeClass('hidden');
                        }
                    });
                }, 100);
            }
        }
    });

    function watchElementsAddition(selector, onElementAdded) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach((element) => {
                        if (!element._isObserved) {
                            element._isObserved = true;
                            onElementAdded(element);
                        }
                    });
                }
            }
        });
    
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    function watchClassChange(element, className, onClassAdded, onClassRemoved) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (element.classList.contains(className)) {
                        onClassAdded();
                    } else {
                        onClassRemoved();
                    }
                }
            }
        });
    
        observer.observe(element, {
            attributes: true,
            attributeFilter: ['class']
        });
    
        return () => observer.disconnect();
    }

    watchElementsAddition('.regAutoriz__content input', (element) => {
        watchClassChange(
            element,
            'mage-error',
            () => {
                $(element).closest(".field").addClass("_error");
            },
            () => {
                $(element).closest(".field").removeClass("_error");
            }
        );
    });

    watchElementsAddition('.form-edit-account input', (element) => {
        watchClassChange(
            element,
            'mage-error',
            () => {
                $(element).closest(".field").addClass("_error");
            },
            () => {
                $(element).closest(".field").removeClass("_error");
            }
        );
    });

});
