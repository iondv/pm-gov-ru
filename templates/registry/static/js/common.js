'use strict';

if (!window.jsCommonReady) {
  (function () {
    var map = {};
    window.cooperativeAjax = function (type, url, params, cb) {
      if (map.hasOwnProperty(url)) {
        if (map[url].done) {
          return cb(map[url].data);
        }
        map[url].listeners.push(cb);
      } else {
        map[url] = {
          listeners: [cb],
          xhr: $[type](url, params).done(function (data) {
            map[url].done = true;
            map[url].data = data;
            for (var i = 0; i < map[url].listeners.length; ++i) {
              map[url].listeners[i](data);
            }
          })
        };
      }
    };
  })();

  window.asyncSeries = function (items) {
    if (items instanceof Array || items.length) {
      series(0);
    }
    function series (pos) {
      items[pos](function () {
        if (++pos < items.length) {
          series(pos);
        }
      });
    }
  };

  window.searchObject = function (value, objects, key) {
    if (objects instanceof Array) {
      for (let i = 0; i < objects.length; ++i) {
        if (objects[i] && objects[i][key] === value) {
          return objects[i];
        }
      }
    }
  };

  window.jsCommonReady = true;
  $(document.body).trigger('js:common:ready');
}