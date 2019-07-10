'use strict';

(function () {

  function ListDataTable ($table) {
    this.$table = $table;
    this.$table.data('listDataTable', this);
    this.params = this.$table.data('params');
    this.init();
  };

  $.extend(ListDataTable.prototype, {

    init: function () {
      var options = this.getDataTableOptions();
      this.dataTable = this.$table.DataTable(options)
    },

    getDataTableOptions: function () {
      var result = $.extend(true, {
        'serverSide': true,
        'processing': true,
        'sDom': "t<'row'<'col-md-12 text-right'ip>>",
        'ajax': {
          type: 'POST',
          contentType: 'application/json',
          // customData: function
        }
      }, this.params.dataTable);
      result.columns = result.columns.map(this.prepareColumnOptions, this);
      result.ajax.data = this.prepareAjaxData.bind(this);
      return result;
    },

    prepareColumnOptions: function (data) {
      data = $.extend({
        'data': data.name,
        'orderable': false,
        'searchable': false,
      }, data);
      data.customRender = data.render;
      data.render = this.renderCell.bind(this, data);
      return data;
    },

    prepareAjaxData: function (data) {
      data.node = this.params.node;
      data.eagerLoading = [];
      data.filter = [];
      data.sorting = [];
      data.needed = this.getNeededData();
      if (this.params.prepareAjaxData) {
        this.params.prepareAjaxData.call(this, data);
      }
      return JSON.stringify(data);
    },

    getNeededData: function () {
      var result = {};
      this.params.dataTable.columns.forEach(function (item) {
        result[item.name] = true;
      });
      return result;
    },

    renderCell: function (column, data, type, row) {
      if (column.customRender) {
        return column.customRender.apply(this, arguments);
      }
      var renderer = null;
      switch (column.type) {
        case 'date': renderer = this.renderDate; break;
      }
      return renderer ? renderer.apply(this, arguments) : data;
    },

    renderDate: function (column, data, type) {
      return data && type === 'display'
        ? this.formatColumnDate(data, this.params.locale.dateFormat, column)
        : data;
    },

    formatColumnDate: function (value, pattern, column) {
      if (!value) {
        return '';
      }
      var date = column.parseTimeZone ? moment.parseZone(value) : moment(value);
      return date.isValid() ? date.format(pattern) : '';
    },
  });


  $('.list-data-table').each(function () {
    var $table = $(this);
    if (!$table.data('listDataTable')) {
      new ListDataTable($table);
    }
  });
})();