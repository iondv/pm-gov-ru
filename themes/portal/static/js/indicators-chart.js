'use strict';

(function () {

  window.createIndicatorsChart = function (params) {

    var viewUrl = 'portal/index?p=sakh&v=indicators';
    var projectUrl = 'report/pm-gov-ru@projects/allIndicators/allIndicators/nameProjFilter/param';
    var reportUrl = 'report/pm-gov-ru@projects/allIndicators/allIndicators/data';

    var $pane = params.$pane;
    var $tools = params.$tools.html($pane.find('.pane-tools').html());
    var $chart = $pane.find('.chart');

    var $project = $tools.find('.project-selector').hide();
    var $projectMenu = $project.find('.selector-menu');
    var $projectBody = $projectMenu.find('.selector-menu-body');
    var currentProjectIndex;

    var $event = $tools.find('.event-selector').hide();
    var $eventMenu = $event.find('.selector-menu');
    var $eventBody = $eventMenu.find('.selector-menu-body');
    var eventMap = {};

    params.getAjax(projectUrl).done(function (data) {
      data = data instanceof Array ? data : [];
      $projectBody.html(data.map(createProjectItem).join(''));
      if (!isNaN(parseInt(params.startParams.pid))) {
        $projectBody.children().eq(params.startParams.pid).click();
        params.startParams.pid = null;
      } else {
        $projectBody.children().first().click();
      }
      $project.show();
    });

    $projectBody.on('click', '.selector-menu-item', function (event) {
      if (event.ctrlKey) {
        return event.stopImmediatePropagation();
      }
      event.preventDefault();
      var $item = $(this);
      currentProjectIndex = $item.data('id');
      pushHistory(currentProjectIndex);
      $event.hide();
      params.postAjax(reportUrl, {
        nameProjFilter: $item.html()
      }).done(function (res) {
        res = res instanceof Array ? res : [];
        $pane.show();
        $event.show();
        createEvents(res);
        createChart(res);
      });
    });

    $eventBody.on('click', '.selector-menu-item', function (event) {
      if (event.ctrlKey) {
        return event.stopImmediatePropagation();
      }
      event.preventDefault();
      var $item = $(this);
      createChart(Object.values(eventMap)[$item.data('id')]);
    });

    function createProjectItem (value, index) {
      return '<a href="'+ getProjectUrl(index)
        +'" class="selector-menu-item" data-id="'+ index +'">'+ value +'</a>';
    }

    function getProjectUrl (index) {
      return viewUrl +'&pid='+ index;
    }

    function pushHistory (project) {
      params.pushHistory('sakh', 'indicators', null, {
        pid: project
      });
    }

    function createEvents (items) {
      eventMap = createEventMap(items);
      $eventBody.html(Object.keys(eventMap).map(createEventItem).join(''));
      SelectorHelper.setEmptyTitle($event);
    }

    function createEventMap (items) {
      var map = {};
      items.map(function (item) {
        if (!(map[item.name] instanceof Array)) {
          map[item.name] = [];
        }
        map[item.name].push(item);
      })
      return map;
    }

    function createEventItem (value, index) {
      return '<a href="'+ getEventUrl(index)
        +'" class="selector-menu-item" data-id="'+ index +'">'+ value +'</a>';
    }

    function getEventUrl (index) {
      return viewUrl +'&pid='+ currentProjectIndex +'&eid='+ index;
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
          categories: data.categories,
          scrollbar: {
            enabled: true
          }
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
        },
        legend: {
          enabled: true,
          y: 20
        },
        tooltip: {
          headerFormat: '<br/>',
          //pointFormatter: formatPoint
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
              className: 'white-text',
              style: {
                fill: 'white',
                fontSize: '16px'
              }
            }
          }
        },
        series: [{
          name: 'План',
          data: data.plan,
          colorIndex: 0
        }, {
          name: 'Факт',
          data: data.fact,
          colorIndex: 1
        }]
      });
    }

    function prepareData (data) {
      var events = {};
      for (var i = 0; i < data.length; ++i) {
        var item = data[i];
        var eventName = item.name;
        var indicatorName = item.indicatorFullName;
        if (!events.hasOwnProperty(eventName)) {
          events[eventName] = {};
        }
        events[eventName][indicatorName] = item;
      }
      var categories = [];
      var plan = [];
      var fact = [];
      for (var eventName in events) {
        if (events.hasOwnProperty(eventName)) {
          var event = events[eventName];
          var children = [];
          for (var indicatorName in event) {
            if (event.hasOwnProperty(indicatorName)) {
              var item = event[indicatorName];
              plan.push(isNaN(item.plan) ? 0 : item.plan);
              fact.push(isNaN(item.value) ? 0 : item.value);
              children.push(indicatorName);
            }
          }
          categories.push({
            name: eventName,
            categories: children
          })
        }
      }
      return {
        categories: categories,
        plan: plan,
        fact: fact
      };
    }

    function formatPoint() {
      return '';
    }
  };
})();
