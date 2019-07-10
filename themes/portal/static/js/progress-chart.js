'use strict';

(function () {

  window.createProgressChart = function (params) {

    var viewUrl = 'portal/index?p=kms&v=progress';
    var filterUrl = 'report/pm-gov-ru@eventsKoms/personProgKoms/personProgKoms/person/filter';
    var reportUrl = 'report/pm-gov-ru@eventsKoms/personProgKoms/personProgKoms/data';

    var $pane = params.$pane;
    var $tools = params.$tools.html($pane.find('.pane-tools').html());
    var $chart = $pane.find('.chart');

    var $period = $tools.find('.period');
    var startDate = moment().startOf('month');
    var endDate = moment().endOf('month');

    if (params.startParams.sd && params.startParams.ed) {
      startDate = moment(params.startParams.sd);
      endDate = moment(params.startParams.ed);
      params.startParams.sd = null;
      params.startParams.ed = null;
      pushHistory();
    }

    $period.daterangepicker({
      showDropdowns: true,
      ranges: {
        'За месяц': [moment().startOf('month'), moment().endOf('month')],
        'За квартал': [moment().startOf('quarter'), moment().endOf('quarter')],
        'За год': [moment().startOf('year'), moment().endOf('year')]
      },
      startDate: startDate,
      endDate: endDate,
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
    }, selectPeriod);

    selectPeriod(startDate, endDate);

    var $person = $tools.find('.person-selector');
    var $personMenu = $person.find('.selector-menu');
    var $personMenuBody = $personMenu.find('.selector-menu-body');

    params.getAjax(filterUrl).done(function (data) {
      data = data instanceof Array ? data : [];
      $personMenuBody.html(data.map(createPersonItem).join(''));
      if (!isNaN(parseInt(params.startParams.pid))) {
        $personMenuBody.children().eq(params.startParams.pid).click();
        params.startParams.pid = null;
      }
    });

    $personMenuBody.on('click', '.selector-menu-item', function (event) {
      if (event.ctrlKey) {
        return event.stopImmediatePropagation();
      }
      event.preventDefault();
      var $item = $(this);
      pushHistory($item.data('id'));
      params.postAjax(reportUrl, {
        person: $item.html(),
        intervalStart: startDate.toISOString(),
        intervalEnd: endDate.toISOString()
      }).done(function (res) {
        $pane.show();
        createChart(res && res[0] && res[0]._data || []);
      });
    });

    function createPersonItem (value, index) {
      return '<a href="'+ getPersonUrl(index)
        +'" class="selector-menu-item" data-id="'+ index +'">'+ value +'</a>';
    }

    function updatePersonItems () {
      SelectorHelper.getItems($person).each(function (index) {
        $(this).attr('href', getPersonUrl(index));
      })
    }

    function getPersonUrl (index) {
      return viewUrl +'&sd='+ getDateParam(startDate) +'&ed='+ getDateParam(endDate) +'&pid='+ index;
    }

    function getDateParam (date) {
      return date.format('YYYY-MM-DD');
    }

    function selectPeriod (start, end, label) {
      startDate = moment(start);
      endDate = moment(end);
      $period.find('.start-date').html(startDate.format('L'));
      $period.find('.end-date').html(endDate.format('L'));
      updatePersonItems();
      SelectorHelper.getActiveItem($person).click();
    }

    function pushHistory (person) {
      params.pushHistory('kms', 'progress', null, {
        sd: getDateParam(startDate),
        ed: getDateParam(endDate),
        pid: person
      });
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
          categories: data.dates
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
      var dates = [], values = [], min, max, minIndex, maxIndex;
      for (var i = 0; i < data.length; ++i) {
        dates.push(moment(data[i].date).format('L'));
        let value = data[i]._data && data[i]._data[0];
        value = value && value._data && value._data[0];
        value = value && value.piCurrent || 0;
        values.push({
          y: value,
          colorIndex: getValueColorIndex(value)
        });
        if (min === undefined || value < min) {
          min = value;
          minIndex = i;
        }
        if (max === undefined || value > max) {
          max = value;
          maxIndex = i;
        }
      }
      if (min !== max) {
        values[minIndex].colorIndex += ' min';
        values[maxIndex].colorIndex += ' max';
      }
      return {
        dates: dates,
        values: values
      };
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
