/**
 * Created by krasilneg on 30.01.19.
 */
const prc = require('./project-report-creator');

/**
 *
 * @param options
 * @param {DataRepository} options.data
 * @param {ExportManager} options.exporter
 * @param {ResourceStorage} options.storage
 * @param {Logger} options.log
 * @param {String} [options.directory]
 * @param {{}} [options.params]
 * @param {Array} [options.eagerLoading]
 * @param {String} [options.lang]
 * @param {Number} [options.step]
 * @returns {Promise.<TResult>}
 */
module.exports = function (options) {
  const worker = prc(options);

  function step(offset) {
    let count = options.step || 100;
    return options.data.getList('project@pm-gov-ru', {offset: offset, count: count})
      .then((projects) => {
        let result = Promise.resolve();
        projects.forEach((p) => {
          result = result
            .then(
              () => worker(p, null, null, {
                params: options.params,
                eagerLoading: options.eagerLoading,
                lang: options.lang
              })
            )
            .catch(
              (err) => {
                if (options.log) {
                  options.log.error(err);
                } else {
                  console.error(err);
                }
              }
            );
        });
        result = result.then(() => {
          let msg = 'Обработано ' + (offset + projects.length) + ' проектов';
          if (options.log) {
            options.log.log(msg);
          } else {
            console.log(msg);
          }
        });
        if (projects.length === count) {
          result = result.then(() => step(offset + count));
        }
        return result;
      });
  }

  return step(0);
};