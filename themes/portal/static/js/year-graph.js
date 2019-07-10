'use strict';

(function () {

  window.createYearGraph = function (data, $chart) {

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
        categories: data.months
      },
      yAxis: {
        min: 0,
        title: null,
        stackLabels: {
          enabled: false
        },
        allowDecimals: false
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        //pointFormat: '{series.name}: {point.y}<br/>Всего заявлений: {point.stackTotal:,.0f}'
        //pointFormatter: formatPoint
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
            //color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
          }
        }
      },
      series: [{
        name: 'План',
        data: data.values,
        colorIndex: 6
      }]
    });
  };

  function prepareData (data) {
    var months = [], values = [];
    for (var i = 0; i < data.length; ++i) {
      months.push(data[i].periodMonth);
      values.push(data[i].plan);
    }
    return {
      months: months,
      values: values
    }
  }

  function formatPoint () {
    return '';
  }
})();
