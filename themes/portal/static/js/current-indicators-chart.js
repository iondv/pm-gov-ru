'use strict';

(function () {

  window.createCurrentIndicatorsChart = function (params) {

    var viewUrl = 'portal/index?p=sakh&v=currentIndicators';
    var projectUrl = 'report/pm-gov-ru@projects/curIndicators/curIndicators/nameProjFilter/param';
    var reportUrl = 'report/pm-gov-ru@projects/curIndicators/curIndicators/data';

    var $pane = params.$pane;
    var $tools = params.$tools.html($pane.find('.pane-tools').html());
    var $chart = $pane.find('.chart');

    var $project = $tools.find('.project-selector').hide();
    var $projectMenu = $project.find('.selector-menu');
    var $projectBody = $projectMenu.find('.selector-menu-body');

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
      pushHistory($item.data('id'));
      params.postAjax(reportUrl, {
        nameProjFilter: $item.html()
      }).done(function (res) {
        $pane.show();
        createChart(res instanceof Array ? res :[]);
      });
    });

    function createProjectItem (value, index) {
      return '<a href="'+ getProjectUrl(index)
        +'" class="selector-menu-item" data-id="'+ index +'">'+ value +'</a>';
    }

    function getProjectUrl (index) {
      return viewUrl +'&pid='+ index;
    }

    function pushHistory (project) {
      params.pushHistory('sakh', 'currentIndicators', null, {
        pid: project
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
          categories: data.categories
        },
        yAxis: {
          className: 'y-axis',
          min: 0,
          title: null,
          allowDecimals: false
        },
        legend: {
          enabled: true,
          y: 10
        },
        tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          //pointFormatter: formatPoint
        },
        plotOptions: {
          column: {
            grouping: false,
            dataLabels: {
              enabled: true,
              verticalAlign: 'top',
              className: 'big-plot-number white-text'
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
          colorIndex: 1,
          pointPadding: 0.2,
          pointPlacement: 0
        }]
      });
    }

    function prepareData (data) {
      var categories = [];
      var plan = [];
      var fact = [];
      for (var i = 0; i < data.length; ++i) {
        var item = data[i];
        categories.push(moment(item.valueDateEnd).format('L') + '<br>' + item.indicatorFullName);
        plan.push(isNaN(item.plan) ? 0 : item.plan);
        fact.push(isNaN(item.value) ? 0 : item.value);
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