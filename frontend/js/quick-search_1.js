define([
    'jquery',
    'underscore',
    'Magento_Catalog/js/price-utils',
    'mage/translate'
], function ($, _, priceUtil, $t) {
    'use strict';

    $.widget('smileEs.quickSearch', 'quickSearch', {
        options: {
            minSearchLength: 2,
            dropdown: '<div></div>',
            dropdownClass: 'smile-elasticsuite-autocomplete-result',
            responseFieldElements: 'dd',
            categoriesTranslate: {
                ru: "Категории",
                az: "Kateqoriyalar"
            }
        },

        _create: function () {
            this.templateCache = {};

            this._super();

            this.toggleSearchIcon();

            this.autoComplete.on('keydown.smileEs', this.options.responseFieldElements, (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    event.stopPropagation();
                    this.submitSelectedItem();
                }
            });

            $('body').trigger('quick-serach-init')
        },

        submitSelectedItem: function () {
            var item = this.dataset[this.responseList.selectedIndex];

            if (!item) {
                return;
            }

            if (item.url) {
                window.location.href = item.url;
            } else {
                this.searchForm.submit();
            }
        },

        sendRequest: function () {
            var result = this._super(),
                spinnerTarget = this.searchForm.find('.actions');

            if (!result || !result.finally) {
                return result;
            }

            spinnerTarget.spinner(true, {
                delay: 200
            });

            return result.finally(function () {
                spinnerTarget.spinner(false);
            });
        },

        renderItem: function (item) {
            if (item.price && (!isNaN(item.price))) {
                item.price = priceUtil.formatPrice(item.price, this.options.priceFormat);
            }

            if (!item.row_class) {
                item.row_class = '';
            }
            item.row_class += 'item-type-' + item.type;

            return this.renderItemTitle(item) + this._super(item);
        },

        renderItemTitle: function (item) {
            // render title before the first item only
            if (this.renderedTitles[item.type]) {
                return '';
            }

            this.renderedTitles[item.type] = true;

            var title = '',
                template = this.getItemTemplate(item, 'titleRenderer');

            if (template) {
                title = template(item);
            } else if (this.options.templates[item.type].title) {
                title = this.options.templates[item.type].title;
            }

            if (title.length) {
                if (title == "Categories") {
                 title = this.checkTitle(title);
                }

                title = '<dt role="listbox" class="autocomplete-list-title title-' + item.type + '">' + $t(title) + '</dt>';
            }

            return title;
        },

        checkTitle: function (title) {
            if($("html").attr("lang") == "ru") {
                title = this.options.categoriesTranslate.ru;
            }else{
                title = this.options.categoriesTranslate.az;
            }

            return title;
        },

        getItemTemplate: function (item, template = 'template') {
            var key = item.type + template,
                id = this.options.templates[item.type][template];

            if (!this.templateCache[key] && id) {
                this.templateCache[key] = _.template($(document.getElementById(id + '.html')).html());
            }

            return this.templateCache[key];
        },

        processResponse: function () {
            this.renderedTitles = {};
            this._super();
            this.addWrappers();
        },

        addWrappers: function () {
            var prev = false,
                collection = $();
                self = this;

            var currentSearchText = this.element.val();

            $(`.${this.options.dropdownClass} > dd`).each((i, el) => {
                var match = el.className.match(/item-type-(?<type>\w+)/),
                    current = match.groups.type;

                if (prev && prev !== current) {
                    collection.wrapAll('<dl role="listbox" class="autocomplete-list"></dl>')
                    collection = $();
                }

                collection = collection.add($(el).prev('dt'));
                collection = collection.add(el);
                prev = current;
            });

            if (collection.length) {
                collection.wrapAll('<dl role="listbox" class="autocomplete-list"></dl>')
            }

            self.highlightText(collection.children(), currentSearchText)
        },

        highlightText: function  (elements, txt) {
            $.each(elements, function () {
                var node = $(this);
                var src_str = node.text();
                txt = txt.replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
                var pattern = new RegExp("(" + txt + ")", "gi");
                if (txt != "") {
                    src_str = src_str.replace(pattern, "<mark>$1</mark>");
                    src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</mark>$2<mark>$4");
                    node.html(src_str);
                } else {
                    src_str = src_str.replace("<mark>$1</mark>", pattern);
                    node.html(src_str);
                }
            });
        },

        toggleSearchIcon: function () {
            const searchIcon = $('.searchMob__ico').closest('.searchMobs');
            const searchInput = $('.searchMob__input');
            const iconClose = 'icon-search-close'

            const clearSearchList = () => $('.smile-elasticsuite-autocomplete-result').children().remove()

            $.async({ selector: '.searchMob__input' }, function (el) {
                $(el).on('click', function() {
                    if (!$(this).val()) {
                        clearSearchList()
                    } else {
                        searchIcon.toggleClass(iconClose, true);
                    }
                })

                $(el).on('input', function() {
                    searchIcon.toggleClass(iconClose, !!$(this).val());
                })
            })

            $(document).on('click', '.icon-search-clear', function (e) {
                searchIcon.removeClass(iconClose);
                clearSearchList()
                searchInput.val('');
                e.stopPropagation();
            })
        },
    });
});
