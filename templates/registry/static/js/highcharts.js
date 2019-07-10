'use strict';

if (!window.highchartReady) {
  window.highchartReady = true;
  $.getScript('registry/app-vendor/highcharts/js/highcharts.js', function () {
    $(document.body).trigger('highcharts:ready');
  });
}