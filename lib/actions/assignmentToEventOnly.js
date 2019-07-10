'use strict';

const ActionHandler = require('modules/registry/backend/ActionHandler');

function AssignmentToEventOnly (options) {
    options = options || {};

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
        let cm = scope.metaRepo.getMeta(req.params.class);
        if (!cm || cm.getCanonicalName() !== 'assignment@pm-gov-ru') {
            throw new Error('Исходный объект не является поручением.');
        }
        return scope.securedDataRepo.getItem(cm.getCanonicalName(), req.params.id)
        .then((assignment) => {
            if (!assignment) {
                throw new Error('Не удалось найти указанное поручение.');
            }
            if (!assignment.base.basicObj) {
                throw new Error('Можно создать контрольную точку только для мероприятия.');
            }
            let data = {
                name: assignment.base.name,
                descript: assignment.base.descript,
                conclusion: assignment.base.answ,
                priority: assignment.base.priority,
                datePlannedEnd: assignment.base.datePlannedEnd,
                dateStart: assignment.base.dateStart,
                dateEnd: assignment.base.dateEnd,
                owner: assignment.base.owner,
                basicObj: assignment.base.basicObj,
                resultCloudFile: assignment.base.fileAnsw,
                archive: assignment.base.archive,
                state: assignment.base.state,
                head: assignment.base.head
            };
            return scope.securedDataRepo.createItem('eventOnly@pm-gov-ru', data, null, logger, {user})
            .then((ec) => {
                return {$message: 'Создана контрольная точка ' + ec.toString()};
            });
        });
    }
}

AssignmentToEventOnly.prototype = new ActionHandler();

module.exports = AssignmentToEventOnly;