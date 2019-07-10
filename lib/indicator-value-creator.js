/**
 * Created by krasilneg on 23.11.18.
 */
const moment = require('moment');

/**
 * @param {} options
 * @param {DataRepository} options.data
 * @param {WorkflowProvider} options.workflows
 * @param {Logger} options.log
 * @returns {Function}
 */
module.exports = function (options) {
  function createIndicatorValue(cn, start, period, logger, item, user, /*offset,*/ end) {
    let mstart = moment.utc(start);
    let dateStart = moment.utc(start).toDate();
    /*hour(offset).*/
    let dateEnd;
    switch (period) {
      case 'halfyear':
        dateEnd = mstart.add(6, 'M').subtract(24, 'hours');
        break;
      case 'quarter':
        dateEnd = mstart.add(3, 'M').subtract(24, 'hours');
        break;
      case 'one':
        dateEnd = typeof end !== 'undefined' ? end : start;
        break;
      default:
        dateEnd = mstart.endOf(period).startOf('day');
        break;
    }
    dateEnd.hour(dateEnd.hour()/* + offset*/);
    dateEnd = dateEnd.toDate();
    const stateValue = item.get('skipPlanned') ? 'wait' : 'plan';
    let indicatorValue = {
      indicatorBasic: item.getItemId(),
      dateStart,
      dateEnd,
      state: stateValue,
      review: 'normal'
    };

    if (item.get('defPlanValue')) {
      indicatorValue.plannedValue = item.get('defPlanValue');
    }
    return () => options.data
      .createItem(cn, indicatorValue, null, logger, {user: user})
      .then(iv => options.workflows.pushToState(iv, 'indicatorValueBasic@pm-gov-ru', stateValue, {user: user}))
      .catch(err => options.log.warn(err.message));

  }


  return function (item, user, logger) {
    let typeValue = item.getClassName(); // Имя класса значения показателя == однозначно связан с классом значений
    let cn; // Имя класса значения показателя
    switch (typeValue) {
      case 'indicatorDigital@pm-gov-ru':
        cn = 'indicatorValueDigital@pm-gov-ru';
        break;
      case 'indicatorFinancial@pm-gov-ru':
        cn = 'indicatorValueFinancial@pm-gov-ru';
        break;
      case 'indicatorMedia@pm-gov-ru':
        cn = 'indicatorValueMedia@pm-gov-ru';
        break;
      case 'indicatorText@pm-gov-ru':
        cn = 'indicatorValueText@pm-gov-ru';
        break;
      case 'indicatorBudget@pm-gov-ru':
        cn = 'indicatorValueBudget@pm-gov-ru';
        break;
      case 'indicatorLimBudget@pm-gov-ru':
        cn = 'indicatorValueLimBudget@pm-gov-ru';
        break;
      default:
        throw new Error(`Неизвестный тип показателя "${typeValue}", обратитесь к разработчику!`);
    }

    let since;
    let till;
    if (item.getClassName() === 'indicatorBudget@pm-gov-ru') {
      if (moment(item.get('dateStartPrint'), 'DD.MM.YYYY').isValid()) {
        since = moment.utc(item.get('dateStartPrint'), 'DD.MM.YYYY');
      } else {
        throw new Error('Не задана "Дата начала", проверьте заполнение полей в этапе или связанном проекте!');
      }
      if (moment(item.get('dateEndPrint'), 'DD.MM.YYYY').isValid()) {
        till = moment.utc(item.get('dateEndPrint'), 'DD.MM.YYYY');
      } else {
        throw new Error('Не задана "Дата завершения", проверьте заполнение полей в этапе или связанном проекте!');
      }
    } else {
      since = moment.utc(item.get('dateStart'));
      till = moment.utc(item.get('dateEnd'));
    }

    let rate = item.get('periodType');
    /*
    let offset = since.hour();
    if (offset > 0) {
      since.add(24 - offset, 'hours');
      offset = offset - 24;
    }
     */
    let period = 'day';
    let step = 'd';
    switch (rate) {
      case 'year':
        step = 'y';
        period = 'year';
        since = since.startOf(period);
        break;
      case 'halfyear':
      { // Полугодие
        step = 'H';
        period = 'halfyear';
        let mnth = since.month();
        since.startOf('year');
        if (mnth > 5) {
          since.add(6, 'M');
        }
      }
        break;
      case 'quarter':
      { // Квартал
        step = 'Q';
        period = 'quarter';
        let mnth = since.month();
        since.startOf('year');
        since.add(mnth - mnth % 3, 'M');
      }
        break;
      case 'month':
        step = 'M';
        period = 'month';
        since = since.startOf(period);
        break;
      case 'week':
        step = 'w';
        period = 'isoWeek';
        since = since.startOf(period);
        break;
      case 'day':
        step = 'd';
        period = 'day';
        since = since.startOf(period);
        break;
      case 'one':
        step = 'none';
        period = 'one';
        break;
      default:
        throw new Error('Данный период не обрабатывается утилитой. Вы можете создать значения показателей вручную');
    }
    let count = 0;
    let p = Promise.resolve();
    if (step === 'none') {
      return p
        .then(createIndicatorValue(cn, since.toDate(), period, logger, item, user, /*offset,*/ till))
        .then(() => {
          count++;
          return count;
        });
    }
    while (since.isBefore(till)) {
      p = p
        .then(createIndicatorValue(cn, since.toDate(), period, logger, item, user/*, offset*/))
        .then(() => {
          count++;
        });

      switch (step) {
        case 'H':
          since.add(6, 'M');
          break;
        case 'Q':
          since.add(3, 'M');
          break;
        default:
          since.add(1, step);
          break;
      }
    }
    return p.then(() => count);
  };
};
