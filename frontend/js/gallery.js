/* global _ */
(function () {
    'use strict';

    $.widget('gallery', {
        component: 'mage/gallery/gallery',
        options: {
            video: {
                template: '<div id="youtube-popup-modal"><div class="video-wrapper"><iframe src="<%- src %>"' +
                    ' width="<%- width %>" height="<%- height %>" frameborder="0" allowfullscreen' +
                    ' allow="accelerometer; autoplay; clipboard-write;' +
                    ' encrypted-media; gyroscope; picture-in-picture"></iframe></div></div>',
                providers: {
                    youtube: {
                        name: 'youtube',
                        regexs: [
                            /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
                            /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
                            /youtube.com\/shorts\/([a-zA-Z0-9_-]+)/,
                            /youtube-nocookie.com\/embed\/([a-zA-Z0-9_-]+)/,
                            /youtu\.be\/([a-zA-Z0-9_-]+)/
                        ],
                        params: {
                            width: 800,
                            height: 500,
                            src: 'https://www.youtube.com/embed/$id'
                        }
                    },
                    vimeo: {
                        name: 'vimeo',
                        regexs: [
                            /vimeo\.com\/(\d+)/
                        ],
                        params: {
                            width: 800,
                            height: 500,
                            src: 'https://player.vimeo.com/video/$id'
                        }
                    }
                }
            }
        },

        /** [create description] */
        create: function () {
            this.options = _.extend(this.options, this.options.options || {});
            this.promises = {};
            this.cache = $('<div data-breeze-temporary>').hide().appendTo(document.body);
            this.gallery = this.element.parent();
            this.parent = this.gallery.parent();
            this.thumbsWrapper = this.gallery.find('.thumbnails');
            this.thumbsWrapper2 = this.gallery.find('.slider111__col');
            this.thumbs = this.gallery.find('.thumbnails a');
            this.stage = this.gallery.find('.stage');
            this.image = this.stage.find('.stage img');
            this.source = this.stage.find('.stage source');
            this.activeIndex = this.gallery.find('.thumbnails a.active').index();
            this.focusTrap = this.createFocusTrap(this.gallery);

            if (this.activeIndex === -1) {
                this.activeIndex = 0;
            }

            this.activate(this.activeIndex);
            this.addEventListeners();

            this._trigger('loaded');
        },

        /** [addEventListeners description] */
        addEventListeners: function () {
            let self = this;

            this.image
                .on('load error', function () {
                    self.stage.spinner(false);
                })
                .on('load', function () {
                    if (!self.cache.find(`[src="${self.image.attr('src')}"]`).length) {
                        self.cache.append(self.image.clone().removeAttr('alt id class fetchpriority'));
                    }
                })
                .on('click', function (event) {
                    event.preventDefault();

                    if(self.gallery.hasClass("opened")){
                        return false;
                    }
                })
                .on('doubleClick', function (event) {
                    event.preventDefault();
                    return false;
                });

            this.stage
                .on('swiped-left swiped-right', function (event) {
                    self[event.type === 'swiped-right' ? 'prev' : 'next']();
                })
                .on('click', '.next, .prev', function (event) {
                    event.preventDefault();
                    self[$(this).hasClass('prev') ? 'prev' : 'next']();
                })
                .on('click', '.main-image-wrapper', function () {
                    if (self.options.data[self.activeIndex].videoUrl) {
                        self.play();
                    } else {
                        self.open();
                    }
                })
                .on('click', '.optionsSlide__item--video .video-btn', function (event) {
                    event.preventDefault();
                    let index = $(event.target).attr("data-index");
                    if (index !== self.activeIndex) {
                        self.activate(index);
                    }
                    self.play();
                });

            $(document).on('click', '.youtube-video-popup .action-close', function (e) {
                $(this).parents('.youtube-video-popup').find('iframe').attr('src', '')
            });

            this.thumbsWrapper.on('click', 'a', function (event) {
                var index = $(this).index();

                event.preventDefault();

                if (index !== self.activeIndex) {
                    self.activate($(this).index());
                } else {
                    self.open();
                }
            });
            this.thumbsWrapper2.on('click', '.slider111__prev, .slider111__next', function (event) {
                event.preventDefault();
                self[$(this).hasClass('slider111__prev') ? 'prev' : 'next']();
            });

            this.gallery
                .on('click', function () {
                    if (self.gallery.is(':focus-within')) {
                        return;
                    }

                    this.focus({
                        preventScroll: true
                    });
                })
                .find('.close').on('click', function (event) {
                    event.preventDefault();
                    self.close();
                });

            $(document).on('keydown.gallery', function (event) {
                if (self.options.keyboard === false) {
                    return;
                }

                if (!self.opened() &&
                    !self.gallery.is(':focus-within')
                ) {
                    return;
                }

                switch (event.key) {
                    case 'Escape':
                        self.close();
                        break;

                    case 'ArrowLeft':
                        event.preventDefault();
                        self.prev();
                        break;

                    case 'ArrowRight':
                        event.preventDefault();
                        self.next();
                        break;
                }
            });
        },

        destroy: function () {
            $(document).off('keydown.gallery');
            this.close();
            this._super();
        },

        /** Activate prev image */
        prev: function () {
            var index = this.activeIndex - 1;

            if (index < 0 || !this.thumbs.eq(index).length) {
                index = this.options.loop !== false ? this.thumbs.length - 1 : 0;
            }

            this.activate(index);
        },

        /** Activate next image */
        next: function () {
            var index = this.activeIndex + 1;

            if (!this.thumbs.eq(index).length) {
                index = this.options.loop !== false ? 0 : this.activeIndex;
            }

            this.activate(index);
        },

        /** Activate image by its index */
        activate: function (index) {
            var data,
                fullscreen = this.opened();

            index = this.options.data[index] ? index : 0;
            data = this.options.data[index];

            if (!data) {
                return;
            }

            this._trigger('beforeActivate');

            this.thumbs.eq(this.activeIndex).removeClass('active');
            this.thumbs.eq(index).addClass('active');
            this.image.siblings('source').remove();

            if (data.srcset) {
                this.image.attr('srcset', data.srcset.medium);

                if (!this.image.attr('sizes')) {
                    this.image.attr('sizes', this.image.attr('data-sizes'));
                    this.image.removeAttr('data-sizes');
                }
            }

            if (fullscreen || !data.srcset) {
                this.image.attr('data-sizes', this.image.attr('sizes'));
                this.image.removeAttr('sizes');
                this.image.removeAttr('srcset');
            }

            this.image.attr('src', fullscreen ? data.full : data.img);
            this.stage.toggleClass('video', data.videoUrl);

            if (this.image.get(0) && !this.image.get(0).complete) {
                this.stage.spinner(true, {
                    delay: 200
                });
            }

            // scroll to hidden thumbnail only if we will not affect page scroll offset
            if (fullscreen || (this.thumbs.length && this.thumbsWrapper.isInViewport())) {
                // timeout is used to fix scroll when swipe is used
                setTimeout(function () {
                    this.thumbs.eq(index).focus();
                }.bind(this), 50);
            } else {
                this.thumbs.eq(this.activeIndex).blur();
            }

            if (this.activeIndex !== index) {
                this.stage.find('.video-wrapper').remove();
            }

            this.activeIndex = index;

            this._trigger('afterActivate');
        },

        /** Open fullscreen gallery */
        open: function () {
            if (this.opened() || this.options.allowfullscreen === false) {
                return;
            }

            this._trigger('beforeOpen');

            this.image.removeAttr('width').removeAttr('height');

            this.parent.css({
                width: this.parent.width(),
                height: this.parent.height()
            });
            $('body').addClass('_has-modal');
            this.gallery.addClass('opened');
            this.activate(this.activeIndex);
            this.focusTrap.activate();
            $.breeze.scrollbar.hide();

            this._trigger('afterOpen');
        },

        /** Checks if gallery is opened */
        opened: function () {
            return this.gallery.hasClass('opened');
        },

        /** Close fullscreen gallery */
        close: function () {
            this._trigger('beforeClose');

            this.image
                .removeAttr('src')
                .attr('width', this.options.width)
                .attr('height', this.options.height);

            this.gallery.removeClass('opened');
            this.activate(this.activeIndex);
            $('body').removeClass('_has-modal');
            this.focusTrap.deactivate();
            $.breeze.scrollbar.reset();
            this.parent.css({
                width: '',
                height: ''
            });

            this._trigger('afterClose');
        },

        /** Plays active video */
        play: function () {
            this.stage.prepend(
                this.renderVideo(this.options.data[this.activeIndex].videoUrl)
            );

            this.setVideoToModalPopup();
        },

        setVideoToModalPopup: function () {
            let options = {
                type: 'popup',
                responsive: true,
                innerScroll: true,
                title: '',
                modalClass: 'youtube-video-popup modal-xl',
                buttons: []
            };

            $('#youtube-popup-modal').modal(options).trigger('openModal');
        },

        /** Render video iframe */
        renderVideo: function (url) {
            var params = {};

            _.find(this.options.video.providers, function (item) {
                var id = this.matchVideoId(url, item);

                if (id) {
                    params = _.extend({}, item.params);
                    params.src = params.src.replace('$id', id);

                    return true;
                }
            }.bind(this));

            if (!$('#youtube-popup-modal')[0]) {
                return _.template(params.template || this.options.video.template)(params);
            } else {
                $('#youtube-popup-modal').find('iframe')[0].src = params.src;
            }
        },

        matchVideoId: function (url, provider) {
            var id = false;

            if (typeof provider === 'string') {
                provider = this.options.video.providers[provider];
            }

            if (!provider) {
                return id;
            }

            _.find(provider.regexs, function (regex) {
                var match = regex.exec(url);

                if (match) {
                    id = match[1];

                    return true;
                }
            });

            return id;
        },

        /** [updateData description] */
        updateData: function (data) {
            var thumbnails = [],
                activeIndex = this.activeIndex,
                index = 0,
                currentThumb = this.options.data[activeIndex].thumb,
                template = $('#gallery-thumbnail').html();

            this.options.data = data;

            _.each(data, function (picture, i) {
                // keep currently selected image if it's not the first (default) one
                if (activeIndex > 0 && picture.thumb === currentThumb) {
                    index = i;
                }

                if (!template) {
                    return;
                }

                thumbnails.push(_.template(template)($.extend({}, {
                    srcset: '',
                    classes: [
                        'item',
                        picture.videoUrl ? 'video' : ''
                    ].join(' ')
                }, picture)));
            });

            this.thumbsWrapper.html(thumbnails.join(''));

            this.thumbs = this.thumbsWrapper.find('a');

            this.activate(index);
        },

        /**
         * Returns current images list
         *
         * @returns {Array}
         */
        returnCurrentImages: function () {
            var images = [];

            _.each(this.options.data, function (item) {
                images.push(item);
            });

            return images;
        },

        getData: function () {
            return this.options.data[this.activeIndex];
        },

        loadFullImage: function () {
            var src = this.getData().full;

            if (this.promises[src]) {
                return this.promises[src];
            }

            this.promises[src] = new Promise((resolve, reject) => {
                var image = new Image();

                image.onerror = reject;
                image.onload = () => {
                    resolve({
                        src: image.src,
                        width: image.width,
                        height: image.height
                    });
                }

                image.src = this.getData().full;

                this.cache.append(image);
            });

            return this.promises[src];
        }
    });
})();
