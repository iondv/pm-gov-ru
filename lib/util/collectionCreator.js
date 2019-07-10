/**
 * Created by krasilneg on 16.06.18.
 */
/**
 * Created by kras on 08.09.16.
 */
'use strict';

/**
 * @constructor
 * @param {{}} options
 * @param {DataRepository} options.data
 * @param {WorkflowProvider} options.workflows
 * @param {Calculator} options.calc
 * @param {ChangelogFactory} [options.changelogFactory]
 * @param {Logger} options.log
 * @param {{}} options.map
 */
function CollectionCreator(options) {

  function createElement(container, collection, cn, user, data, logger, push) {
    let p = options.data
      .createItem(cn, data, null, logger, {user: user})
      .then(item => options.data.put(container, collection, [item], logger, {user: user}).then(() => item));

    if (Array.isArray(push)) {
      push.forEach((state) => {
        let parts = state.split('.');
        p = p.then(item => options.workflows.pushToState(item, parts[0], parts[1], {user: user}).then(() => item));
      });
    }
    return p.catch(err => options.log.warn(err.message));
  }


  this.init = function () {
    for (let event in options.map) {
      if (options.map.hasOwnProperty(event)) {
        let event2 = event;
        if (event.indexOf('.') < 0 && event.indexOf(':') >= 0) {
          event2 = event.replace(':', '.');
        }
        options.workflows.on(event2, (e) => {
          let item = e.item;
          let u = e.user;
          if (options.map[event].hasOwnProperty(item.getClassName())) {
            let logger;
            if (u && options.changelogFactory) {
              logger = options.changelogFactory.logger(() => u.id());
            }

            let p = Promise.resolve();
            Object.keys(options.map[event][item.getClassName()]).forEach((collection) => {
              let config = options.map[event][item.getClassName()][collection];
              let cn = config.elementClass;

              if (Array.isArray(config.patterns)) {
                config.patterns.forEach((pattern) => {
                  let data = {};
                  if (pattern.values) {
                    Object.keys(pattern.values).forEach((nm) => {
                      let v = pattern.values[nm];
                      if (typeof v === 'object') {
                        let f = options.calc.parseFormula(v);
                        if (f) {
                          p = p.then(() => f.apply(item)).then((v) => {
                            data[nm] = v;
                          });
                        }
                      } else if (v && typeof v === 'string' && v[0] === '$') {
                        let p = item.property(v.substr(1));
                        if (!p) {
                          throw new Error('Атрибут "' + v.substr(1) + '" не найден в обьекте-контейнере.');
                        }
                        data[nm] = p.evaluate();
                      } else {
                        data[nm] = v;
                      }
                    });
                  }
                  p = p.then(() => createElement(item, collection, pattern.elementClass || cn, u, data, logger, pattern.push));
                });
              }
            });
            return p.then(() => null);
          }
        });
      }
    }
  };
}

module.exports = CollectionCreator;
