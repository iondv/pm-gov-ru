/**
 * Created by krasilneg on 30.01.19.
 */
'use strict';

const ActionHandler = require('modules/registry/backend/ActionHandler');
const edit = require('modules/registry/backend/items').saveItem;
const ivc = require('../project-report-creator');
const overrideEagerLoading = require('modules/registry/backend/items').overrideEagerLoading;
const canonicNode = require('modules/registry/backend/menu').canonicNode;
const locale = require('locale');
const base64 = require('base64-js');
const User = require('core/User');
const path = require('path');
const Background = require('core/impl/Background');

/**
 * @constructor
 * @param {{}} options
 * @param {DataRepository} options.data
 * @param {ExportManager} options.exporter
 * @param {ResourceStorage} options.storage
 * @param {ChangelogFactory} options.changelogFactory
 * @param {Auth} options.auth
 * @param {Logger} options.log
 * @param {Background} options.bg
 * @param {String} options.configName
 * @param {String} [options.directory]
 */
function CreateProjectReportsHandler(options) {

  options = options || {};

  const work = ivc(options);

  function toBase64String(obj) {
    return obj ? base64.fromByteArray(Buffer.from(JSON.stringify(obj), 'UTF-8')) : '';
  }

  function fromBase64String(str) {
    return str ? JSON.parse(Buffer.from(base64.toByteArray(str)).toString()) : null;
  }

  this.init = function (scope) {
    if (options.bg instanceof Background) {
      let scopeName = Object.keys(scope).find(key => scope[key] === this);
      options.bg.register(scopeName);
    }
    return Promise.resolve();
  };

  /**
   * @param {{}} params
   * @param {String} params.uid
   * @param {String} params.item        item id
   * @param {String} [params.eagerLoading]
   * @param {String} [params.lang]
   * @return Promise
   */
  this.run = function (params) {
    let project;
    let user;
    return options.data
      .getItem(
        'project@pm-gov-ru',
        params.item,
        {
          eagerLoading: params.eagerLoading && fromBase64String(params.eagerLoading)
        }
      )
      .then(
        (item) => {
          if (!item) {
            throw new Error('Проект ' + params.item + ' не найден.');
          }
          project = item;
          return new Promise((resolve, reject) => {
            options.auth.userProfile(
              params.uid,
              u => u instanceof User ? resolve(u) : reject(new Error('Пользователь не найден.'))
            );
          });
        }
      )
      .then((u) => {
        user = u;
        const logger = options.changelogFactory.logger(() => user.id());
        return work(project, user, logger, {lang: params.lang});
      });
  };

  /**
   * @param {{metaRepo: MetaRepository, securedDataRepo: SecuredDataRepository}} scope
   * @param {ChangelogFactory} scope.changelogFactory
   * @param {Request} req
   * @returns {Promise}
   */
  this._exec = function (scope, req) {
    let logger;
    let locales = new locale.Locales(req.headers['accept-language']);
    let lang = locales[0] ? locales[0].language : 'ru';
    let user = scope.auth.getUser(req);
    let n = canonicNode(req.params.node);
    let node = scope.metaRepo.getNode(n.code, n.ns);

    if (scope.changelogFactory) {
      logger = scope.changelogFactory.logger(() => user.id());
    }

    return edit(scope, req, null, logger, true)
      .then(item => scope.dataRepo.getItem(item, null))
      .then((item) => {
        let cm = item.getMetaClass();
        let eagerLoading = [];
        if (node && node.eagerLoading) {
          if (node.eagerLoading.exportItem && Array.isArray(node.eagerLoading.exportItem[cm.getName()])) {
            eagerLoading = node.eagerLoading.exportItem[cm.getName()];
          }
        }

        eagerLoading = overrideEagerLoading(
          'registry',
          eagerLoading,
          node ? node.namespace + '@' + node.code : '',
          cm.getCanonicalName(),
          'exportItem',
          scope.settings);

        let uid = user.id();
        let params = {
          path: path.join('modules', 'registry'),
          eagerLoading: toBase64String(eagerLoading),
          item: item.getItemId(),
          lang: lang
        };
        let scopeName = Object.keys(scope).find(key => scope[key] === this);
        return options.bg.start(uid, scopeName, item.get('code'), params);
      })
      .then(() => {
        return {$message: 'Запущена процедура формирования отчетов по проекту!'};
      });
  };
}

CreateProjectReportsHandler.prototype = new ActionHandler();

module.exports = CreateProjectReportsHandler;
