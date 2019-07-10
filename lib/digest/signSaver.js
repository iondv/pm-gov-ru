/**
 * Created by kras on 27.10.16.
 */
'use strict';
const base64 = require('base64-js');
const buf = require('core/buffer');
const moment = require('moment');
const sanitize = require('sanitize-filename');

// jshint maxstatements: 30
/**
 * @param {{dataRepo: DataRepository, metaRepo: MetaRepository}} options
 * @constructor
 */
function SignSaver(options) {

  this.processSignature = function (attributes, signature, data) {
    let s = Array.isArray(signature) ? signature[0] : signature;
    let d = Array.isArray(data) ? data[0] : data;
    let signedFile = {
      name: d.attributes.className + '@' + d.attributes.id + '.sig',
      buffer: buf(base64.toByteArray(s))
    };
    //console.log(signature);
    //console.log(data);
    //console.log(attributes.className+'_SignSaver');
    if (attributes.className === 'indicatorValueBasic') {
      return options.dataRepo.getItem(d.attributes.className, d.attributes.id)
        .then(item => {
          if (!item) {
            throw new Error('объект не найден');
          }
          let date = item.get('date');
          if (date) {
            signedFile.name = `${sanitize(item.getItemId())}_${moment(date).format('DD.MM.YYYY')}.sig`;
          } else {
            throw new Error('не достаточно данных');
          }
        })
        .then(() => options.dataRepo.editItem(d.attributes.className, d.attributes.id, {sig: signedFile}))
        .then(() => signature);
    }
    return Promise.resolve(signature);
  };
}

module.exports = SignSaver;
