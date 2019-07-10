/**
 * Created by krasilneg on 16.06.18.
 */
const F = require('core/FunctionCodes');
/**
 * @param {{}} options
 * @param {WorkflowProvider} options.workflows
 * @param {DataRepository} options.data
 * @constructor
 */
function IndicatorWfHandler(options) {
  this.init = function () {
    options.workflows.on('indicatorBasic@pm-gov-ru.app', (e) => {
      let item = e.item;
      let values = item.property('indicatorValueBasic').evaluate();
      let p;
      if (!Array.isArray(values)) {
        p = options.data.getAssociationsList(item, 'indicatorValueBasic', {
          user: e.user,
          filter: {[F.EQUAL]: ['$state', 'plan']}
        });
      } else {
        p = Promise.resolve(values.filter(vi => vi.get('state') === 'plan'));
      }
      return p
        .then((values) => {
          let p = Promise.resolve();
          values.forEach((vi) => {
            p = p
              .then(() => options.data.editItem(vi.getClassName(), vi.getItemId(), {'state': 'wait'}, null, {user: e.user}))
              .then(vi => options.workflows.pushToState(vi, 'indicatorValueBasic@pm-gov-ru', 'wait', {user: e.user}))
              .catch(e => options.log ? options.log.error(e) : console.warn(e));
          });
          return p;
        })
        .then(() => null);
    });
  };
}

module.exports = IndicatorWfHandler;