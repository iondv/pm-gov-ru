/**
 * Created by kras on 26.09.16.
 */

const Preprocessor = require('core/interfaces/Preprocessor');

// jshint maxstatements: 50, maxcomplexity: 30
/**
 * @param {{}} poptions
 * @param {DataSource} poptions.dataSource
 * @param {String} [poptions.tplEncoding]
 * @param {Logger} [poptions.log]
 * @constructor
 */
function DigestData(poptions) {
  /**
   * @param {Item} item
   * @param {{}} [options]
   * @returns {Promise}
   */
  this._applicable = function (item, options) {
    // 1. Проверка при загрузке формы объекта на необходимость в ЭП
    // options.action - код перехода БП с ЭП, подпись ДО перехода
    return new Promise(((resolve) => {
      if (options.action === 'indicatorValueBasic@pm-gov-ru.needAppTrs_sign' && item.get('indicatorBasic.needSign')) {
        resolve(true);
      } else {
        // Console.log('digesting_app');
        resolve(false);
      }
    }));
  };

  /**
   * @param {Item} item
     * @param {{}} [options]
     * @param {String} [options.action]
     * @returns {Promise}
     */
  this._process = function (item, options) {
    // 2. Процесс подписи при выполнении перехода БП с ЭП
    // options.action - код перехода БП с ЭП, подпись ДО перехода
    if (options.action === 'indicatorValueBasic@pm-gov-ru.needAppTrs_sign' && item.get('indicatorBasic.needSign')) {
      const signable = {
        id: item.get('id'),
        measureUnit: item.get('measureUnit'),
        measureType: item.get('measureType'),
        objectBasic: item.get('objectBasic'),
        dateStart: item.get('dateStart'),
        dateEnd: item.get('dateEnd'),
        value: item.get('value'),
        valueAggregation: item.get('valueAggregation'),
        plannedValue: item.get('plannedValue'),
        desiredValue: item.get('desiredValue')
      };
      const content = JSON.stringify(signable);
      // Для формирования блока data в SignSaver и подпись
      return Promise.resolve({
        mimeType: 'application/json',
        content: Buffer.from(content).toString('base64'),
        attributes: {
          className: 'indicatorValueBasic',
          id: item.getItemId()
        }
      });
    }
    // Console.log('digesting_pro');
    return Promise.resolve([]);
  };
}

DigestData.prototype = new Preprocessor();

module.exports = DigestData;
