'use strict';

(function () {
  var $pageAlert = $('#page-alert');
  var $monitor = $('.monitor-wrapper');
  var $head = $monitor.find('.monitor-head');
  var $headPaneTools = $('.head-pane-tools');
  var $body = $monitor.find('.monitor-body');
  var $selectorContainer = $head.find('.selector-container').show();
  var $selectors = $selectorContainer.find('.selector').hide();
  var $logoSelector = $selectors.filter('.logo-selector').show();
  var $viewSelectors = $selectors.filter('.view-selector'), $viewSelector;
  var $objectSelector = $selectors.filter('.object-selector');
  var $places = $body.children('.place'), activePlace, $activePlace;
  var startParams = CommonHelper.getUrlParams(location);
  var places = {
    sakh: {
      objectMenuUrl: 'registry/api/eventObject@pm-gov-ru',
      objectUrl: 'registry/api/eventObject@pm-gov-ru/',
      objectData: {},
      reportObjUrl: 'report/pm-gov-ru@eventsBase/cardObject/cardObject/data',
      reportFinUrl: 'report/pm-gov-ru@eventsBase/cardFin/cardFin/data',
      reportWorkUrl: 'report/pm-gov-ru@eventsBase/cardWork/cardWork/data'
    }
  };

  $(document.body).click(function (event) {
    var $target = $(event.target);
    var $title = $target.closest('.selector-title').closest('.selector');
    var $search = $target.closest('.selector-menu-search').closest('.selector');
    var $more = $target.closest('.selector-menu-more').closest('.selector');
    $('.selector').not($title).not($search).not($more).find('.selector-menu').hide();
  });

  $(document.body).on('click', '.selector-title', function () {
    SelectorHelper.getInnerSearch(this).val('').change();
    SelectorHelper.getMenu(this).show();
  });

  $(document.body).on('click', '.inner-search .selector-step', function () {
    var $step = $(this);
    var $items = SelectorHelper.getItems(this);
    if ($items.length > 1) {
      var index = $items.filter('.active').index();
      if ($step.hasClass('prev')) {
        index = index <= 0 ? $items.length - 1 : (index - 1);
      } else {
        index = index + 1 < $items.length ? (index + 1) : 0;
      }
      $items.eq(index).click();
    }
  });

  $(document.body).on('click', '.selector-menu-item', function (event) {
    var $item = $(this);
    if (event.ctrlKey) {
      event.stopImmediatePropagation();
    } else if ($item.data('id') !== undefined) {
      event.preventDefault();
      SelectorHelper.setActiveItem($item);
    } else {
      $monitor.addClass('loading');
    }
  });

  $(document.body).on('keyup change', '.selector.inner-search .search-value', function () {
    var $value = $(this);
    var $selector = SelectorHelper.get(this);
    var data = $selector.data('search');
    if (!data) {
      data = SelectorHelper.getSearchData($selector);
      $selector.data('search', data);
    }
    var found = false, value = $.trim($value.val()).toLowerCase();
    SelectorHelper.getItems($selector).each(function (index) {
      var visible = value.length ? data[index] && data[index].indexOf(value) !== -1 : true;
      if (visible) {
        found = true;
      }
      $(this).toggle(visible);
    });
    $value.parent().find('.alert').toggle(!found);
  });

  $(document.body).on('click', '.logo-selector .selector-menu-item', function () {
    var $item = $(this);
    activePlace = $item.data('id');
    $monitor.removeClass('sakh kms').addClass(activePlace);
    $activePlace = $places.hide().filter('[data-id="'+ activePlace +'"]').show();
    $activePlace.children().hide().filter('.view-menu').show();
    $viewSelector = $viewSelectors.hide().filter('[data-place="'+ activePlace +'"]');
    $objectSelector.hide();
    SelectorHelper.setEmptyTitle($viewSelector);
    SelectorHelper.toggleEmpty($viewSelector);
    pushHistory(activePlace);
   // $viewSelector.find('.selector-menu-item').eq(0).click();
  });

  $body.on('click', '.view-menu .view-item-body', function () {
    var $item = $(this).parent();
    $viewSelector.show().find('[data-id="'+ $item.data('id') +'"]').click();
  });

  $(document.body).on('click', '.view-selector .selector-menu-item', function () {
    $activePlace.children().hide();
    $objectSelector.hide();
    SelectorHelper.setEmptyTitle($objectSelector);
    var id = SelectorHelper.getActiveItemId($viewSelector);
    pushHistory(activePlace, id);
    $headPaneTools.empty();
    switch (id) {
      case 'info': return showInfoPane();
      case 'graph': return showGraphPane();
      case 'progress': return showProgressPane();
      case 'progressSvod': return showProgressSvodPane();
      case 'indicators': return showIndicatorsPane();
      case 'currentIndicators': return showCurrentIndicatorsPane();

    }
  });

  $(document.body).on('click', '.object-selector .selector-menu-item', function () {
    var id = SelectorHelper.getActiveItemId($objectSelector);
    pushHistory(activePlace, SelectorHelper.getActiveItemId($viewSelector), id);
    loadObjectData(id, function (data) {
      $activePlace.children('.info-pane').show();
      createObjectCard(data, $activePlace.find('.obj-card'));
    });
  });

  $(window).resize(function () {
    var $selectors = $head.find('.selector:visible');
    var totalWidth = 0;
    $selectors.each(function () {
      $(this).find('.selector-title').css('max-width', 'none');
      totalWidth += $(this).width();
    });
    var width = $head.width();
    if (width < totalWidth && $selectors.length > 1) {
      var $logo = $selectors.filter('.logo-selector');
      width -= $logo.width();
      $selectors = $selectors.not($logo);
      var average = parseInt(width / $selectors.length) + 1;
      $selectors.each(function () {
        var $selector = $(this);
        var $title = $selector.find('.selector-title');
        $title.css('max-width', (average - $selector.width() + $title.width()) + 'px');
      });
    }
  });

  start();

  function start () {
    $monitor.removeClass('loading');
    var $place = $logoSelector.find('[data-id="'+ startParams.p +'"]');
    if (!$place.length) {
      $place = $logoSelector.find('[data-id="sakh"]');
    }
    $place.click();
    $viewSelector.find('[data-id="'+ startParams.v +'"]').click();
  }

  function pushHistory () {
    var data = getHistoryParams.apply(this, arguments);
    history.pushState({}, data.p, location.pathname +'?'+ $.param(data));
  }

  function getHistoryParams (place, view, object, extra) {
    var data = {p: place};
    if (view) {
      data.v = view;
    }
    if (object) {
      data.o = object;
    }
    return $.extend(data, extra);
  }

  function showInfoPane () {
    var place = places[activePlace];
    createLoadableSelector({
      $selector: $objectSelector,
      postAjax: postAjax,
      url: place.objectMenuUrl,
      itemUrl: SelectorHelper.getActiveItem($viewSelector).attr('href'),
      startObject: startParams.o,
      length: 5
    }).init();
    startParams.o = null;
  }

  function loadObjectMenu (params, cb) {
    var place = places[activePlace];
    if (place.objectMenuData) {
      return cb(place.objectMenuData);
    }
    postAjax(place.objectMenuUrl, params).done(function (data) {
      cb(place.objectMenuData = data && data.data || []);
    });
  }

  function getActivePlaceParam (id) {
    return id ? places[activePlace][id] : places[activePlace];
  }

  function createObjectMenu (data) {
    var url = SelectorHelper.getActiveItem($viewSelector).attr('href');
    var content = '';
    data = data instanceof Array ? data : [];

    for (let i = 0; i < data.length; ++i) {
      var text = CommonHelper.escapeQuotes(data[i].__string);
      content += '<a href="'+ url +'&o='+ data[i]._id
        + '" class="selector-menu-item" data-id="' + data[i]._id
        + '" data-title="' + text + '" data-text="'+ text +'">' + text + '</a>';
    }
    return content;
  }

  function loadObjectData (id, cb) {
    var place = places[activePlace];
    if (place.objectData[id]) {
      return cb(place.objectData[id]);
    }
    getAjax(place.objectUrl + id).done(function (data) {
      place.objectData[id] = data = data || {};
      loadExtraObjectData(data, cb);
    });
  }

  function loadExtraObjectData (data, cb) {
    let requests = [];
    if (data.objectBasic) {
      requests.push(function (cb) {
        getAjax('registry/api/objectBasic@pm-gov-ru/' + data.objectBasic).done(function (res) {
          data.objectBasic = res;
        }).always(function () {cb();});
      });
    }
    if (data.head) {
      requests.push(function (cb) {
        getAjax('registry/api/employee@pm-gov-ru/' + data.head).done(function (result) {
          data.head = result;
        }).always(function () {cb();});
      });
    }
    requests.push(function (cb) {
      postAjax(getActivePlaceParam('reportObjUrl'), {
        nameObject: data.name,
        dateSelect: (new Date).toISOString()
      }).done(function (res) {
        res = res && res[0];
        data._reportCardObject = res ? res._data : [];
      }).always(function () {cb();});
    });
    requests.push(function (cb) {
      postAjax(getActivePlaceParam('reportWorkUrl'), {
        nameObject: data.name
      }).done(function (res) {
        res = res && res[0];
        data._reportCardWork = res ? res._data : [];
        data._reportCardWorkTotal = (res && res._totals && res._totals[0] && res._totals[0].data) || {};
      }).always(function () {cb();});
    });
    requests.push(function (cb) {
      postAjax(getActivePlaceParam('reportFinUrl'), {
        nameObject: data.name
      }).done(function (res) {
        res = res && res[0];
        data._reportCardFin = res ? res._data : [];
        data._reportCardFinTotal = (res && res._totals && res._totals[0] && res._totals[0].data) || {};
      }).always(function () {cb();});
    });
    async.series(requests, function () {cb(data);});
  }

  // GRAPH PANE

  function showGraphPane () {
    loadGraphData(function (data) {
      var $pane = $activePlace.children('.graph-pane').show();
      createYearGraph(data, $pane.children('.chart'));
    });
  }

  function loadGraphData (cb) {
    postAjax(getActivePlaceParam('graphReport'), {
      yearEnd: (new Date).getFullYear()
    }).done(function (res) {
      cb(res && res[0] && res[0]._data || []);
    });
  }

  // PROGRESS PANE

  function showProgressPane () {
    createProgressChart(getMonitorParams({
      $pane: $activePlace.children('[data-id="progress"]')
    }));
  }

  function showProgressSvodPane () {
    createProgressSvodChart(getMonitorParams({
      $pane: $activePlace.children('[data-id="progressSvod"]')
    }));
  }

  // INDICATORS

  function showIndicatorsPane () {
    createIndicatorsChart(getMonitorParams({
      $pane: $activePlace.children('[data-id="indicators"]'),
    }));
  }

  function showCurrentIndicatorsPane () {
    createCurrentIndicatorsChart(getMonitorParams({
      $pane: $activePlace.children('[data-id="currentIndicators"]')
    }));
  }

  // AJAX

  function getMonitorParams (data) {
    return $.extend({
      $tools: $headPaneTools,
      startParams: startParams,
      getAjax: getAjax,
      postAjax: postAjax,
      pushHistory: pushHistory
    }, data);
  }

  function getAjax (url, params) {
    $monitor.addClass('loading');
    return $.get(url, params).always(function () {
      $monitor.removeClass('loading');
    }).fail(processFail);
  }

  function postAjax (url, params) {
    $monitor.addClass('loading');
    return $.post(url, params).always(function () {
      $monitor.removeClass('loading');
    }).fail(processFail);
  }

  function processFail (xhr, txt, msg) {
    if (msg === 'Unauthorized') {
      return fail401();
    }
  }

  function fail401 () {
    $pageAlert.children('.page-alert-panel').html('<p>Для доступа к данным необходимо выполнить вход в систему.</p><div class="mt20 text-center"><a href="auth" class="btn btn-danger">Войти</a></div>');
    $pageAlert.show();
  }
})();