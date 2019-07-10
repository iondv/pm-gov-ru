'use strict';

window.CommonHelper = {

  getUrlParams: function (url) {
    var data = String(url).split('?')[1];
    if (!data) {
      return {};
    }
    var result = {};
    data = data.split('&');
    for (var i = 0; i < data.length; ++i) {
      var item = data[i].split('=');
      if (item.length === 2) {
        result[item[0]] = decodeURIComponent(item[1]);
      }
    }
    return result;
  },

  escapeQuotes: function (str) {
    return String(str).replace(/\"/g, '&quot;');
  },

  alignByHeight: function (e1, e2) {
    var h1 = e1.height(), h2 = e2.height();
    h1 < h2 ? e1.height(h2) : e2.height(h1);
  }
};

window.ArrayHelper = {

    callMethod: function (methodName, items) {
        for (var i in items) {
            items[i][methodName]();
        }
    }
};

window.NumberHelper = {

  spaceThousands: function (value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
};

window.SelectorHelper = {

  get: function (inner) {
    return $(inner).closest('.selector');
  },

  getTitle: function  (inner) {
    return SelectorHelper.get(inner).find('.selector-title');
  },

  getMenu: function (inner) {
    return SelectorHelper.get(inner).find('.selector-menu');
  },

  getItems: function (inner) {
    return SelectorHelper.getMenu(inner).find('.selector-menu-item');
  },

  getItemById: function (id, inner) {
    return SelectorHelper.getItems(inner).filter('[data-id="'+ id +'"]');
  },

  getActiveItem: function (inner) {
    return SelectorHelper.getItems(inner).filter('.active');
  },

  getActiveItemId: function (inner) {
    return SelectorHelper.getActiveItem(inner).data('id');
  },

  getInnerSearch: function (inner) {
    return SelectorHelper.getSearch(inner).filter('.inner-search');
  },

  getSearch: function (inner) {
    return SelectorHelper.get(inner).find('.search-value');
  },

  getSearchData: function (inner) {
    var result = [];
    SelectorHelper.getItems(inner).each(function () {
      result.push(($(this).data('text') || '').toLowerCase());
    });
    return result;
  },

  setActiveItem: function ($item) {
    SelectorHelper.getActiveItem($item).removeClass('active');
    $item.addClass('active');
    SelectorHelper.setTitleByItem($item);
  },

  setActiveItemById: function (id, inner) {
    var $item = SelectorHelper.getItemById(id, inner);
    if ($item.length === 1) {
      SelectorHelper.setActiveItem($item);
    }
  },

  setTitleByActiveItem: function () {
    SelectorHelper.setTitleByItem(SelectorHelper.getActiveItem($item));
  },

  setTitleByItem: function ($item) {
    var title = $item.data('title') || $item.html();
    SelectorHelper.getTitle($item).attr('title', title).html(title);
  },

  setEmptyTitle: function (inner) {
    var $selector = SelectorHelper.get(inner);
    SelectorHelper.getActiveItem(inner).removeClass('active');
    var title = $selector.data('empty') || '';
    SelectorHelper.getTitle(inner).attr('title', title).html(title);
  },

  toggleEmpty: function (inner) {
    SelectorHelper.get(inner).toggle(SelectorHelper.getItems(inner).length > 0);
  }
};

moment.locale('ru');

window.createLoadableSelector = function (params) {
  var selector = params.$selector.data('loadable-selector');
  return selector || new LoadableSelector(params);
};

window.LoadableSelector = function (params) {
  this.params = $.extend({
    length: 5,
    startListDelay: 500,
    searchDelay: 500
  }, params);
  this.$selector = params.$selector;
  this.$selector.data('loadable-selector', this);

  this.$monitor = $('.monitor-wrapper');
  this.$next = this.$selector.children('.next');
  this.$prev = this.$selector.children('.prev');
  this.$menu = this.$selector.children('.selector-menu');
  this.$menu = this.$selector.children('.selector-menu');
  this.$search = this.$menu.find('.selector-menu-search');
  this.$searchValue = this.$search.find('.search-value');
  this.searchValue = '';
  this.$list = this.$menu.find('.selector-menu-list');
  this.$more = this.$menu.find('.selector-menu-more');

  this.$more.click(this.clickMore.bind(this));
  this.$searchValue.on('keyup', this.changeSearch.bind(this));
  this.$prev.click(this.stepPrev.bind(this));
  this.$next.click(this.stepNext.bind(this));
};

$.extend(LoadableSelector.prototype, {

  init: function () {
    var params = {
      start: 0,
      length: 1
    };
    if (this.params.startObject) {
      params.query = 'guid="'+ this.params.startObject +'"';
    }
    this.toggleMonitorLoader(true);
    this.postAjax(this.params.url, params).done(function (data) {
      this.createMenu(data);
      this.$selector.show();
      this.toggleMonitorLoader(false);
      this.getItems().first().click();
      this.toggleLoader(true);
      setTimeout(function () {
        this.postAjax(this.params.url, {
          start: 0,
          length: this.params.length
        }).done(function (data) {
          this.createMenu(data);
        }.bind(this));
      }.bind(this), this.params.startListDelay);
    }.bind(this));
  },

  createMenu: function (data) {
    this.backOffset = 0;
    this.total = data && data.recordsTotal;
    this.$list.html(this.buildMenuItems(data && data.data));
    this.toggleNotFound();
    this.toggleMore();
  },

  buildMenuItems: function (data) {
    data = data instanceof Array ? data : [];
    var content = '';
    for (var i = 0; i < data.length; ++i) {
      var text = CommonHelper.escapeQuotes(data[i].__string);
      content += '<a href="'+ this.params.itemUrl +'&o='+ data[i]._id
        + '" class="selector-menu-item" data-id="' + data[i]._id
        + '" data-title="' + text + '">' + text + '</a>';
    }
    return content;
  },

  toggleLoader: function (state) {
    this.$selector.toggleClass('loading', state);
  },

  toggleMonitorLoader: function (state) {
    this.$monitor.toggleClass('loading');
  },

  toggleMore: function () {
    this.$selector.toggleClass('has-more', this.getItems().length < this.total);
  },

  toggleNotFound: function () {
    this.$selector.toggleClass('not-found', !this.getItems().length);
  },

  isLoading: function () {
    return this.$selector.hasClass('loading');
  },

  hasMore: function () {
    return this.$selector.hasClass('has-more');
  },

  clickMore: function () {
    if (this.backOffset) {
      this.getItems().slice(-this.backOffset).remove();
      this.backOffset = 0;
    }
    this.loadMore({
      start: this.getItems().length,
      length: this.params.length
    });
  },

  changeSearch: function () {
    var value = $.trim(this.$searchValue.val());
    if (value !== this.searchValue) {
      this.searchValue = value;
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(this.search.bind(this, value), this.params.searchDelay);
    }
  },

  stepPrev: function () {
    if (this.isLoading()) {
      return false;
    }
    var $active = SelectorHelper.getActiveItem(this.$selector);
    var backIndex = this.getItems().length - this.backOffset;
    if (this.backOffset) {
      if (backIndex === $active.index()) {
        return this.loadPrev();
      }
    }
    var $item = $active.prev();
    if ($item.length) {
      return $item.click();
    }
    if (this.hasMore()) {
      return this.loadPrev();
    }
    if (!this.$active.length) {
      return this.getItems().last().click();
    }
  },

  stepNext: function () {
    if (this.isLoading()) {
      return false;
    }
    var $active = SelectorHelper.getActiveItem(this.$selector);
    if (!$active.length) {
      return SelectorHelper.getItems(this.$selector).first().click();
    }
    var $item = $active.next();
    if ($item.length) {
      return $item.click();
    }
    if (this.hasMore() && !this.backOffset) {
      this.toggleMonitorLoader(true);
      this.loadMore({
        start: this.getItems().length,
        length: 1
      }).done(function () {
        this.toggleMonitorLoader(true);
        $active.next().click();
      }.bind(this));
    }
  },

  loadPrev: function () {
    this.toggleMonitorLoader(true);
    this.backOffset += 1;
    this.loadMore({
      start: this.total - this.backOffset,
      length: 1
    }, function (data) {
      this.toggleMonitorLoader(false);
      this.getItems().eq(-this.backOffset).after(this.buildMenuItems(data && data.data));
      this.getItems().eq(-this.backOffset).click();
      this.toggleMore();
      if (!this.hasMore()) {
        this.backOffset = 0;
      }
    }.bind(this));
  },

  loadMore: function (params, handler) {
    this.addSearchParams(params);
    return this.postAjax(this.params.url, params).done(function (data) {
      if (handler) {
        handler(data);
      } else {
        this.$list.append(this.buildMenuItems(data && data.data));
        this.toggleMore();
      }
    }.bind(this));
  },

  search: function () {
    var params = {
      start: 0,
      length: this.params.length
    };
    this.addSearchParams(params);
    this.$list.empty();
    this.postAjax(this.params.url, params).done(function (data) {
      this.createMenu(data);
    }.bind(this));
  },

  addSearchParams: function (params) {
    if (this.searchValue.length) {
      params.query = 'name LIKE "'+ this.searchValue +'"';
    }
  },

  getItems: function () {
    return SelectorHelper.getItems(this.$selector);
  },

  getItemById: function (id) {
    return SelectorHelper.getItemById(id, this.$selector);
  },

  postAjax: function (url, params) {
    this.abortAjax();
    this.toggleLoader(true);
    return this.xhr = $.post(url, params).always(function () {
      this.toggleLoader(false);
    }.bind(this));
  },

  abortAjax: function () {
    if (this.xhr) {
      this.xhr.abort();
      this.xhr = null;
    }
    this.toggleLoader(false);
  }
});