/**
 * Created by kras on 08.09.16.
 */
'use strict';

const ActionHandler = require('modules/registry/backend/ActionHandler');
const edit = require('modules/registry/backend/items').saveItem;
const ivc = require('../indicator-value-creator');

/**
 * @constructor
 * @param {{}} options
 * @param {DataRepository} options.data
 * @param {WorkflowProvider} options.workflows
 * @param {Logger} options.log
 * @param {ChangelogFactory} [options.changelogFactory]
 * @param {String} [options.state]
 */
function CreateIndicatorValueHandler(options) {

  options = options || {};

  const work = ivc(options);

  this.init = function () {
    if (options.workflows && options.state) {
      options.workflows.on(
        'indicatorBasic@pm-gov-ru.' + options.state,
        (e) => {
          let logger = null;
          if (options.changelogFactory && e.user) {
            logger = options.changelogFactory.logger(() => e.user.id());
          }
          return work(e.item, e.user, logger).then(() => null);
        }
      );
    }
  };

  /**
   * @param {{metaRepo: MetaRepository, securedDataRepo: SecuredDataRepository}} scope
   * @param {ChangelogFactory} scope.changelogFactory
   * @param {Request} req
   * @returns {Promise}
   */
  this._exec = function (scope, req) {
    let logger;
    let user = scope.auth.getUser(req);
    if (options.changelogFactory) {
      logger = options.changelogFactory.logger(() => user.id());
    }
    return edit(scope, req, null, logger, true)
      .then(item => scope.dataRepo.getItem(item, null))
      .then((item) => {
        if (item.get('status') !== 'edit') {
          throw new Error('Создать значения показателей, можно только при редактировании!');
        }
        return work(item, user, logger);
      })
      .then((count) => {
        return {$message: 'Создано ' + count + ' значений для ввода по периодам!'};
      });
  };
}

CreateIndicatorValueHandler.prototype = new ActionHandler();

module.exports = CreateIndicatorValueHandler;