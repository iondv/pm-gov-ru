'use strict';

(function () {

  window.createProgressSvodChart = function (params) {

    var viewUrl = 'portal/index?p=kms&v=progressSvod';
    var reportUrl = 'report/pm-gov-ru@eventsKoms/personProgByDateKoms/personProgByDateKoms/data';

    var $pane = params.$pane;
    var $tools = params.$tools.html($pane.find('.pane-tools').html());
    var $chart = $pane.find('.chart');

    var DEFAULT_PERIOD = 7;
    var $date = $tools.find('.date');
    var startDate = moment().startOf('month');

    var $period = $tools.find('.period-selector');
    var $periodMenu = $period.find('.selector-menu');
    var $periodMenuBody = $periodMenu.find('.selector-menu-body');
    var period = SelectorHelper.getActiveItemId($period);

    if (params.startParams.sd) {
      startDate = moment(params.startParams.sd);
      period = params.startParams.period || DEFAULT_PERIOD;
      params.startParams.sd = null;
      params.startParams.period = null;
      pushHistory(period);
    }

    $date.daterangepicker({
      singleDatePicker: true,
      showDropdowns: true,
      ranges: {
        'За месяц': [moment().startOf('month'), moment().endOf('month')],
        'За квартал': [moment().startOf('quarter'), moment().endOf('quarter')],
        'За год': [moment().startOf('year'), moment().endOf('year')]
      },
      startDate: startDate,
      linkedCalendars: false,
      showCustomRangeLabel: true,
      alwaysShowCalendars: false,
      autoApply: true,
      opens: 'right',
      locale: {
        applyLabel: "Выбор",
        cancelLabel: "Отмена",
        fromLabel: "От",
        toLabel: "До",
        customRangeLabel: "За период"
      }
    }, selectDate);

    $periodMenuBody.on('click', '.selector-menu-item', function (event) {
      if (event.ctrlKey) {
        return event.stopImmediatePropagation();
      }
      event.preventDefault();
      var $item = $(this);
      period = $item.data('id');
      pushHistory(period);
      params.postAjax(reportUrl, {
        byDate: startDate.toISOString()
      }).done(function (res) {
        $pane.show();
        createChart(res || []);
      });
    });

    selectDate(startDate);

    function selectDate (start, end, label) {
      startDate = moment(start);
      $date.find('.start-date').html(startDate.format('L'));
      SelectorHelper.getItemById(period, $period).click();
    }

    function pushHistory (period) {
      params.pushHistory('kms', 'progressSvod', null, {
        sd: getDateParam(startDate),
        period: period
      });
    }

    function getDateParam (date) {
      return date.format('YYYY-MM-DD');
    }

    function createChart (data) {
      data = prepareData(data);
      Highcharts.chart($chart.get(0), {
        chart: {
          type: 'column'
        },
        credits: {
          enabled: false
        },
        title: null,
        xAxis: {
          categories: data.persons
        },
        yAxis: {
          className: 'y-axis',
          min: 0,
          title: null,
          stackLabels: {
            enabled: true,
            verticalAlign: 'top',
            style: {
              color: 'white',
              fontSize: '16px'
            }
          },
          allowDecimals: false,
          plotLines: [{
            className: 'plot-line-10 plot-line',
            zIndex: 4,
            value: 10
          },{
            className: 'plot-line-35 plot-line',
            zIndex: 4,
            value: 35
          },{
            className: 'plot-line-70 plot-line',
            zIndex: 4,
            value: 70
          },{
            className: 'plot-line-110 plot-line',
            zIndex: 4,
            value: 110
          }]
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          //pointFormatter: formatPoint
        },
        plotOptions: {
          column: {
            colorByPoint: true,
            stacking: 'normal',
            dataLabels: {
              enabled: false
            }
          }
        },
        series: [{
          name: 'ПИ',
          data: data.values,
          colorIndex: 1
        }]
      });
    }

    function prepareData(data) {
      var persons = [], values = [], min, max, minIndexes, maxIndexes;
      for (var i = 0; i < data.length; ++i) {
        persons.push(data[i].person);
        let value = data[i]._data && data[i]._data[0];
        value = value && value._data && value._data[0];
        value = value && value._data && value._data[0];
        value = value && value.piCurrent || 0;
        values.push({
          y: value,
          colorIndex: getValueColorIndex(value)
        });
        if (min === undefined || value < min) {
          min = value;
          minIndexes = [i];
        }
        if (value === min) {
          minIndexes.push(i);
        }
        if (max === undefined || value > max) {
          max = value;
          maxIndexes = [i];
        }
        if (value === max) {
          maxIndexes.push(i);
        }
      }
      if (min !== max) {
        appendColorIndex(minIndexes, values, ' min');
        appendColorIndex(maxIndexes, values, ' max');
      }
      return {
        persons: persons,
        values: values
      };
    }

    function appendColorIndex (indexes, values, appendix) {
      for (var i = 0; i < indexes.length; ++i) {
        values[indexes[i]].colorIndex += appendix;
      }
    }

    function getValueColorIndex (val) {
      if (val > 110) return 4;
      if (val > 70) return 3;
      if (val > 35) return 2;
      if (val > 10) return 1;
      return 0;
    }

    function formatPoint() {
      return '';
    }
  };
})();
