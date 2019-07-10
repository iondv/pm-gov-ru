/**
 * Created by krasilneg on 30.01.19.
 */
const moment = require('moment-timezone');

/**
 * @param {} options
 * @param {DataRepository} options.data
 * @param {ExportManager} options.exporter
 * @param {ResourceStorage} options.storage
 * @param {Logger} options.log
 * @param {String} [options.directory]
 * @param {String} [options.dayOffset]
 * @returns {Function}
 */
module.exports = function (options) {
  /**
   * @param {Item} item
   * @param {User} [user]
   * @param {ChangeLogger} [logger]
   * @param {{}} [opt]
   * @param {{}} [opt.params]
   * @param {Array} [opt.eagerLoading]
   * @param {String} [opt.lang]
   */
  return function (item, user, logger, opt) {
    let report;
    opt = opt || {};
    let md = (user && user.timeZone()) ? moment().tz(user.timeZone()) : moment();
    if (options.dayOffset) {
      md.subtract(options.dayOffset, 'days');
    }
    let d = md.toDate();
    let directory = md.format('YYYYMMDD');
    if (options.directory) {
      directory = options.directory.replace(/\$\{([^}]+)\}/g, (s, a) => item.get(a)) + '/' + directory;
    }

    return options.data
      .createItem(
        'reportProject@pm-gov-ru',
        {
          state: 'create',
          project: item.getItemId(),
          dateCreate: d
        },
        null,
        logger,
        {user}
      )
      .then((rp) => {
        report = rp;
        return options.exporter.itemExporters(item, {});
      })
      .then((exporters) => {
        let result = Promise.resolve();
        let files = [];
        exporters.forEach((exporter) => {
          let paramMeta = exporter.getParams();
          let params = opt.params || {};
          if (paramMeta) {
            for (let pn in paramMeta) {
              if (paramMeta.hasOwnProperty(pn)) {
                let dv = paramMeta[pn].getDefaultValue();
                if (!params.hasOwnProperty(pn) && !dv) {
                  return;
                }
                params[pn] = dv;
              }
            }
          }

          result = result
            .then(
              () => options.exporter.export(
                exporter.getName(),
                {
                  class: item.getMetaClass(),
                  item,
                  params,
                  eagerLoading: opt.eagerLoading,
                  user: user,
                  lang: opt.lang,
                  tz: user && user.timeZone(),
                  forceForeground: true
                }
              )
            )
            .then((data) => {
              const fn = exporter.getFileName({item, params});
              return options.storage
                .accept(
                  data,
                  directory,
                  {
                    name: fn,
                    mimeType: exporter.getMimeType()
                  }
                )
                .then(f => options.data
                  .createItem(
                    'fileCol@pm-gov-ru',
                    {
                      name: fn,
                      dateCreate: d,
                      file: f.id
                    },
                    null,
                    logger,
                    {user}
                  )
                )
                .then((f) => {
                  files.push(f);
                });
            });
        });
        return result.then(() => options.data.put(report, 'files', files, logger, {user}));
      })
      .then(
        () => options.data.editItem(report.getClassName(), report.getItemId(), {state: 'check'}, logger, {user})
      )
      .then(() => true);
  };
};