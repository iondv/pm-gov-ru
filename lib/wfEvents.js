'use strict';
const ivc = require('./indicator-value-creator');

/**
 * @param {{service: String}} options
 * @param {WorkflowProvider} options.workflows
 * @param {DataRepository} options.dataRepo
 * @param {MetaRepository} options.metaRepo
 * @param {Logger} options.log
 * @param {ChangelogFactory} options.changelogFactory
 * @param {String} options.AIPConfigPath
 * @constructor
 */
function WorkflowEvents(options) {

  const aipConfig = require(options.AIPConfigPath);

  function createAip(config, parent = null) {
    let p = Promise.resolve();
    let details = [];
    Object.keys(config).forEach((nm) => {
      p = p
        .then(() => options.dataRepo.createItem(
          'eventOnlyAIP@pm-gov-ru',
          {
            name: nm,
            basicObjAip: parent ? parent.getItemId() : null
          }
        ))
        .then((item) => {
          details.push(item);
          return item;
        });
      if ((typeof config[nm] === 'object') && config[nm]) {
        p = p.then(item => createAip(config[nm], item));
      }
    });
    /*
    if (parent) {
      p = p.then(() => options.dataRepo.put(parent, 'aip', details));
    }
     */
    return p;
  }

  this.init = function () {
    options.workflows.on(
      ['project@pm-gov-ru.inaccepted'],
      e =>
        options.dataRepo.getItem(e.item, null, {forceEnrichment: [['changeReq']]})
          .then((item) => {
            const changeReqs = item.getAggregates('changeReq');
            let promises = Promise.resolve();
            if (Array.isArray(changeReqs)) {
              changeReqs.forEach((cr) => {
                promises = promises
                  .then(() => options.dataRepo.editItem(
                    cr.getMetaClass().getCanonicalName(),
                    cr.getItemId(),
                    {status: 'close'}
                  ));
              });
            }
            return promises.then(() => null);
          })
    );

    function finalizeEvent(event) {
      return options.dataRepo.editItem(event.getMetaClass().getCanonicalName(), event.getItemId(), {state: 'fin'})
        .then(item => options.dataRepo.getItem(item, null, {forceEnrichment: [['basicObjs']]}))
        .then((item) => {
          const basicObjs = item.getAggregates('basicObjs');
          let promises = Promise.resolve();
          if (Array.isArray(basicObjs)) {
            basicObjs.forEach((cr) => {
              promises = promises.then(() => finalizeEvent(cr));
            });
          }
          return promises.then(() => null);
        });
    }

    options.workflows.on(
      ['project@pm-gov-ru.close'],
      e =>
        options.dataRepo.getItem(e.item, null, {forceEnrichment: [['basicObjs']]})
          .then((item) => {
            const basicObjs = item.getAggregates('basicObjs');
            let promises = Promise.resolve();
            if (Array.isArray(basicObjs)) {
              basicObjs.forEach((cr) => {
                promises = promises.then(() => finalizeEvent(cr));
              });
            }
            return promises.then(() => null);
          })
    );

    options.workflows.on(
      ['eventBasic@pm-gov-ru.mapAIP'],
      e => aipConfig.hasOwnProperty(e.item.get('type')) ?
        createAip(aipConfig[e.item.get('type')], e.item).then(() => null) :
        null
    );

    options.workflows.on(
      ['assignmentBasic@pm-gov-ru.fin'],
      (e) => {
        if (e.transition === 'toKT') {
          return options.dataRepo.getItem(e.item, null, {forceEnrichment: [['meeting','basicObj'],['basicObj']]})
            .then((item) => {
              const data = {
                basicObj: item.property('meeting.basicObj').evaluate() || item.property('basicObj').evaluate(),
                name: item.get('name'),
                owner: item.get('owner'),
                datePlannedEnd: e.item.get('datePlannedEnd'),
                priority: e.item.get('priority'),
                descript: e.item.get('descript')
              };
              return options.dataRepo.createItem('eventControl@pm-gov-ru', data, null, {user: e.user});
            });
        }
        return Promise.resolve();
      }
    );

    function collectionToArchive(item, collection) {
      const cp = item.property(collection).evaluate();
      const p = cp ? Promise.resolve(cp) : options.dataRepo.getAssociationsList(item, collection);
      return p.then((coll) => {
        let p2 = Promise.resolve();
        coll.forEach((i) => {
          p2 = p2
            .then(() => options.dataRepo.editItem(i.getMetaClass().getCanonicalName(), i.getItemId(), {archive: true}));
        });
        return p2;
      });
    }

    options.workflows.on(
      ['proposal@pm-gov-ru.accept'],
      (e) => {
        if (e.transition == 'curatorToAccept') {
          return options.dataRepo.getItem(e.item, null, {forceEnrichment: [['basicObjs'], ['project']]})
            .then((proposal) => {
              let tp = proposal.get('typeProposal');
              let data = {
                code: proposal.get('code').replace('proposal_', ''),
                name: proposal.get('name'),
                datePlannedStart: proposal.get('datePlannedStart'),
                datePlannedEnd: proposal.get('datePlannedEnd'),
                dateStart: proposal.get('dateStart'),
                dateEnd: proposal.get('dateEnd'),
                priority: proposal.get('priority'),
                curator: proposal.get('curator'),
                head: proposal.get('head')
              };
              let result = Promise.resolve();
              if (tp === 'project') {
                data.administrator = proposal.get('administrator');
                result = result
                  .then(() => options.dataRepo.createItem('project@pm-gov-ru', data, null, {user: e.user}))
                  .then((project) => {
                    const events = proposal.getAggregates('basicObjs');
                    let result = Promise.resolve();
                    if (Array.isArray(events)) {
                      events.forEach((event) => {
                        result = result.then(() => options.dataRepo.editItem(
                          event.getMetaClass().getCanonicalName(),
                          event.getItemId(),
                          {basicObj: project}
                        ));
                      });
                    }
                    return result;
                  });
              } else if (tp === 'program') {
                result = result
                  .then(() => options.dataRepo.createItem('program@pm-gov-ru', data, null, {user: e.user}))
                  .then((program) => {
                    const projects = proposal.getAggregates('project');
                    let result = Promise.resolve();
                    if (Array.isArray(projects)) {
                      projects.forEach((project) => {
                        result = result.then(() => options.dataRepo.put(program, 'project', [project]));
                      });
                    }
                    return result;
                  });
              }
              return result.then(() => null);
            });
        }
        return Promise.resolve();
      }
    );

    function collectionToArchive (item, collection) {
      let cp = item.property(collection).evaluate();
      let p = cp ? Promise.resolve(cp) : options.dataRepo.getAssociationsList(item, collection);
      return p.then((coll) => {
        let p2 = Promise.resolve();
        coll.forEach((i) => {
          p2 = p2.then(() => options.dataRepo.editItem(i.getMetaClass().getCanonicalName(), i.getItemId(), {archive: true}));
        });
        return p2;
      });
    }

    options.workflows.on(
      ['proposal@pm-gov-ru.cancel'],
      (e) => {
        if (e.transition === 'curatorToCancel') {
          return options.dataRepo.editItem(e.item.getMetaClass().getCanonicalName(), e.item.getItemId(), {archive: true})
            .then(
              item => collectionToArchive(item, 'proposals')
                .then(() => collectionToArchive(item, 'eventBlock'))
                .then(() => collectionToArchive(item, 'project'))
            );
        }
        return Promise.resolve();
      }
    );

    const work = ivc({
      data: options.dataRepo,
      workflows: options.workflows,
      log: options.log
    });

    options.dataRepo.on(
      ['indicatorBudget@pm-gov-ru.create'],
      (e) => {
        if (e.item.get('status') !== 'edit') {
          return Promise.resolve(null);
        }
        let logger;
        if (options.changelogFactory) {
          logger = options.changelogFactory.logger(() => e.user.id());
        }
        return work(e.item, e.user, logger).then(() => null);
      }
    );
  };
}

module.exports = WorkflowEvents;
