'use strict';
const Logger = require('core/interfaces/Logger');
const F = require('core/FunctionCodes');

/**
 * @param {{}} options
 * @param {MetaRepository} options.meta
 * @param {DataRepository} options.data
 * @param {Logger} [options.log]
 */
module.exports = function (options) {
  let curDate = new Date();
  curDate.setHours(0, 0, 0, 0);
  return options.data
    .getList(
      'indicatorValueBasic@pm-gov-ru',
      {
        filter: {
          [F.AND]: [
            {[F.EQUAL]: ['$state', 'wait']},
            {[F.LESS]: ['$dateStart', curDate]},
            {[F.GREATER]: ['$dateEnd', curDate]},
            {[F.NOT_EMPTY]: ['$indicatorBasic']}
          ]
        }
      })
    .then((indicators) => {
      let p = Promise.resolve();
      indicators.forEach((indicator) => {
        p = p
          .then(() => options.data.editItem(indicator.getClassName(), indicator.getItemId(), {'state': 'edit'}))
          .then(item => options.workflows.pushToState(item, 'indicatorValueBasic@pm-gov-ru', 'edit'))
          .catch((err) => {
            if (options.log instanceof Logger) {
              options.log.error(err);
            } else {
              console.error(err);
            }
          });
      });
      return p;
    });
};
